import { Route, Routes } from 'react-router-dom'
import { Toaster } from 'sonner'

import { AppShell } from '@/components/layout/app-shell'
import { tools } from '@/config/tools'
import { useTheme } from '@/hooks/use-theme'
import { ComingSoonPage } from '@/pages/coming-soon-page'
import { HomePage } from '@/pages/home-page'
import { JsonFormatterPage } from '@/pages/json-formatter-page'
import { JsonMinifierPage } from '@/pages/json-minifier-page'
import { JsonValidatorPage } from '@/pages/json-validator-page'
import { LicensePage } from '@/pages/license-page'
import { PrivacyPage } from '@/pages/privacy-page'
import { XmlFormatterPage } from '@/pages/xml-formatter-page'

export default function App() {
  const { theme } = useTheme()

  return (
    <>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/formatters/json" element={<JsonFormatterPage />} />
          <Route path="/formatters/json-minify" element={<JsonMinifierPage />} />
          <Route path="/formatters/json-validator" element={<JsonValidatorPage />} />
          <Route path="/formatters/xml" element={<XmlFormatterPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/license" element={<LicensePage />} />
          {tools
            .filter((tool) => tool.comingSoon)
            .map((tool) => (
              <Route key={tool.id} path={tool.path} element={<ComingSoonPage tool={tool} />} />
            ))}
        </Route>
      </Routes>
      <Toaster theme={theme} position="bottom-right" richColors closeButton />
    </>
  )
}
