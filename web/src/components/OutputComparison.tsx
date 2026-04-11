import { useState } from 'react'
import { useLang } from '@/context/LanguageContext'
import { schools, schoolColors } from '@/data/schools'
import type { SchoolId } from '@/data/schools'
import { outputSamples } from '@/data/output-samples'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SchoolDot } from './SchoolDot'
import { AnimatedCard } from './AnimatedCard'
import { motion, AnimatePresence } from 'framer-motion'

const schoolIds: SchoolId[] = ['mohist', 'military', 'logician', 'confucian', 'dao', 'legal']

export function OutputComparison() {
  const { lang } = useLang()
  const [selected, setSelected] = useState<SchoolId>('mohist')

  const baseline = outputSamples.find(s => s.school === 'baseline')!
  const sample = outputSamples.find(s => s.school === selected)!
  const school = schools.find(s => s.id === selected)!
  const color = schoolColors[selected]

  return (
    <section>
      <h2 className="mb-2 text-xl font-semibold text-foreground">
        {lang === 'en' ? 'Output Transformation' : '输出转变'}
      </h2>
      <p className="mb-6 text-sm text-muted-foreground">
        {lang === 'en'
          ? 'GLM-4.7 (widest dynamic range: 13.1×). Select a school to see how it transforms the baseline output. Highlighted lines are changes introduced by the school.'
          : 'GLM-4.7（最大动态范围：13.1倍）。选择学派查看其如何转变基准输出。高亮行为学派引入的变化。'}
      </p>

      {/* School selector pills */}
      <div className="mb-6 flex flex-wrap gap-2">
        {schoolIds.map(id => {
          const s = schools.find(x => x.id === id)!
          const isActive = id === selected
          return (
            <motion.button
              key={id}
              onClick={() => setSelected(id)}
              className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors"
              style={{
                borderColor: isActive ? schoolColors[id] : undefined,
                backgroundColor: isActive ? `${schoolColors[id]}18` : undefined,
                color: isActive ? schoolColors[id] : undefined,
              }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <SchoolDot school={id} />
              {lang === 'en' ? s.nameEn : s.nameZh}
              <span className="ml-1 opacity-60">{outputSamples.find(x => x.school === id)!.change}</span>
            </motion.button>
          )
        })}
      </div>

      {/* Side-by-side code comparison */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Baseline */}
        <AnimatedCard index={0}>
          <Card className="border-l-4" style={{ borderLeftColor: '#B0A8A0' }}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between text-sm">
                <span style={{ color: '#B0A8A0' }}>
                  {lang === 'en' ? 'Baseline' : '基准'}
                </span>
                <span className="text-xs font-normal text-muted-foreground">
                  {baseline.sizeBytes} B · {baseline.returnType}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="overflow-x-auto rounded-lg bg-muted/40 p-3 text-[11px] leading-relaxed font-mono">
                {baseline.code.map((line, i) => (
                  <div key={i} className="px-1">
                    {line.text || '\u00A0'}
                  </div>
                ))}
              </pre>
            </CardContent>
          </Card>
        </AnimatedCard>

        {/* Selected school */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selected}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          >
            <Card className="h-full border-l-4" style={{ borderLeftColor: color }}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2" style={{ color }}>
                    <SchoolDot school={selected} />
                    {lang === 'en' ? school.nameEn : school.nameZh}
                  </span>
                  <span className="text-xs font-normal text-muted-foreground">
                    {sample.sizeBytes} B · {sample.returnType} ·{' '}
                    <span className="font-semibold" style={{ color }}>{sample.change}</span>
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="overflow-x-auto rounded-lg bg-muted/40 p-3 text-[11px] leading-relaxed font-mono">
                  {sample.code.map((line, i) => (
                    <div
                      key={i}
                      className="px-1 rounded-sm"
                      style={{
                        backgroundColor: line.type === 'added' ? `${color}15` : undefined,
                        borderLeft: line.type === 'added' ? `2px solid ${color}` : '2px solid transparent',
                      }}
                    >
                      {line.text || '\u00A0'}
                    </div>
                  ))}
                </pre>
                <p className="mt-3 text-[11px] text-muted-foreground">
                  {lang === 'en' ? sample.noteEn : sample.noteZh}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
