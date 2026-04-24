import { Routes, Route, Navigate, useParams, useNavigate } from 'react-router-dom'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Header } from '@/components/Header'
import { Overview } from '@/components/Overview'
import { SchoolsTab } from '@/components/SchoolsTab'
import { ModelTab } from '@/components/ModelTab'
import { InsightsTab } from '@/components/InsightsTab'
import { XGuardTab } from '@/components/XGuardTab'
import { BenchmarkTab } from '@/components/BenchmarkTab'
import { LanguageProvider, useLang } from '@/context/LanguageContext'
import { models } from '@/data/models'
import { t, type Lang } from '@/data/i18n'
import { useEffect } from 'react'

function AppLayout() {
  const { lang, tab } = useParams<{ lang: string; tab: string }>()
  const navigate = useNavigate()
  const { setLang, lang: contextLang } = useLang()

  // Sync route lang with context
  useEffect(() => {
    if (lang === 'en' || lang === 'zh') {
      if (lang !== contextLang) {
        setLang(lang as Lang)
      }
    }
  }, [lang, contextLang, setLang])

  const currentTab = tab || 'overview'

  const handleTabChange = (value: string) => {
    navigate(`/${lang}/${value}`)
  }

  // Determine valid tabs
  const validTabs = ['overview', 'schools', ...models.map(m => m.id), 'insights', 'xguard', 'benchmarks']
  if (!validTabs.includes(currentTab)) {
    return <Navigate to={`/${lang}/overview`} replace />
  }

  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <Tabs value={currentTab} onValueChange={handleTabChange}>
          <TabsList variant="line" className="mb-8 flex-wrap">
            <TabsTrigger value="overview">{t('tab.overview', contextLang)}</TabsTrigger>
            <TabsTrigger value="schools">{t('tab.schools', contextLang)}</TabsTrigger>
            {models.map(m => (
              <TabsTrigger key={m.id} value={m.id}>
                {m.nameEn}
              </TabsTrigger>
            ))}
            <TabsTrigger value="insights">{t('tab.insights', contextLang)}</TabsTrigger>
            <TabsTrigger value="xguard">{t('tab.xguard', contextLang)}</TabsTrigger>
            <TabsTrigger value="benchmarks">{t('tab.benchmarks', contextLang)}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Overview />
          </TabsContent>

          <TabsContent value="schools">
            <SchoolsTab />
          </TabsContent>

          {models.map(m => (
            <TabsContent key={m.id} value={m.id}>
              <ModelTab model={m} />
            </TabsContent>
          ))}

          <TabsContent value="insights">
            <InsightsTab />
          </TabsContent>

          <TabsContent value="xguard">
            <XGuardTab />
          </TabsContent>

          <TabsContent value="benchmarks">
            <BenchmarkTab />
          </TabsContent>
        </Tabs>

        <footer className="mt-12 text-center text-xs text-muted-foreground">
          {t('footer.text', contextLang)}
        </footer>
      </main>
    </div>
  )
}

function RedirectToDefault() {
  const userLang = navigator.language.startsWith('zh') ? 'zh' : 'en'
  return <Navigate to={`/${userLang}/overview`} replace />
}

export default function App() {
  return (
    <LanguageProvider>
      <Routes>
        <Route path="/:lang/:tab" element={<AppLayout />} />
        <Route path="/:lang" element={<Navigate to="overview" replace />} />
        <Route path="*" element={<RedirectToDefault />} />
      </Routes>
    </LanguageProvider>
  )
}
