import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Header } from '@/components/Header'
import { Overview } from '@/components/Overview'
import { SchoolsTab } from '@/components/SchoolsTab'
import { ModelTab } from '@/components/ModelTab'
import { InsightsTab } from '@/components/InsightsTab'
import { LanguageProvider, useLang } from '@/context/LanguageContext'
import { models } from '@/data/models'
import { t } from '@/data/i18n'

function AppContent() {
  const { lang } = useLang()

  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <Tabs defaultValue="overview">
          <TabsList variant="line" className="mb-8 flex-wrap">
            <TabsTrigger value="overview">{t('tab.overview', lang)}</TabsTrigger>
            <TabsTrigger value="schools">{t('tab.schools', lang)}</TabsTrigger>
            {models.map(m => (
              <TabsTrigger key={m.id} value={m.id}>
                {m.nameEn}
              </TabsTrigger>
            ))}
            <TabsTrigger value="insights">{t('tab.insights', lang)}</TabsTrigger>
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
        </Tabs>

        <footer className="mt-12 text-center text-xs text-muted-foreground">
          {t('footer.text', lang)}
        </footer>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  )
}
