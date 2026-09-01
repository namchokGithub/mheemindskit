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
import { Base64Page, HtmlEncodeDecodePage, RandomStringPage, UnixTimestampPage, UrlEncodeDecodePage, UuidPage } from '@/pages/quick-tools-pages'
import { XmlFormatterPage } from '@/pages/xml-formatter-page'
import { JoinTextPage, MakeOneLinePage, MarkdownPage, RemoveSpacesPage, SplitTextPage, TextDecorationPage } from '@/pages/text-tools-pages'

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
          <Route path="/text-tools/remove-spaces" element={<RemoveSpacesPage />} />
          <Route path="/text-tools/make-one-line" element={<MakeOneLinePage />} />
          <Route path="/text-tools/text-decoration" element={<TextDecorationPage />} />
          <Route path="/text-tools/markdown" element={<MarkdownPage />} />
          <Route path="/text-tools/split-text" element={<SplitTextPage />} />
          <Route path="/text-tools/join-text" element={<JoinTextPage />} />
          <Route path="/encode-decode/base64" element={<Base64Page />} />
          <Route path="/encode-decode/url" element={<UrlEncodeDecodePage />} />
          <Route path="/encode-decode/html" element={<HtmlEncodeDecodePage />} />
          <Route path="/generators/uuid" element={<UuidPage />} />
          <Route path="/generators/random-string" element={<RandomStringPage />} />
          <Route path="/converters/unix-timestamp" element={<UnixTimestampPage />} />
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
