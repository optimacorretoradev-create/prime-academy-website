/** Valores em Kwanzas (AOA) por curso — alinhado ao catálogo Prime Academy */
const COURSE_PRICE_AOA: Record<string, number> = {
  '1': 45_000,
  '2': 35_000,
  '3': 40_000,
  '4': 48_000,
  '5': 42_000,
  '6': 38_000,
  '7': 60_000,
  '8': 45_000,
  '9': 55_000,
  '10': 52_000,
  '11': 44_000,
  '12': 36_000,
  '13': 50_000,
  '14': 47_000,
  '15': 50_000,
}

const DEFAULT_PRICE_AOA = 50_000

/** Ex.: 50000 → "50.000Kz" */
export function formatKwanza(amount: number): string {
  const withDots = Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return `${withDots}Kz`
}

export function getCoursePriceAmount(courseId: string): number {
  return COURSE_PRICE_AOA[courseId] ?? DEFAULT_PRICE_AOA
}

export function getCoursePriceDisplay(courseId: string, storedPrice?: string): string {
  const normalizedPrice = storedPrice?.trim()

  if (!normalizedPrice) {
    return ''
  }

  if (normalizedPrice.toLowerCase() === 'sob consulta' || normalizedPrice.toLowerCase() === 'consulta') {
    return ''
  }

  if (/\d/.test(normalizedPrice)) {
    const digits = parseInt(normalizedPrice.replace(/\D/g, ''), 10)
    if (!Number.isNaN(digits) && digits > 0) {
      return formatKwanza(digits)
    }
  }

  return ''
}
