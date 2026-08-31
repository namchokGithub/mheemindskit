import exampleJson from '@/assets/example/_example-json.json?raw'
import exampleXml from '@/assets/example/_example-xml.json'

const JSON_SAMPLES: string[] = (JSON.parse(exampleJson) as unknown[]).map((item) =>
  JSON.stringify(item, null, 2),
)

export function getRandomSampleJson(): string {
  const index = Math.floor(Math.random() * JSON_SAMPLES.length)
  return JSON_SAMPLES[index]
}

const XML_SAMPLES: string[] = exampleXml

export function getRandomSampleXml(): string {
  const index = Math.floor(Math.random() * XML_SAMPLES.length)
  return XML_SAMPLES[index]
}
