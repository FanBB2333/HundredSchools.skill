import { motion } from 'framer-motion'
import { LanguageToggle } from './LanguageToggle'
import { useLang } from '@/context/LanguageContext'
import { t } from '@/data/i18n'

export function Header() {
  const { lang } = useLang()

  return (
    <header className="relative overflow-hidden bg-gradient-to-br from-[#2D2B2E] via-[#3A3538] to-[#4A4346] px-6 py-10 text-center text-white">
      {/* subtle animated bg circle */}
      <motion.div
        className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/[0.03]"
        animate={{ scale: [1, 1.15, 1], opacity: [0.03, 0.06, 0.03] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="relative mx-auto max-w-4xl">
        <div className="flex items-center justify-end mb-6">
          <LanguageToggle />
        </div>
        <motion.h1
          className="text-3xl font-bold tracking-tight sm:text-4xl"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        >
          {t('header.title', lang)}
        </motion.h1>
        <motion.p
          className="mt-2 text-base text-white/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.5 }}
        >
          {t('header.subtitle', lang)}
        </motion.p>
        <motion.p
          className="mt-3 text-sm text-white/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.5 }}
        >
          {t('header.meta', lang)}
        </motion.p>
        <motion.p
          className="mt-1 text-xs text-white/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.5 }}
        >
          {t('header.prompt', lang)}
        </motion.p>
      </div>
    </header>
  )
}
