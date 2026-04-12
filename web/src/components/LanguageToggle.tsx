import { motion } from 'framer-motion'
import { useLang } from '@/context/LanguageContext'
import { useNavigate, useParams } from 'react-router-dom'

export function LanguageToggle() {
  const { lang } = useLang()
  const navigate = useNavigate()
  const { tab } = useParams<{ tab: string }>()

  const handleToggle = () => {
    const newLang = lang === 'en' ? 'zh' : 'en'
    navigate(`/${newLang}/${tab || 'overview'}`)
  }

  return (
    <button
      onClick={handleToggle}
      className="relative flex items-center gap-1 rounded-full bg-white/10 px-1 py-1 text-xs font-medium backdrop-blur-sm transition-colors hover:bg-white/20"
    >
      <span
        className={`relative z-10 px-2.5 py-1 transition-colors duration-200 ${lang === 'en' ? 'text-white' : 'text-white/60'}`}
      >
        EN
      </span>
      <span
        className={`relative z-10 px-2.5 py-1 transition-colors duration-200 ${lang === 'zh' ? 'text-white' : 'text-white/60'}`}
      >
        中
      </span>
      <motion.div
        className="absolute top-1 h-[calc(100%-8px)] w-[calc(50%-4px)] rounded-full bg-white/20"
        animate={{ left: lang === 'en' ? 4 : '50%' }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </button>
  )
}
