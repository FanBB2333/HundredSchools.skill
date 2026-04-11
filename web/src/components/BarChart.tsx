import { motion } from 'framer-motion'
import { schoolColors } from '@/data/schools'
import type { SchoolId } from '@/data/schools'

interface BarChartProps {
  data: { label: string; value: number; school: SchoolId | 'baseline'; suffix?: string }[]
  maxValue?: number
}

const baselineColor = '#B0A8A0'

export function BarChart({ data, maxValue: maxOverride }: BarChartProps) {
  const maxValue = maxOverride ?? Math.max(...data.map(d => d.value))

  return (
    <div className="space-y-2">
      {data.map((item, i) => {
        const pct = Math.max((item.value / maxValue) * 100, 3)
        const color = item.school === 'baseline' ? baselineColor : schoolColors[item.school]

        return (
          <div key={item.label} className="flex items-center gap-3 text-sm">
            <span className="w-20 shrink-0 text-right text-xs font-medium text-muted-foreground">
              {item.label}
            </span>
            <div className="relative h-6 flex-1 overflow-hidden rounded bg-muted/50">
              <motion.div
                className="flex h-full items-center justify-end rounded px-2 text-[10px] font-semibold text-white"
                style={{ backgroundColor: color }}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{
                  type: 'spring',
                  stiffness: 80,
                  damping: 18,
                  delay: i * 0.06,
                }}
              >
                {item.suffix ?? `${item.value} B`}
              </motion.div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
