import {URL, fileURLToPath} from 'node:url'
import {defineConfig, HeadConfig, loadEnv} from 'vitepress'
import {locales} from "./locales.js";

const env = loadEnv('', process.cwd())
const gTagId = env.VITE_GTAG_ID
const gTagIdAnalytics = env.VITE_GTAG_ID_ANALYTICS

export default defineConfig({
  title: "DV.net Docs",
  description: "Documentation DV.net",
  srcDir: 'src',
  themeConfig: { nav: [{ component: 'LocaleSelect' }] },
  locales,

  head: [
    // Google Fonts
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },],
    ['link', { href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap', rel: 'stylesheet' }],
    // logo and favicon
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    // Google Analytics
    ...(gTagIdAnalytics
        ? [[
          'script',
          {},
          `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${gTagIdAnalytics}');`,
        ],
          [
            'noscript',
            {},
            `<iframe src="https://www.googletagmanager.com/ns.html?id=${gTagIdAnalytics}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`
          ]]

        : [['script', { async: '', src: `https://www.googletagmanager.com/gtag/js?id=${gTagId}` }],
          [
            'script',
            {},
            `window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gTagId}');`,
          ]]
    ) as HeadConfig[]
  ],

  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./', import.meta.url)),
      },
    },
  },
})
