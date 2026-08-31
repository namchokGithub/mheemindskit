import { Route, Routes } from 'react-router-dom'

import { AppShell } from '@/components/layout/app-shell'
import { HomePage } from '@/pages/home-page'
import { JsonFormatterPage } from '@/pages/json-formatter-page'
import { JsonMinifierPage } from '@/pages/json-minifier-page'
import { JsonValidatorPage } from '@/pages/json-validator-page'
import { XmlFormatterPage } from '@/pages/xml-formatter-page'

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/formatters/json" element={<JsonFormatterPage />} />
        <Route path="/formatters/json-minify" element={<JsonMinifierPage />} />
        <Route path="/formatters/json-validator" element={<JsonValidatorPage />} />
        <Route path="/formatters/xml" element={<XmlFormatterPage />} />
      </Route>
    </Routes>
  )
}
