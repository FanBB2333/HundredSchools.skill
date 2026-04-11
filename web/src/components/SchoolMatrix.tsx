import { useLang } from '@/context/LanguageContext'
import { schools, schoolColors } from '@/data/schools'
import type { SchoolId } from '@/data/schools'
import { behaviorMatrix } from '@/data/output-samples'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { SchoolDot } from './SchoolDot'
import { AnimatedCard } from './AnimatedCard'

const schoolOrder: SchoolId[] = ['mohist', 'military', 'logician', 'confucian', 'dao', 'legal']

export function SchoolMatrix() {
  const { lang } = useLang()

  return (
    <section>
      <h2 className="mb-2 text-xl font-semibold text-foreground">
        {lang === 'en' ? 'Cross-School Behavior Matrix' : '跨学派行为矩阵'}
      </h2>
      <p className="mb-6 text-sm text-muted-foreground">
        {lang === 'en'
          ? 'Same model (GLM-4.7), same prompt — how each school transforms output along key dimensions. Colored cells indicate deviation from baseline.'
          : '同一模型（GLM-4.7），同一提示词——各学派沿关键维度如何转变输出。着色单元格表示偏离基准。'}
      </p>

      <AnimatedCard index={0}>
        <Card>
          <CardContent className="overflow-x-auto pt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="sticky left-0 z-10 bg-card w-28 text-xs">
                    {lang === 'en' ? 'Dimension' : '维度'}
                  </TableHead>
                  <TableHead className="text-xs text-center min-w-[80px]" style={{ color: '#B0A8A0' }}>
                    {lang === 'en' ? 'Baseline' : '基准'}
                  </TableHead>
                  {schoolOrder.map(id => {
                    const s = schools.find(x => x.id === id)!
                    return (
                      <TableHead key={id} className="text-xs text-center min-w-[90px]">
                        <span className="flex items-center justify-center gap-1" style={{ color: schoolColors[id] }}>
                          <SchoolDot school={id} />
                          {lang === 'en' ? s.nameEn : s.nameZh}
                        </span>
                      </TableHead>
                    )
                  })}
                </TableRow>
              </TableHeader>
              <TableBody>
                {behaviorMatrix.map((row, ri) => (
                  <TableRow key={ri}>
                    <TableCell className="sticky left-0 z-10 bg-card text-xs font-medium whitespace-nowrap">
                      {lang === 'en' ? row.dimensionEn : row.dimensionZh}
                    </TableCell>
                    <TableCell className="text-xs text-center text-muted-foreground">
                      {row.baseline}
                    </TableCell>
                    {row.cells.map(cell => (
                      <TableCell
                        key={cell.school}
                        className="text-xs text-center"
                        style={{
                          backgroundColor: cell.differs ? `${schoolColors[cell.school]}12` : undefined,
                          color: cell.differs ? schoolColors[cell.school] : undefined,
                          fontWeight: cell.differs ? 500 : undefined,
                        }}
                      >
                        {cell.value}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </AnimatedCard>
    </section>
  )
}
