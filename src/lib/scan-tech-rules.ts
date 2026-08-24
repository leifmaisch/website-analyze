export type TechRuleCategory =
  | "framework"
  | "cms"
  | "hosting"
  | "analytics"
  | "cdn"
  | "library"
  | "ui"
  | "css"
  | "auth"
  | "platform"
  | "server"
  | "other"

export type TechRule = {
  name: string
  category: TechRuleCategory
  patterns?: RegExp[]
  scriptPatterns?: RegExp[]
  linkPatterns?: RegExp[]
  headers?: { key: string; pattern: RegExp }[]
}

export type CompositeTechRule = {
  name: string
  category: TechRuleCategory
  minMatches: number
  signals: { label: string; pattern: RegExp }[]
}

export const techRules: TechRule[] = [
  {
    name: "Next.js",
    category: "framework",
    patterns: [/__NEXT_DATA__/, /_next\/static/, /"buildId"/, /__next_f/],
    scriptPatterns: [/_next\/static\/chunks\//],
  },
  {
    name: "Nuxt",
    category: "framework",
    patterns: [/__NUXT__/, /_nuxt\//, /window\.__NUXT__/],
  },
  {
    name: "React",
    category: "framework",
    patterns: [/data-reactroot/, /data-reactid/, /__REACT_DEVTOOLS/],
    scriptPatterns: [
      /react(?:-dom)?(?:\.production|\.development)?(?:\.min)?\.js/i,
      /\/react@/,
      /\/react-dom@/,
    ],
  },
  {
    name: "Vue.js",
    category: "framework",
    patterns: [/data-v-[a-f0-9]+/, /__VUE__/, /v-cloak/],
    scriptPatterns: [/vue(?:\.runtime)?(?:\.global)?(?:\.min)?\.js/i, /\/vue@/],
  },
  {
    name: "Svelte",
    category: "framework",
    patterns: [/svelte-[a-z0-9-]+/, /__svelte/],
    scriptPatterns: [/svelte(?:\.min)?\.js/i],
  },
  {
    name: "SvelteKit",
    category: "framework",
    patterns: [/__sveltekit/, /%sveltekit\./, /_app\/immutable\//],
  },
  {
    name: "Angular",
    category: "framework",
    patterns: [/ng-version=/, /ng-app=/, /_ngcontent-/, /platform-browser/],
    scriptPatterns: [/angular(?:\.min)?\.js/i, /@angular\//],
  },
  {
    name: "Gatsby",
    category: "framework",
    patterns: [/gatsby-browser/, /window\.___loader/, /gatsby-plugin/, /___gatsby/],
  },
  {
    name: "Astro",
    category: "framework",
    patterns: [/astro-island/, /\/_astro\//, /data-astro-/],
  },
  {
    name: "Remix",
    category: "framework",
    patterns: [/__remixContext/, /remix-run/],
  },
  {
    name: "Solid.js",
    category: "framework",
    patterns: [/solid-js/, /data-hk=/],
    scriptPatterns: [/solid-js/i],
  },
  {
    name: "Qwik",
    category: "framework",
    patterns: [/q:container/, /q:version/, /\/q-[a-z0-9]+\.js/],
  },
  {
    name: "Preact",
    category: "framework",
    scriptPatterns: [/preact(?:\.min)?\.js/i, /\/preact@/],
  },
  {
    name: "Lit",
    category: "framework",
    patterns: [/lit-element/, /lit-html/],
    scriptPatterns: [/lit-element/i, /lit-html/i],
  },
  {
    name: "Alpine.js",
    category: "framework",
    patterns: [/x-data=/, /x-show=/, /x-bind:/, /Alpine\.data/],
    scriptPatterns: [/alpinejs/i, /alpine\.js/i],
  },
  {
    name: "HTMX",
    category: "framework",
    patterns: [/hx-get=/, /hx-post=/, /hx-swap=/, /hx-trigger=/],
    scriptPatterns: [/htmx(?:\.org|\.min)?\.js/i],
  },
  {
    name: "Turbo",
    category: "framework",
    patterns: [/data-turbo=/, /turbo-frame/, /Turbo\.visit/],
    scriptPatterns: [/@hotwired\/turbo/],
  },
  {
    name: "Stimulus",
    category: "framework",
    patterns: [/data-controller=/, /data-action=/],
    scriptPatterns: [/@hotwired\/stimulus/],
  },
  {
    name: "WordPress",
    category: "cms",
    patterns: [/wp-content\//, /wp-includes\//, /<meta[^>]+name=["']generator["'][^>]+WordPress/i],
  },
  {
    name: "Shopify",
    category: "platform",
    patterns: [/cdn\.shopify\.com/, /Shopify\.theme/, /shopify-section/],
  },
  {
    name: "Webflow",
    category: "platform",
    patterns: [/webflow\.com/, /data-wf-page/, /w-webflow-badge/],
  },
  {
    name: "Squarespace",
    category: "platform",
    patterns: [/squarespace\.com/, /static\.squarespace/, /squarespace-cdn/],
  },
  {
    name: "Wix",
    category: "platform",
    patterns: [/wix\.com/, /static\.wixstatic/, /X-Wix-/],
    headers: [{ key: "x-wix-request-id", pattern: /.+/ }],
  },
  {
    name: "Drupal",
    category: "cms",
    patterns: [/Drupal\.settings/, /\/sites\/default\/files/, /drupal\.js/],
  },
  {
    name: "Joomla",
    category: "cms",
    patterns: [/\/media\/jui\//, /Joomla!/],
  },
  {
    name: "Ghost",
    category: "cms",
    patterns: [/ghost\.io/, /\/ghost\//, /<meta[^>]+name=["']generator["'][^>]+Ghost/i],
  },
  {
    name: "Contentful",
    category: "cms",
    patterns: [/contentful\.com/, /ctfassets\.net/],
  },
  {
    name: "Sanity",
    category: "cms",
    patterns: [/sanity\.io/, /cdn\.sanity\.io/],
  },
  {
    name: "Strapi",
    category: "cms",
    patterns: [/strapi\.io/, /\/api\/[a-z-]+\?populate/],
  },
  {
    name: "Prismic",
    category: "cms",
    patterns: [/prismic\.io/, /prismic\.github\.io/],
  },
  {
    name: "Framer",
    category: "platform",
    patterns: [/framerusercontent\.com/, /framer\.com\/sites/, /data-framer-/],
  },
  {
    name: "ShipFast",
    category: "platform",
    patterns: [
      /shipfa\.st/i,
      /shipfast_logo(?:_transparent)?\.webp/i,
      /Built with[\s\S]{0,60}ShipFast/i,
      /href=["']https?:\/\/shipfa\.st/i,
    ],
    scriptPatterns: [/shipfa\.st/i],
    linkPatterns: [/shipfa\.st/i],
  },
  {
    name: "Radix UI",
    category: "ui",
    patterns: [/data-radix-/, /radix-ui/],
    scriptPatterns: [/@radix-ui\//],
  },
  {
    name: "Material UI",
    category: "ui",
    patterns: [/MuiButton/, /MuiTypography/, /data-mui-/],
    scriptPatterns: [/@mui\//, /material-ui/],
  },
  {
    name: "Chakra UI",
    category: "ui",
    patterns: [/chakra-ui/, /data-theme=/, /css-[a-z0-9]+-chakra/],
    scriptPatterns: [/@chakra-ui\//],
  },
  {
    name: "Ant Design",
    category: "ui",
    patterns: [/ant-btn/, /ant-layout/, /antd/],
    scriptPatterns: [/antd(?:\.min)?\.js/i, /ant-design/],
  },
  {
    name: "Mantine",
    category: "ui",
    patterns: [/mantine-/, /data-mantine-/],
    scriptPatterns: [/@mantine\//],
  },
  {
    name: "Headless UI",
    category: "ui",
    scriptPatterns: [/@headlessui\//],
  },
  {
    name: "DaisyUI",
    category: "ui",
    patterns: [/\bbtn-primary\b/, /\bbtn-secondary\b/, /daisyui/],
    linkPatterns: [/daisyui/],
  },
  {
    name: "PrimeReact",
    category: "ui",
    patterns: [/p-button/, /p-datatable/, /primereact/],
    scriptPatterns: [/primereact/],
  },
  {
    name: "Bulma",
    category: "css",
    patterns: [/\bbutton is-primary\b/, /\bcolumns is-multiline\b/, /\bhero-body\b/],
    linkPatterns: [/bulma(?:\.min)?\.css/i],
  },
  {
    name: "Foundation",
    category: "css",
    patterns: [/foundation\.min\.css/, /data-equalizer/, /reveal-modal/],
    linkPatterns: [/foundation/],
  },
  {
    name: "Semantic UI",
    category: "css",
    patterns: [/ui\s+(?:button|menu|grid|segment)/, /semantic(?:\.min)?\.(?:css|js)/i],
    linkPatterns: [/semantic-ui/],
  },
  {
    name: "UnoCSS",
    category: "css",
    patterns: [/__uno/, /unocss/],
    scriptPatterns: [/unocss/],
  },
  {
    name: "Windi CSS",
    category: "css",
    patterns: [/windicss/, /__windi/],
  },
  {
    name: "styled-components",
    category: "css",
    patterns: [/sc-[a-zA-Z]+/, /styled-components/],
    scriptPatterns: [/styled-components/],
  },
  {
    name: "Emotion",
    category: "css",
    patterns: [/css-[a-z0-9]+/, /emotion/],
    scriptPatterns: [/@emotion\//],
  },
  {
    name: "Sass",
    category: "css",
    linkPatterns: [/\.scss/, /\.sass/],
  },
  {
    name: "Lucide",
    category: "ui",
    patterns: [/lucide(?:-react|-vue|-svelte)?/],
    scriptPatterns: [/lucide(?:-react|-vue|-svelte)?/],
  },
  {
    name: "Phosphor Icons",
    category: "ui",
    patterns: [/phosphor-icons/, /@phosphor-icons/],
    scriptPatterns: [/@phosphor-icons\//, /phosphor-icons/],
  },
  {
    name: "Heroicons",
    category: "ui",
    scriptPatterns: [/@heroicons\//],
  },
  {
    name: "Font Awesome",
    category: "ui",
    patterns: [/fa-[a-z]+/, /fontawesome/],
    linkPatterns: [/fontawesome/, /font-awesome/],
  },
  {
    name: "Sonner",
    category: "ui",
    patterns: [/sonner/, /data-sonner-/],
    scriptPatterns: [/sonner/],
  },
  {
    name: "Vaul",
    category: "ui",
    scriptPatterns: [/vaul/],
    patterns: [/vaul-drawer/, /data-vaul-/],
  },
  {
    name: "cmdk",
    category: "ui",
    patterns: [/cmdk-/, /data-cmdk-/],
    scriptPatterns: [/cmdk/],
  },
  {
    name: "Framer Motion",
    category: "library",
    patterns: [/framer-motion/, /data-framer-name=/],
    scriptPatterns: [/framer-motion/],
  },
  {
    name: "GSAP",
    category: "library",
    patterns: [/gsap\.|TweenMax|ScrollTrigger/],
    scriptPatterns: [/gsap(?:\.min)?\.js/i],
  },
  {
    name: "Three.js",
    category: "library",
    scriptPatterns: [/three(?:\.min)?\.js/i, /\/three@/],
  },
  {
    name: "Swiper",
    category: "library",
    patterns: [/swiper-slide/, /swiper-container/, /swiper-wrapper/],
    scriptPatterns: [/swiper(?:\.min)?\.js/i],
    linkPatterns: [/swiper(?:\.min)?\.css/i],
  },
  {
    name: "Chart.js",
    category: "library",
    scriptPatterns: [/chart(?:\.min)?\.js/i, /chart\.js/],
  },
  {
    name: "D3.js",
    category: "library",
    scriptPatterns: [/d3(?:\.v\d+)?(?:\.min)?\.js/i, /\/d3@/],
  },
  {
    name: "jQuery",
    category: "library",
    patterns: [/jQuery\d+/, /\$\(["']/],
    scriptPatterns: [/jquery(?:-\d+\.\d+\.\d+)?(?:\.min)?\.js/i],
  },
  {
    name: "Lodash",
    category: "library",
    scriptPatterns: [/lodash(?:\.min)?\.js/i, /\/lodash@/],
  },
  {
    name: "Day.js",
    category: "library",
    scriptPatterns: [/dayjs(?:\.min)?\.js/i, /\/dayjs@/],
  },
  {
    name: "date-fns",
    category: "library",
    scriptPatterns: [/date-fns/],
  },
  {
    name: "Zod",
    category: "library",
    scriptPatterns: [/zod/, /\/zod@/],
  },
  {
    name: "TanStack Query",
    category: "library",
    patterns: [/QueryClient/, /useQuery\(/],
    scriptPatterns: [/@tanstack\/react-query/, /react-query/],
  },
  {
    name: "Redux",
    category: "library",
    patterns: [/redux/, /__REDUX_DEVTOOLS/],
    scriptPatterns: [/redux(?:\.min)?\.js/i, /@reduxjs\//],
  },
  {
    name: "Zustand",
    category: "library",
    scriptPatterns: [/zustand/],
  },
  {
    name: "Bootstrap",
    category: "css",
    patterns: [/data-bs-toggle/, /data-bs-target=/, /\bcontainer-fluid\b/, /\bcol-(?:sm|md|lg)-\d+\b/],
    scriptPatterns: [/bootstrap(?:\.min)?\.js/i],
    linkPatterns: [/bootstrap(?:\.min)?\.css/i],
  },
  {
    name: "Clerk",
    category: "auth",
    patterns: [/clerk\.browserApi/, /@clerk\//],
    scriptPatterns: [/@clerk\//],
  },
  {
    name: "Auth0",
    category: "auth",
    patterns: [/auth0\.com/, /auth0-spa-js/],
    scriptPatterns: [/auth0(?:-spa-js)?/],
  },
  {
    name: "NextAuth.js",
    category: "auth",
    patterns: [/next-auth/, /__NEXTAUTH/],
  },
  {
    name: "Supabase",
    category: "auth",
    patterns: [/supabase\.co/, /supabase\.auth/],
    scriptPatterns: [/@supabase\//],
  },
  {
    name: "Firebase",
    category: "auth",
    patterns: [/firebaseapp\.com/, /firebase\.initializeApp/, /gstatic\.com\/firebasejs/],
    scriptPatterns: [/firebase(?:-app)?(?:\.min)?\.js/i],
  },
  {
    name: "Stripe",
    category: "library",
    scriptPatterns: [/js\.stripe\.com/],
  },
  {
    name: "PayPal",
    category: "library",
    scriptPatterns: [/paypal\.com\/sdk/, /paypalobjects\.com/],
  },
  {
    name: "Paddle",
    category: "library",
    scriptPatterns: [/paddle\.com\/paddle/],
  },
  {
    name: "Lemon Squeezy",
    category: "library",
    scriptPatterns: [/lemonsqueezy\.com/],
  },
  {
    name: "Sentry",
    category: "library",
    patterns: [/sentry\.io/, /Sentry\.init/],
    scriptPatterns: [/browser\.sentry-cdn\.com/, /@sentry\//],
  },
  {
    name: "Vite",
    category: "library",
    patterns: [/\/@vite\//, /import\.meta\.env/],
    scriptPatterns: [/\/@vite\//],
  },
  {
    name: "Webpack",
    category: "library",
    patterns: [/webpackJsonp/, /__webpack_require__/],
  },
  {
    name: "Cloudflare",
    category: "cdn",
    patterns: [/cdnjs\.cloudflare\.com/, /cloudflareinsights\.com/],
    headers: [
      { key: "server", pattern: /cloudflare/i },
      { key: "cf-ray", pattern: /.+/ },
    ],
  },
  {
    name: "Cloudflare Pages",
    category: "hosting",
    patterns: [/\.pages\.dev\b/],
  },
  {
    name: "Fastly",
    category: "cdn",
    headers: [{ key: "x-served-by", pattern: /cache-/i }, { key: "via", pattern: /varnish/i }],
  },
  {
    name: "Bunny CDN",
    category: "cdn",
    patterns: [/b-cdn\.net/, /bunnycdn\.com/],
  },
  {
    name: "AWS CloudFront",
    category: "cdn",
    headers: [{ key: "via", pattern: /cloudfront/i }, { key: "x-amz-cf-id", pattern: /.+/ }],
  },
  {
    name: "Vercel",
    category: "hosting",
    headers: [
      { key: "server", pattern: /vercel/i },
      { key: "x-vercel-id", pattern: /.+/ },
    ],
  },
  {
    name: "Netlify",
    category: "hosting",
    headers: [
      { key: "server", pattern: /netlify/i },
      { key: "x-nf-request-id", pattern: /.+/ },
    ],
  },
  {
    name: "Railway",
    category: "hosting",
    headers: [{ key: "server", pattern: /railway/i }],
  },
  {
    name: "Render",
    category: "hosting",
    headers: [{ key: "x-render-origin-server", pattern: /.+/ }],
  },
  {
    name: "Fly.io",
    category: "hosting",
    headers: [{ key: "fly-request-id", pattern: /.+/ }],
  },
  {
    name: "PHP",
    category: "server",
    headers: [{ key: "x-powered-by", pattern: /php/i }],
    patterns: [/\.php(?:\?|$)/i],
  },
  {
    name: "ASP.NET",
    category: "server",
    headers: [{ key: "x-powered-by", pattern: /asp\.net/i }],
    patterns: [/__VIEWSTATE/, /aspnetcdn\.com/],
  },
  {
    name: "Express",
    category: "server",
    headers: [{ key: "x-powered-by", pattern: /express/i }],
  },
  {
    name: "Nginx",
    category: "server",
    headers: [{ key: "server", pattern: /nginx/i }],
  },
  {
    name: "Apache",
    category: "server",
    headers: [{ key: "server", pattern: /apache/i }],
  },
]

export const compositeTechRules: CompositeTechRule[] = [
  {
    name: "shadcn/ui",
    category: "ui",
    minMatches: 2,
    signals: [
      { label: "data-slot attributes", pattern: /data-slot=["'][\w-]+["']/ },
      {
        label: "semantic design tokens",
        pattern:
          /(?:bg-background|text-foreground|text-muted-foreground|border-border|bg-card|text-card-foreground|ring-ring|bg-primary|text-primary-foreground)/,
      },
      { label: "Radix primitives", pattern: /@radix-ui\/|data-radix-/ },
      { label: "class-variance-authority", pattern: /class-variance-authority|cva\(/ },
      { label: "tailwind-merge", pattern: /tailwind-merge|twMerge\(/ },
      { label: "shadcn patterns", pattern: /rounded-squircle|squircle/ },
    ],
  },
  {
    name: "Tailwind CSS",
    category: "css",
    minMatches: 3,
    signals: [
      { label: "tailwind variables", pattern: /--tw-/ },
      { label: "tailwind package", pattern: /tailwindcss/ },
      { label: "responsive variants", pattern: /\b(?:sm|md|lg|xl|2xl):[\w-]+/ },
      { label: "state variants", pattern: /\b(?:hover|focus|active|dark):[\w-]+/ },
      {
        label: "spacing utilities",
        pattern: /\b(?:p|px|py|pt|pb|pl|pr|m|mx|my|gap)-(?:\d+|\[[^\]]+\])\b/,
      },
      {
        label: "layout utilities",
        pattern: /\b(?:flex|grid|items-center|justify-between|rounded-(?:lg|md|xl|full|sm))\b/,
      },
      { label: "tailwind directives", pattern: /@tailwind\s+(?:base|components|utilities)/ },
    ],
  },
]
