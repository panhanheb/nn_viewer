export const DEFAULT_SAMPLE_JSON = {
  application: {
    name: "JSON Viewer",
    version: "1.0.0",
    environment: "production",
    features: {
      treeView: true,
      codeEditor: true,
      search: true,
      export: true,
      maxNodesSupported: 1000000
    }
  },
  user: {
    id: 1001,
    name: "Nheb Panha",
    role: "Full Stack Engineer",
    active: true,
    avatar: null,
    contact: {
      email: "panha@example.com",
      location: {
        city: "Phnom Penh",
        country: "Cambodia",
        coordinates: {
          lat: 11.5564,
          lng: 104.9282
        }
      }
    },
    skills: [
      "Flutter",
      "Vue",
      "Nuxt",
      "TypeScript",
      "Tailwind CSS"
    ],
    experienceYears: 5
  },
  settings: {
    theme: "dark",
    notifications: true,
    autoFormatOnPaste: true,
    indentSize: 2
  }
}

export const DEFAULT_SAMPLE_STRING = JSON.stringify(DEFAULT_SAMPLE_JSON, null, 2)
