/**
 * Comprehensive technology database for badges
 * Organized by category with shields.io metadata
 */

export interface TechCategory {
  name: string;
  technologies: string[];
}

// Categorized technology list
export const TECH_CATEGORIES: TechCategory[] = [
  {
    name: "Frontend Frameworks",
    technologies: [
      "React", "Next.js", "Vue.js", "Nuxt.js", "Angular", "Svelte", "SvelteKit",
      "Solid.js", "Qwik", "Preact", "Ember.js", "Astro", "Remix", "Gatsby"
    ]
  },
  {
    name: "Backend Frameworks",
    technologies: [
      "Node.js", "Express", "NestJS", "Fastify", "Koa", "Hapi",
      "Django", "Flask", "FastAPI", "Spring Boot", "ASP.NET", "Laravel",
      "Ruby on Rails", "Phoenix", "Gin", "Fiber", "Actix Web"
    ]
  },
  {
    name: "Programming Languages",
    technologies: [
      "TypeScript", "JavaScript", "Python", "Java", "C#", "Go", "Rust",
      "PHP", "Ruby", "Kotlin", "Swift", "C++", "C", "Dart", "Scala",
      "Elixir", "Haskell", "Clojure", "R", "MATLAB", "Lua"
    ]
  },
  {
    name: "Databases",
    technologies: [
      "PostgreSQL", "MySQL", "MongoDB", "Redis", "SQLite", "MariaDB",
      "Cassandra", "DynamoDB", "CouchDB", "Neo4j", "InfluxDB",
      "Elasticsearch", "Oracle", "Microsoft SQL Server", "Supabase",
      "Firebase Realtime Database", "Firestore"
    ]
  },
  {
    name: "Cloud & Infrastructure",
    technologies: [
      "AWS", "Azure", "GCP", "Docker", "Kubernetes", "Terraform",
      "Ansible", "Jenkins", "CircleCI", "GitHub Actions", "GitLab CI",
      "Vercel", "Netlify", "Heroku", "Railway", "Fly.io", "DigitalOcean",
      "Cloudflare", "Nginx", "Apache"
    ]
  },
  {
    name: "Mobile Development",
    technologies: [
      "React Native", "Flutter", "Ionic", "Xamarin", "SwiftUI",
      "Jetpack Compose", "Expo", "Capacitor", "Cordova"
    ]
  },
  {
    name: "Styling & UI",
    technologies: [
      "TailwindCSS", "Styled Components", "Sass", "CSS", "Less",
      "Bootstrap", "Material-UI", "Chakra UI", "shadcn/ui",
      "Ant Design", "Mantine", "Radix UI", "Headless UI"
    ]
  },
  {
    name: "Testing",
    technologies: [
      "Jest", "Vitest", "Cypress", "Playwright", "Testing Library",
      "Mocha", "Chai", "Selenium", "Puppeteer", "JUnit", "pytest",
      "RSpec", "Jasmine", "Karma"
    ]
  },
  {
    name: "Build Tools & Bundlers",
    technologies: [
      "Webpack", "Vite", "Turbopack", "esbuild", "Rollup", "Parcel",
      "SWC", "Babel", "Gulp", "Grunt"
    ]
  },
  {
    name: "Version Control & Collaboration",
    technologies: [
      "Git", "GitHub", "GitLab", "Bitbucket", "Mercurial", "SVN"
    ]
  },
  {
    name: "APIs & Data",
    technologies: [
      "GraphQL", "REST API", "tRPC", "gRPC", "WebSocket", "Apollo",
      "Prisma", "TypeORM", "Sequelize", "Drizzle", "Mongoose"
    ]
  },
  {
    name: "State Management",
    technologies: [
      "Redux", "Zustand", "Jotai", "Recoil", "MobX", "XState", "Pinia", "Vuex"
    ]
  },
  {
    name: "Backend Services",
    technologies: [
      "Firebase", "Supabase", "Appwrite", "PlanetScale", "Neon",
      "Auth0", "Clerk", "NextAuth.js", "Passport.js"
    ]
  },
  {
    name: "Desktop Development",
    technologies: [
      "Electron", "Tauri", "Qt", ".NET MAUI", "WPF"
    ]
  },
  {
    name: "Game Development",
    technologies: [
      "Unity", "Unreal Engine", "Godot", "Three.js", "Babylon.js"
    ]
  },
  {
    name: "Data Science & ML",
    technologies: [
      "TensorFlow", "PyTorch", "scikit-learn", "Pandas", "NumPy",
      "Keras", "OpenCV", "Jupyter", "Apache Spark"
    ]
  },
  {
    name: "Monitoring & Analytics",
    technologies: [
      "Sentry", "Datadog", "New Relic", "Prometheus", "Grafana",
      "Google Analytics", "Mixpanel", "Amplitude"
    ]
  }
];

// Flattened list of all technologies (sorted alphabetically)
export const ALL_TECHNOLOGIES = TECH_CATEGORIES
  .flatMap(category => category.technologies)
  .sort();

// Tech color mapping for shields.io badges (hex without #)
export const TECH_COLORS: Record<string, string> = {
  // Frontend Frameworks
  "React": "61DAFB",
  "Next.js": "000000",
  "Vue.js": "4FC08D",
  "Nuxt.js": "00DC82",
  "Angular": "DD0031",
  "Svelte": "FF3E00",
  "SvelteKit": "FF3E00",
  "Solid.js": "2C4F7C",
  "Qwik": "AC7EF4",
  "Preact": "673AB8",
  "Ember.js": "E04E39",
  "Astro": "FF5D01",
  "Remix": "000000",
  "Gatsby": "663399",

  // Backend Frameworks
  "Node.js": "339933",
  "Express": "000000",
  "NestJS": "E0234E",
  "Fastify": "000000",
  "Koa": "33333D",
  "Hapi": "EA9D1D",
  "Django": "092E20",
  "Flask": "000000",
  "FastAPI": "009688",
  "Spring Boot": "6DB33F",
  "ASP.NET": "512BD4",
  "Laravel": "FF2D20",
  "Ruby on Rails": "CC0000",
  "Phoenix": "FD4F00",
  "Gin": "00ADD8",
  "Fiber": "00ACD7",
  "Actix Web": "000000",

  // Programming Languages
  "TypeScript": "3178C6",
  "JavaScript": "F7DF1E",
  "Python": "3776AB",
  "Java": "007396",
  "C#": "239120",
  "Go": "00ADD8",
  "Rust": "000000",
  "PHP": "777BB4",
  "Ruby": "CC342D",
  "Kotlin": "7F52FF",
  "Swift": "F05138",
  "C++": "00599C",
  "C": "A8B9CC",
  "Dart": "0175C2",
  "Scala": "DC322F",
  "Elixir": "4B275F",
  "Haskell": "5D4F85",
  "Clojure": "5881D8",
  "R": "276DC3",
  "MATLAB": "0076A8",
  "Lua": "2C2D72",

  // Databases
  "PostgreSQL": "4169E1",
  "MySQL": "4479A1",
  "MongoDB": "47A248",
  "Redis": "DC382D",
  "SQLite": "003B57",
  "MariaDB": "003545",
  "Cassandra": "1287B1",
  "DynamoDB": "4053D6",
  "CouchDB": "E42528",
  "Neo4j": "008CC1",
  "InfluxDB": "22ADF6",
  "Elasticsearch": "005571",
  "Oracle": "F80000",
  "Microsoft SQL Server": "CC2927",
  "Supabase": "3ECF8E",
  "Firebase Realtime Database": "FFCA28",
  "Firestore": "FFCA28",

  // Cloud & Infrastructure
  "AWS": "FF9900",
  "Azure": "0078D4",
  "GCP": "4285F4",
  "Docker": "2496ED",
  "Kubernetes": "326CE5",
  "Terraform": "7B42BC",
  "Ansible": "EE0000",
  "Jenkins": "D24939",
  "CircleCI": "343434",
  "GitHub Actions": "2088FF",
  "GitLab CI": "FC6D26",
  "Vercel": "000000",
  "Netlify": "00C7B7",
  "Heroku": "430098",
  "Railway": "0B0D0E",
  "Fly.io": "7B3FF2",
  "DigitalOcean": "0080FF",
  "Cloudflare": "F38020",
  "Nginx": "009639",
  "Apache": "D22128",

  // Mobile Development
  "React Native": "61DAFB",
  "Flutter": "02569B",
  "Ionic": "3880FF",
  "Xamarin": "3498DB",
  "SwiftUI": "F05138",
  "Jetpack Compose": "4285F4",
  "Expo": "000020",
  "Capacitor": "119EFF",
  "Cordova": "E8E8E8",

  // Styling & UI
  "TailwindCSS": "06B6D4",
  "Styled Components": "DB7093",
  "Sass": "CC6699",
  "CSS": "1572B6",
  "Less": "1D365D",
  "Bootstrap": "7952B3",
  "Material-UI": "007FFF",
  "Chakra UI": "319795",
  "shadcn/ui": "000000",
  "Ant Design": "0170FE",
  "Mantine": "339AF0",
  "Radix UI": "161618",
  "Headless UI": "66E3FF",

  // Testing
  "Jest": "C21325",
  "Vitest": "6E9F18",
  "Cypress": "17202C",
  "Playwright": "2EAD33",
  "Testing Library": "E33332",
  "Mocha": "8D6748",
  "Chai": "A30701",
  "Selenium": "43B02A",
  "Puppeteer": "40B5A4",
  "JUnit": "25A162",
  "pytest": "0A9EDC",
  "RSpec": "E15750",
  "Jasmine": "8A4182",
  "Karma": "56C5A8",

  // Build Tools & Bundlers
  "Webpack": "8DD6F9",
  "Vite": "646CFF",
  "Turbopack": "0D0D0D",
  "esbuild": "FFCF00",
  "Rollup": "EC4A3F",
  "Parcel": "E8B05C",
  "SWC": "FFFFFF",
  "Babel": "F9DC3E",
  "Gulp": "CF4647",
  "Grunt": "FBA919",

  // Version Control & Collaboration
  "Git": "F05032",
  "GitHub": "181717",
  "GitLab": "FC6D26",
  "Bitbucket": "0052CC",
  "Mercurial": "999999",
  "SVN": "809CC9",

  // APIs & Data
  "GraphQL": "E10098",
  "REST API": "009688",
  "tRPC": "2596BE",
  "gRPC": "244C5A",
  "WebSocket": "010101",
  "Apollo": "311C87",
  "Prisma": "2D3748",
  "TypeORM": "FE0803",
  "Sequelize": "52B0E7",
  "Drizzle": "C5F74F",
  "Mongoose": "880000",

  // State Management
  "Redux": "764ABC",
  "Zustand": "443E38",
  "Jotai": "000000",
  "Recoil": "3578E5",
  "MobX": "FF9955",
  "XState": "2C3E50",
  "Pinia": "FFD859",
  "Vuex": "4FC08D",

  // Backend Services
  "Firebase": "FFCA28",
  "Appwrite": "F02E65",
  "PlanetScale": "000000",
  "Neon": "00E699",
  "Auth0": "EB5424",
  "Clerk": "6C47FF",
  "NextAuth.js": "000000",
  "Passport.js": "34E27A",

  // Desktop Development
  "Electron": "47848F",
  "Tauri": "FFC131",
  "Qt": "41CD52",
  ".NET MAUI": "512BD4",
  "WPF": "512BD4",

  // Game Development
  "Unity": "000000",
  "Unreal Engine": "0E1128",
  "Godot": "478CBF",
  "Three.js": "000000",
  "Babylon.js": "BB464B",

  // Data Science & ML
  "TensorFlow": "FF6F00",
  "PyTorch": "EE4C2C",
  "scikit-learn": "F7931E",
  "Pandas": "150458",
  "NumPy": "013243",
  "Keras": "D00000",
  "OpenCV": "5C3EE8",
  "Jupyter": "F37626",
  "Apache Spark": "E25A1C",

  // Monitoring & Analytics
  "Sentry": "362D59",
  "Datadog": "632CA6",
  "New Relic": "008C99",
  "Prometheus": "E6522C",
  "Grafana": "F46800",
  "Google Analytics": "E37400",
  "Mixpanel": "7856FF",
  "Amplitude": "0077FF",
};

// Tech logo mapping for shields.io badges
export const TECH_LOGOS: Record<string, string> = {
  // Frontend Frameworks
  "React": "react",
  "Next.js": "next.js",
  "Vue.js": "vue.js",
  "Nuxt.js": "nuxt.js",
  "Angular": "angular",
  "Svelte": "svelte",
  "SvelteKit": "svelte",
  "Solid.js": "solid",
  "Qwik": "qwik",
  "Preact": "preact",
  "Ember.js": "ember.js",
  "Astro": "astro",
  "Remix": "remix",
  "Gatsby": "gatsby",

  // Backend Frameworks
  "Node.js": "node.js",
  "Express": "express",
  "NestJS": "nestjs",
  "Fastify": "fastify",
  "Koa": "koa",
  "Hapi": "hapi",
  "Django": "django",
  "Flask": "flask",
  "FastAPI": "fastapi",
  "Spring Boot": "springboot",
  "ASP.NET": "dotnet",
  "Laravel": "laravel",
  "Ruby on Rails": "rubyonrails",
  "Phoenix": "phoenixframework",
  "Gin": "gin",
  "Fiber": "go",
  "Actix Web": "rust",

  // Programming Languages
  "TypeScript": "typescript",
  "JavaScript": "javascript",
  "Python": "python",
  "Java": "java",
  "C#": "csharp",
  "Go": "go",
  "Rust": "rust",
  "PHP": "php",
  "Ruby": "ruby",
  "Kotlin": "kotlin",
  "Swift": "swift",
  "C++": "cplusplus",
  "C": "c",
  "Dart": "dart",
  "Scala": "scala",
  "Elixir": "elixir",
  "Haskell": "haskell",
  "Clojure": "clojure",
  "R": "r",
  "MATLAB": "mathworks",
  "Lua": "lua",

  // Databases
  "PostgreSQL": "postgresql",
  "MySQL": "mysql",
  "MongoDB": "mongodb",
  "Redis": "redis",
  "SQLite": "sqlite",
  "MariaDB": "mariadb",
  "Cassandra": "apachecassandra",
  "DynamoDB": "amazondynamodb",
  "CouchDB": "apachecouchdb",
  "Neo4j": "neo4j",
  "InfluxDB": "influxdb",
  "Elasticsearch": "elasticsearch",
  "Oracle": "oracle",
  "Microsoft SQL Server": "microsoftsqlserver",
  "Supabase": "supabase",
  "Firebase Realtime Database": "firebase",
  "Firestore": "firebase",

  // Cloud & Infrastructure
  "AWS": "amazonaws",
  "Azure": "microsoftazure",
  "GCP": "googlecloud",
  "Docker": "docker",
  "Kubernetes": "kubernetes",
  "Terraform": "terraform",
  "Ansible": "ansible",
  "Jenkins": "jenkins",
  "CircleCI": "circleci",
  "GitHub Actions": "githubactions",
  "GitLab CI": "gitlab",
  "Vercel": "vercel",
  "Netlify": "netlify",
  "Heroku": "heroku",
  "Railway": "railway",
  "Fly.io": "fly",
  "DigitalOcean": "digitalocean",
  "Cloudflare": "cloudflare",
  "Nginx": "nginx",
  "Apache": "apache",

  // Mobile Development
  "React Native": "react",
  "Flutter": "flutter",
  "Ionic": "ionic",
  "Xamarin": "xamarin",
  "SwiftUI": "swift",
  "Jetpack Compose": "jetpackcompose",
  "Expo": "expo",
  "Capacitor": "capacitor",
  "Cordova": "apachecordova",

  // Styling & UI
  "TailwindCSS": "tailwindcss",
  "Styled Components": "styledcomponents",
  "Sass": "sass",
  "CSS": "css3",
  "Less": "less",
  "Bootstrap": "bootstrap",
  "Material-UI": "mui",
  "Chakra UI": "chakraui",
  "shadcn/ui": "shadcnui",
  "Ant Design": "antdesign",
  "Mantine": "mantine",
  "Radix UI": "radixui",
  "Headless UI": "headlessui",

  // Testing
  "Jest": "jest",
  "Vitest": "vitest",
  "Cypress": "cypress",
  "Playwright": "playwright",
  "Testing Library": "testinglibrary",
  "Mocha": "mocha",
  "Chai": "chai",
  "Selenium": "selenium",
  "Puppeteer": "puppeteer",
  "JUnit": "junit5",
  "pytest": "pytest",
  "RSpec": "rspec",
  "Jasmine": "jasmine",
  "Karma": "karma",

  // Build Tools & Bundlers
  "Webpack": "webpack",
  "Vite": "vite",
  "Turbopack": "turbopack",
  "esbuild": "esbuild",
  "Rollup": "rollup.js",
  "Parcel": "parcel",
  "SWC": "swc",
  "Babel": "babel",
  "Gulp": "gulp",
  "Grunt": "grunt",

  // Version Control & Collaboration
  "Git": "git",
  "GitHub": "github",
  "GitLab": "gitlab",
  "Bitbucket": "bitbucket",
  "Mercurial": "mercurial",
  "SVN": "subversion",

  // APIs & Data
  "GraphQL": "graphql",
  "REST API": "fastapi",
  "tRPC": "trpc",
  "gRPC": "grpc",
  "WebSocket": "socketdotio",
  "Apollo": "apollographql",
  "Prisma": "prisma",
  "TypeORM": "typeorm",
  "Sequelize": "sequelize",
  "Drizzle": "drizzle",
  "Mongoose": "mongoose",

  // State Management
  "Redux": "redux",
  "Zustand": "zustand",
  "Jotai": "jotai",
  "Recoil": "recoil",
  "MobX": "mobx",
  "XState": "xstate",
  "Pinia": "pinia",
  "Vuex": "vuex",

  // Backend Services
  "Firebase": "firebase",
  "Appwrite": "appwrite",
  "PlanetScale": "planetscale",
  "Neon": "neon",
  "Auth0": "auth0",
  "Clerk": "clerk",
  "NextAuth.js": "nextdotjs",
  "Passport.js": "passport",

  // Desktop Development
  "Electron": "electron",
  "Tauri": "tauri",
  "Qt": "qt",
  ".NET MAUI": "dotnet",
  "WPF": "dotnet",

  // Game Development
  "Unity": "unity",
  "Unreal Engine": "unrealengine",
  "Godot": "godotengine",
  "Three.js": "threedotjs",
  "Babylon.js": "babylondotjs",

  // Data Science & ML
  "TensorFlow": "tensorflow",
  "PyTorch": "pytorch",
  "scikit-learn": "scikitlearn",
  "Pandas": "pandas",
  "NumPy": "numpy",
  "Keras": "keras",
  "OpenCV": "opencv",
  "Jupyter": "jupyter",
  "Apache Spark": "apachespark",

  // Monitoring & Analytics
  "Sentry": "sentry",
  "Datadog": "datadog",
  "New Relic": "newrelic",
  "Prometheus": "prometheus",
  "Grafana": "grafana",
  "Google Analytics": "googleanalytics",
  "Mixpanel": "mixpanel",
  "Amplitude": "amplitude",
};

// Helper function to get tech color
export function getTechColor(techName: string): string {
  return TECH_COLORS[techName] || "2563EB"; // Default blue color
}

// Helper function to get tech logo
export function getTechLogo(techName: string): string {
  return TECH_LOGOS[techName] || techName.toLowerCase().replace(/[.\s]/g, "");
}
