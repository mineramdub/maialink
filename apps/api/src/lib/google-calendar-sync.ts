import { google } from 'googleapis'
import { db } from './db.js'
import { calendarIntegrations, appointments, patients } from './schema.js'
import { eq, and, gte, isNull } from 'drizzle-orm'

function getOAuth2Client() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  )
}

async function refreshAccessTokenIfNeeded(integration: any) {
  // Vérifier si le token expire bientôt (dans les 5 prochaines minutes)
  const expiresAt = integration.googleTokenExpiresAt ? new Date(integration.googleTokenExpiresAt) : null
  const now = new Date()
  const fiveMinutes = 5 * 60 * 1000

  if (expiresAt && (expiresAt.getTime() - now.getTime()) < fiveMinutes) {
    // Token expire bientôt ou déjà expiré, rafraîchir
    const oauth2Client = getOAuth2Client()
    oauth2Client.setCredentials({
      refresh_token: integration.googleRefreshToken,
    })

    const { credentials } = await oauth2Client.refreshAccessToken()

    // Mettre à jour le token dans la BDD
    await db.update(calendarIntegrations)
      .set({
        googleAccessToken: credentials.access_token,
        googleTokenExpiresAt: credentials.expiry_date ? new Date(credentials.expiry_date) : null,
        updatedAt: new Date(),
      })
      .where(eq(calendarIntegrations.userId, integration.userId))

    return {
      ...integration,
      googleAccessToken: credentials.access_token,
      googleTokenExpiresAt: credentials.expiry_date ? new Date(credentials.expiry_date) : null,
    }
  }

  return integration
}

export async function syncGoogleCalendar(userId: string) {
  try {
    // Récupérer l'intégration
    let integration = await db.query.calendarIntegrations.findFirst({
      where: eq(calendarIntegrations.userId, userId),
    })

    if (!integration || !integration.googleAccessToken) {
      throw new Error('Intégration Google Calendar non trouvée')
    }

    if (!integration.syncEnabled) {
      throw new Error('Synchronisation désactivée')
    }

    // Rafraîchir le token si nécessaire
    integration = await refreshAccessTokenIfNeeded(integration)

    // Configurer le client OAuth
    const oauth2Client = getOAuth2Client()
    oauth2Client.setCredentials({
      access_token: integration.googleAccessToken,
      refresh_token: integration.googleRefreshToken,
    })

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client })

    let importedCount = 0
    let exportedCount = 0
    let updatedCount = 0
    let errors: string[] = []

    // Déterminer le calendrier à utiliser (par défaut: calendrier principal)
    const calendarId = integration.googleCalendarId || 'primary'

    // IMPORT: Google Calendar → MaiaLink
    if (integration.syncDirection === 'import' || integration.syncDirection === 'bidirectional') {
      try {
        // Récupérer les événements des 30 derniers jours et 90 prochains jours
        const timeMin = new Date()
        timeMin.setDate(timeMin.getDate() - 30)
        const timeMax = new Date()
        timeMax.setDate(timeMax.getDate() + 90)

        const response = await calendar.events.list({
          calendarId,
          timeMin: timeMin.toISOString(),
          timeMax: timeMax.toISOString(),
          singleEvents: true,
          orderBy: 'startTime',
        })

        const events = response.data.items || []

        for (const event of events) {
          try {
            // Vérifier si c'est un événement Doctolib (si le nom du calendrier est configuré)
            const isDoctolib = integration.doctolibCalendarName &&
              event.summary?.includes(integration.doctolibCalendarName)

            // Vérifier si l'événement existe déjà dans MaiaLink
            const existingAppointment = await db.query.appointments.findFirst({
              where: eq(appointments.googleCalendarEventId, event.id!),
            })

            if (existingAppointment) {
              // Mettre à jour si modifié
              if (event.updated && new Date(event.updated) > existingAppointment.updatedAt) {
                await db.update(appointments)
                  .set({
                    title: event.summary || 'Sans titre',
                    startTime: new Date(event.start?.dateTime || event.start?.date || ''),
                    endTime: new Date(event.end?.dateTime || event.end?.date || ''),
                    location: event.location,
                    notes: event.description,
                    status: event.status === 'cancelled' ? 'annule' : existingAppointment.status,
                    updatedAt: new Date(),
                    ...(isDoctolib && { doctolibId: event.id }),
                  })
                  .where(eq(appointments.id, existingAppointment.id))

                updatedCount++
              }
              continue
            }

            // Essayer de trouver le patient par nom (si présent dans le titre)
            // Format attendu: "Nom Prénom - Type de consultation"
            let patientId: string | null = null
            if (event.summary) {
              const patients = await db.query.patients.findMany({
                where: eq(patients.userId, userId),
              })

              for (const patient of patients) {
                const patientName = `${patient.lastName} ${patient.firstName}`.toLowerCase()
                if (event.summary.toLowerCase().includes(patientName)) {
                  patientId = patient.id
                  break
                }
              }
            }

            // Si pas de patient trouvé, créer un RDV avec un patient "à définir"
            // (on pourrait créer un patient temporaire ou laisser null selon les besoins)
            if (!patientId) {
              // Pour l'instant, on skip les événements sans patient identifiable
              continue
            }

            // Créer le rendez-vous
            await db.insert(appointments).values({
              userId,
              patientId,
              title: event.summary || 'Sans titre',
              type: 'autre', // Type par défaut, pourrait être déduit du titre
              startTime: new Date(event.start?.dateTime || event.start?.date || ''),
              endTime: new Date(event.end?.dateTime || event.end?.date || ''),
              location: event.location,
              notes: event.description,
              googleCalendarEventId: event.id,
              status: event.status === 'cancelled' ? 'annule' : 'planifie',
              ...(isDoctolib && { doctolibId: event.id }),
            })

            importedCount++
          } catch (eventError) {
            console.error(`Error processing event ${event.id}:`, eventError)
            errors.push(`Erreur événement ${event.summary}: ${eventError}`)
          }
        }
      } catch (importError) {
        console.error('Import error:', importError)
        errors.push(`Erreur import: ${importError}`)
      }
    }

    // EXPORT: MaiaLink → Google Calendar
    if (integration.syncDirection === 'export' || integration.syncDirection === 'bidirectional') {
      try {
        // Récupérer les RDV MaiaLink non synchronisés ou modifiés
        const timeMin = new Date()
        timeMin.setDate(timeMin.getDate() - 7) // Derniers 7 jours
        const timeMax = new Date()
        timeMax.setDate(timeMax.getDate() + 90) // 90 prochains jours

        const appointmentsToExport = await db.query.appointments.findMany({
          where: and(
            eq(appointments.userId, userId),
            gte(appointments.startTime, timeMin)
          ),
          with: {
            patient: true,
          },
        })

        for (const apt of appointmentsToExport) {
          try {
            const eventData = {
              summary: `${apt.patient?.lastName || ''} ${apt.patient?.firstName || ''} - ${apt.title}`,
              description: apt.notes || undefined,
              location: apt.location || undefined,
              start: {
                dateTime: apt.startTime.toISOString(),
                timeZone: 'Europe/Paris',
              },
              end: {
                dateTime: apt.endTime.toISOString(),
                timeZone: 'Europe/Paris',
              },
            }

            if (apt.googleCalendarEventId) {
              // Mettre à jour l'événement existant
              await calendar.events.update({
                calendarId,
                eventId: apt.googleCalendarEventId,
                requestBody: eventData,
              })
              updatedCount++
            } else {
              // Créer un nouvel événement
              const createdEvent = await calendar.events.insert({
                calendarId,
                requestBody: eventData,
              })

              // Mettre à jour le RDV avec l'ID Google
              await db.update(appointments)
                .set({
                  googleCalendarEventId: createdEvent.data.id,
                  updatedAt: new Date(),
                })
                .where(eq(appointments.id, apt.id))

              exportedCount++
            }
          } catch (eventError) {
            console.error(`Error exporting appointment ${apt.id}:`, eventError)
            errors.push(`Erreur export RDV ${apt.title}: ${eventError}`)
          }
        }
      } catch (exportError) {
        console.error('Export error:', exportError)
        errors.push(`Erreur export: ${exportError}`)
      }
    }

    // Mettre à jour la date de dernière synchronisation
    await db.update(calendarIntegrations)
      .set({
        lastSyncAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(calendarIntegrations.userId, userId))

    return {
      importedCount,
      exportedCount,
      updatedCount,
      errors,
      success: true,
    }
  } catch (error) {
    console.error('Sync error:', error)
    throw error
  }
}

// Fonction pour la synchronisation automatique (à appeler depuis un cron job)
export async function syncAllUsers() {
  try {
    const integrations = await db.query.calendarIntegrations.findMany({
      where: eq(calendarIntegrations.syncEnabled, true),
    })

    const results = []

    for (const integration of integrations) {
      try {
        const result = await syncGoogleCalendar(integration.userId)
        results.push({
          userId: integration.userId,
          ...result,
        })
      } catch (error) {
        console.error(`Sync failed for user ${integration.userId}:`, error)
        results.push({
          userId: integration.userId,
          success: false,
          error: String(error),
        })
      }
    }

    return results
  } catch (error) {
    console.error('Sync all users error:', error)
    throw error
  }
}
