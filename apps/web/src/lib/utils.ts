import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

export function formatDateTime(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function calculateAge(birthDate: Date | string): number {
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return age
}

export function calculateSA(ddr: Date | string): { weeks: number; days: number; total: number } {
  const today = new Date()
  const lastPeriod = new Date(ddr)
  const diffTime = today.getTime() - lastPeriod.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  const weeks = Math.floor(diffDays / 7)
  const days = diffDays % 7
  return { weeks, days, total: diffDays }
}

export function calculateDPA(ddr: Date | string): Date {
  const lastPeriod = new Date(ddr)
  const dpa = new Date(lastPeriod)
  dpa.setDate(dpa.getDate() + 280) // 40 semaines
  return dpa
}

export function calculateIMC(weight: number, height: number): number {
  const heightInMeters = height / 100
  return Math.round((weight / (heightInMeters * heightInMeters)) * 10) / 10
}

export function getIMCCategory(imc: number): { label: string; color: string; alert: boolean } {
  if (imc < 18.5) return { label: 'Insuffisance pondérale', color: 'text-orange-600', alert: true }
  if (imc < 25) return { label: 'Poids normal', color: 'text-green-600', alert: false }
  if (imc < 30) return { label: 'Surpoids', color: 'text-orange-500', alert: true }
  if (imc < 35) return { label: 'Obésité modérée', color: 'text-orange-600', alert: true }
  if (imc < 40) return { label: 'Obésité sévère', color: 'text-red-500', alert: true }
  return { label: 'Obésité morbide', color: 'text-red-700', alert: true }
}

export function generateSecureId(): string {
  return crypto.randomUUID()
}
