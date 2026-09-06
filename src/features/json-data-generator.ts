export type JsonFieldType =
  | "uuid"
  | "id"
  | "name"
  | "email"
  | "boolean"
  | "integer"
  | "decimal"
  | "datetime"
  | "text"
  | "enum";

export interface JsonGeneratorField {
  id: string;
  name: string;
  type: JsonFieldType;
  nullable: boolean;
  unique: boolean;
  enumValues: string;
}

export const jsonFieldTypes: { value: JsonFieldType; label: string }[] = [
  { value: "uuid", label: "UUID" },
  { value: "id", label: "Running ID" },
  { value: "name", label: "Full name" },
  { value: "email", label: "Email" },
  { value: "boolean", label: "Boolean" },
  { value: "integer", label: "Integer" },
  { value: "decimal", label: "Decimal" },
  { value: "datetime", label: "Date/time" },
  { value: "text", label: "Text" },
  { value: "enum", label: "Enum list" },
];

const FIRST_NAMES = [
  "Ada",
  "Alan",
  "Amara",
  "Anika",
  "Arun",
  "Elena",
  "Grace",
  "Hana",
  "Iris",
  "Kai",
  "Lina",
  "Mina",
  "Narin",
  "Noah",
  "Priya",
  "Sofia",
  "Kitti",
  "Nattawut",
  "Thanakorn",
  "Pakorn",
  "Phuri",
  "Warin",
  "Supakorn",
  "Arthit",
  "Chanikan",
  "Nicha",
  "Pimchanok",
  "Mintra",
  "Lalita",
  "Waranya",
  "Siriporn",
  "Orathai",
  "Anan",
  "Boonchai",
  "Chakrit",
  "Decha",
  "Ekkachai",
  "Jirawat",
  "Kritsada",
  "Manop",
  "Narong",
  "Preecha",
  "Ratchanon",
  "Sakda",
  "Somchai",
  "Thiraphat",
  "Veeraphat",
  "Wichai",
  "Akarin",
  "Chanon",
  "Kawin",
  "Napat",
  "Narin",
  "Pawin",
  "Phurin",
  "Tanawat",
  "Thanin",
  "Thana",
  "Kanyapak",
  "Nichanan",
  "Pimnara",
  "Ploychompoo",
  "Rinrada",
  "Sirada",
];
const LAST_NAMES = [
  "Baker",
  "Chen",
  "Davis",
  "Hopper",
  "Ibrahim",
  "Kim",
  "Lovelace",
  "Morgan",
  "Nguyen",
  "Patel",
  "Santos",
  "Taylor",
  "Wong",
  "Yamada",
  "Kittipong",
  "Chanpen",
  "Chaiwat",
  "Thongdee",
  "Boonmee",
  "Phongphiphat",
  "Rattanakul",
  "Srisuk",
  "Somboon",
  "Suwan",
  "Inkaew",
  "Udomsap",
  "Wongchai",
  "Sukprasert",
  "Akkaraphong",
  "Boonmak",
  "Chaiyasit",
  "Deesawat",
  "Jaroensuk",
  "Khamdee",
  "Maneerat",
  "Namsai",
  "Petchdee",
  "Ruangrit",
  "Saejang",
  "Sangthong",
  "Thammarat",
  "Wongsuwan",
  "Akarapong",
  "Boonthanom",
  "Chantarat",
  "Jirasakul",
  "Kanjanawat",
  "Kittikul",
  "Manochai",
  "Phongsathorn",
  "Rattanaporn",
  "Sakulchai",
  "Sinthavee",
  "Srisomboon",
  "Thanaporn",
  "Wattanapong",
];
const WORDS = [
  "amber",
  "atlas",
  "bamboo",
  "berry",
  "blaze",
  "bloom",
  "breeze",
  "brook",
  "cedar",
  "cloud",
  "coral",
  "crystal",
  "dawn",
  "delta",
  "dune",
  "echo",
  "ember",
  "fern",
  "field",
  "flame",
  "flora",
  "forest",
  "frost",
  "galaxy",
  "garden",
  "glow",
  "grove",
  "harbor",
  "haze",
  "hill",
  "honey",
  "island",
  "jade",
  "lake",
  "leaf",
  "light",
  "lily",
  "lotus",
  "lunar",
  "maple",
  "meadow",
  "mist",
  "moon",
  "moss",
  "nova",
  "oasis",
  "ocean",
  "olive",
  "opal",
  "orchid",
  "pearl",
  "pine",
  "plum",
  "pond",
  "rain",
  "reef",
  "river",
  "rose",
  "sand",
  "shadow",
  "shore",
  "sky",
  "snow",
  "solar",
  "spark",
  "spring",
  "star",
  "stone",
  "storm",
  "sunny",
  "tide",
  "trail",
  "tree",
  "valley",
  "violet",
  "wave",
  "willow",
  "wind",
  "winter",
  "wood",
  "acorn",
  "birch",
  "canyon",
  "clover",
  "drift",
  "elm",
  "feather",
  "glacier",
  "ivy",
  "lagoon",
  "marble",
  "petal",
  "raven",
  "ridge",
  "sage",
  "shell",
  "spruce",
  "summit",
  "thunder",
  "zenith",
];

function randomIndex(length: number): number {
  if (length < 1) throw new Error("Cannot choose from an empty list.");
  const limit = Math.floor(0x1_0000_0000 / length) * length;
  const values = new Uint32Array(1);
  do crypto.getRandomValues(values);
  while (values[0] >= limit);
  return values[0] % length;
}

function randomUnit(): number {
  const values = new Uint32Array(1);
  crypto.getRandomValues(values);
  return values[0] / 0x1_0000_0000;
}

function randomUuid(): string {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = [...bytes]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function words(count: number): string {
  return Array.from(
    { length: count },
    () => WORDS[randomIndex(WORDS.length)],
  ).join(" ");
}

function enumValues(field: JsonGeneratorField): string[] {
  const values = field.enumValues
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  if (!values.length)
    throw new Error(`Field “${field.name}” needs at least one enum value.`);
  return values;
}

function generateValue(field: JsonGeneratorField, index: number): unknown {
  switch (field.type) {
    case "uuid":
      return randomUuid();
    case "id":
      return index + 1;
    case "name":
      return `${FIRST_NAMES[randomIndex(FIRST_NAMES.length)]} ${LAST_NAMES[randomIndex(LAST_NAMES.length)]}`;
    case "email":
      return `${FIRST_NAMES[randomIndex(FIRST_NAMES.length)].toLowerCase()}.${LAST_NAMES[randomIndex(LAST_NAMES.length)].toLowerCase()}${randomIndex(10_000)}@example.test`;
    case "boolean":
      return randomIndex(2) === 1;
    case "integer":
      return randomIndex(10_000);
    case "decimal":
      return Number((randomUnit() * 10_000).toFixed(2));
    case "datetime":
      return new Date(
        Date.now() - randomIndex(365 * 24 * 60 * 60) * 1000,
      ).toISOString();
    case "text":
      return words(3 + randomIndex(4));
    case "enum": {
      const values = enumValues(field);
      return values[randomIndex(values.length)];
    }
  }
}

export function generateJsonData(
  fields: JsonGeneratorField[],
  count: number,
): Record<string, unknown>[] {
  if (!Number.isInteger(count) || count < 1 || count > 1000)
    throw new Error("Record count must be between 1 and 1000.");
  if (!fields.length) throw new Error("Add at least one field.");
  const names = fields.map((field) => field.name.trim());
  if (names.some((name) => !name)) throw new Error("Every field needs a name.");
  if (new Set(names).size !== names.length)
    throw new Error("Field names must be unique.");

  const uniqueValues = new Map(
    fields
      .filter((field) => field.unique)
      .map((field) => [field.id, new Set<string>()]),
  );
  return Array.from({ length: count }, (_, rowIndex) =>
    Object.fromEntries(
      fields.map((field) => {
        if (field.nullable && randomIndex(10) === 0)
          return [field.name.trim(), null];
        const values = uniqueValues.get(field.id);
        let value: unknown;
        for (let attempt = 0; attempt < 50; attempt++) {
          value = generateValue(field, rowIndex);
          if (!values || !values.has(JSON.stringify(value))) break;
        }
        if (values) {
          const key = JSON.stringify(value);
          if (values.has(key))
            throw new Error(
              `Could not generate a unique value for “${field.name}”. Change its type or disable unique.`,
            );
          values.add(key);
        }
        return [field.name.trim(), value];
      }),
    ),
  );
}
