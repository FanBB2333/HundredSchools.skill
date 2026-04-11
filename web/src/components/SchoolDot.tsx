import { schoolColors } from '@/data/schools'
import type { SchoolId } from '@/data/schools'

export function SchoolDot({ school, className = '' }: { school: SchoolId; className?: string }) {
  return (
    <span
      className={`inline-block h-2.5 w-2.5 rounded-full ${className}`}
      style={{ backgroundColor: schoolColors[school] }}
    />
  )
}
