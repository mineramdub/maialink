import html2pdf from 'html2pdf.js'

interface ExportOptions {
  filename: string
  margins?: number[]
  format?: string
  orientation?: 'portrait' | 'landscape'
}

export class PDFExportService {
  /**
   * Exporte un élément HTML en PDF
   */
  static async exportElement(
    element: HTMLElement,
    options: ExportOptions
  ): Promise<void> {
    const opt = {
      margin: options.margins || [10, 10, 10, 10],
      filename: options.filename || 'document.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: {
        unit: 'mm',
        format: options.format || 'a4',
        orientation: options.orientation || 'portrait',
      },
    }

    return html2pdf().set(opt).from(element).save()
  }

  /**
   * Exporte du contenu HTML brut en PDF
   */
  static async exportHTML(html: string, options: ExportOptions): Promise<void> {
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = html
    tempDiv.style.position = 'absolute'
    tempDiv.style.left = '-9999px'
    document.body.appendChild(tempDiv)

    try {
      await this.exportElement(tempDiv, options)
    } finally {
      document.body.removeChild(tempDiv)
    }
  }

  /**
   * Génère un PDF de consultation
   */
  static async exportConsultation(consultation: any, patient: any): Promise<void> {
    const html = this.generateConsultationHTML(consultation, patient)
    await this.exportHTML(html, {
      filename: `consultation-${patient.lastName}-${new Date(consultation.date).toISOString().split('T')[0]}.pdf`,
      orientation: 'portrait',
    })
  }

  /**
   * Génère un PDF de compte-rendu de grossesse
   */
  static async exportGrossesse(grossesse: any, patient: any, consultations: any[]): Promise<void> {
    const html = this.generateGrossesseHTML(grossesse, patient, consultations)
    await this.exportHTML(html, {
      filename: `grossesse-${patient.lastName}.pdf`,
      orientation: 'portrait',
    })
  }

  /**
   * Génère un PDF d'ordonnance
   */
  static async exportOrdonnance(ordonnance: any, patient: any): Promise<void> {
    const html = this.generateOrdonnanceHTML(ordonnance, patient)
    await this.exportHTML(html, {
      filename: `ordonnance-${patient.lastName}-${new Date().toISOString().split('T')[0]}.pdf`,
      orientation: 'portrait',
    })
  }

  /**
   * Template HTML pour consultation
   */
  private static generateConsultationHTML(consultation: any, patient: any): string {
    return `
      <div style="font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 40px;">
          <h1 style="color: #1e293b; margin-bottom: 10px;">Compte-rendu de consultation</h1>
          <p style="color: #64748b; font-size: 14px;">
            ${new Date(consultation.date).toLocaleDateString('fr-FR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>

        <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
          <h2 style="color: #334155; font-size: 16px; margin-bottom: 15px;">Informations patiente</h2>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div><strong>Nom :</strong> ${patient.firstName} ${patient.lastName}</div>
            <div><strong>Date de naissance :</strong> ${new Date(patient.dateNaissance).toLocaleDateString('fr-FR')}</div>
            ${patient.email ? `<div><strong>Email :</strong> ${patient.email}</div>` : ''}
            ${patient.mobilePhone ? `<div><strong>Téléphone :</strong> ${patient.mobilePhone}</div>` : ''}
          </div>
        </div>

        <div style="margin-bottom: 25px;">
          <h2 style="color: #334155; font-size: 16px; margin-bottom: 10px; border-bottom: 2px solid #3b82f6; padding-bottom: 5px;">
            Motif de consultation
          </h2>
          <p style="color: #475569; line-height: 1.6;">${consultation.motif || 'Non spécifié'}</p>
        </div>

        ${consultation.examenClinique ? `
          <div style="margin-bottom: 25px;">
            <h2 style="color: #334155; font-size: 16px; margin-bottom: 10px; border-bottom: 2px solid #3b82f6; padding-bottom: 5px;">
              Examen clinique
            </h2>
            <pre style="color: #475569; line-height: 1.6; white-space: pre-wrap; font-family: Arial, sans-serif;">${consultation.examenClinique}</pre>
          </div>
        ` : ''}

        ${consultation.conclusion ? `
          <div style="margin-bottom: 25px;">
            <h2 style="color: #334155; font-size: 16px; margin-bottom: 10px; border-bottom: 2px solid #3b82f6; padding-bottom: 5px;">
              Conclusion
            </h2>
            <p style="color: #475569; line-height: 1.6;">${consultation.conclusion}</p>
          </div>
        ` : ''}

        ${consultation.conduite ? `
          <div style="margin-bottom: 25px;">
            <h2 style="color: #334155; font-size: 16px; margin-bottom: 10px; border-bottom: 2px solid #3b82f6; padding-bottom: 5px;">
              Conduite à tenir
            </h2>
            <p style="color: #475569; line-height: 1.6;">${consultation.conduite}</p>
          </div>
        ` : ''}

        <div style="margin-top: 60px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center;">
          <p style="color: #94a3b8; font-size: 12px;">
            Document généré par MaiaLink le ${new Date().toLocaleDateString('fr-FR')}
          </p>
        </div>
      </div>
    `
  }

  /**
   * Template HTML pour compte-rendu de grossesse
   */
  private static generateGrossesseHTML(grossesse: any, patient: any, consultations: any[]): string {
    const calculateSA = (ddr: string) => {
      const ddrDate = new Date(ddr)
      const today = new Date()
      const diffTime = today.getTime() - ddrDate.getTime()
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
      const weeks = Math.floor(diffDays / 7)
      const days = diffDays % 7
      return `${weeks} SA + ${days}j`
    }

    return `
      <div style="font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 40px;">
          <h1 style="color: #1e293b; margin-bottom: 10px;">Compte-rendu de suivi de grossesse</h1>
          <p style="color: #ec4899; font-size: 16px; font-weight: 600;">
            ${calculateSA(grossesse.ddr)}
          </p>
        </div>

        <div style="background: #fce7f3; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
          <h2 style="color: #831843; font-size: 16px; margin-bottom: 15px;">Informations patiente</h2>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div><strong>Nom :</strong> ${patient.firstName} ${patient.lastName}</div>
            <div><strong>Âge :</strong> ${patient.age || 'N/A'} ans</div>
            <div><strong>DDR :</strong> ${new Date(grossesse.ddr).toLocaleDateString('fr-FR')}</div>
            <div><strong>DPA :</strong> ${new Date(grossesse.dpa).toLocaleDateString('fr-FR')}</div>
          </div>
        </div>

        ${consultations.length > 0 ? `
          <div style="margin-bottom: 25px;">
            <h2 style="color: #334155; font-size: 16px; margin-bottom: 15px; border-bottom: 2px solid #ec4899; padding-bottom: 5px;">
              Historique des consultations (${consultations.length})
            </h2>
            ${consultations.map(c => `
              <div style="background: #f8fafc; padding: 15px; margin-bottom: 10px; border-left: 4px solid #ec4899;">
                <div style="display: flex; justify-between; margin-bottom: 5px;">
                  <strong style="color: #1e293b;">${new Date(c.date).toLocaleDateString('fr-FR')}</strong>
                  <span style="color: #64748b; font-size: 14px;">${c.type}</span>
                </div>
                ${c.motif ? `<p style="color: #475569; margin: 5px 0;">${c.motif}</p>` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}

        <div style="margin-top: 60px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center;">
          <p style="color: #94a3b8; font-size: 12px;">
            Document généré par MaiaLink le ${new Date().toLocaleDateString('fr-FR')}
          </p>
        </div>
      </div>
    `
  }

  /**
   * Template HTML pour ordonnance
   */
  private static generateOrdonnanceHTML(ordonnance: any, patient: any): string {
    return `
      <div style="font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 40px;">
          <h1 style="color: #1e293b; margin-bottom: 10px;">Ordonnance</h1>
          <p style="color: #64748b; font-size: 14px;">
            ${new Date().toLocaleDateString('fr-FR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>

        <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
          <h2 style="color: #334155; font-size: 16px; margin-bottom: 15px;">Patiente</h2>
          <div>
            <strong>Nom :</strong> ${patient.firstName} ${patient.lastName}<br/>
            <strong>Date de naissance :</strong> ${new Date(patient.dateNaissance).toLocaleDateString('fr-FR')}
          </div>
        </div>

        <div style="margin-bottom: 30px;">
          <h2 style="color: #334155; font-size: 16px; margin-bottom: 15px; border-bottom: 2px solid #7c3aed; padding-bottom: 5px;">
            Prescription
          </h2>
          <pre style="color: #475569; line-height: 2; white-space: pre-wrap; font-family: 'Courier New', monospace; font-size: 14px;">${ordonnance.content || ''}</pre>
        </div>

        <div style="margin-top: 80px; text-align: right;">
          <p style="color: #334155; margin-bottom: 60px;">
            Signature du praticien
          </p>
          <div style="border-top: 1px solid #94a3b8; width: 200px; margin-left: auto;"></div>
        </div>

        <div style="margin-top: 60px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center;">
          <p style="color: #94a3b8; font-size: 12px;">
            Document généré par MaiaLink le ${new Date().toLocaleDateString('fr-FR')}
          </p>
        </div>
      </div>
    `
  }
}
