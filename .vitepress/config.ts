import {URL, fileURLToPath} from 'node:url'
import {defineConfig, loadEnv} from 'vitepress'
import {locales} from "./locales.js";

const env = loadEnv('', process.cwd())
const isProduction = env.VITE_NODE_ENV === 'production'
const gtagId = env.VITE_GTAG_ID

const head: any[] = [
  ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
  ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },],
  ['link', { href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap', rel: 'stylesheet' }],
]

// Add Google Tag Manager if production and GTM ID is set
if (isProduction && gtagId) {
  head.push([
    'script',
    {},
    `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtagId}');`
  ])
}

export default defineConfig({
  title: "DV.net Docs",
  description: "Documentation DV.net",
  srcDir: 'src',
  themeConfig: { nav: [{ component: 'LocaleSelect' }] },
  locales,
  head,
  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./', import.meta.url)),
      },
    },
    define: {
      'import.meta.env.VITE_NODE_ENV': JSON.stringify(env.VITE_NODE_ENV || 'development'),
      'import.meta.env.VITE_GTAG_ID': JSON.stringify(env.VITE_GTAG_ID || ''),
    },
  },
})
