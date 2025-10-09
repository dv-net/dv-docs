import DefaultTheme from 'vitepress/theme'
import type {Theme} from 'vitepress'
import {theme, useTheme} from '@dv.net/docs-vitepress-openapi/client'
import regions from '../../scripts/regions.json'
import LocaleSelect from './components/LocaleSelect.vue'
import {translationMapper} from "../mappers";
import '@dv.net/docs-vitepress-openapi/dist/style.css'
import {onMounted} from 'vue'

export default {
  extends: {
    ...DefaultTheme,
    setup() {
      onMounted(() => {
        const hash = decodeURIComponent(location.hash)
        if (hash) {
          setTimeout(() => {
            const el = document.querySelector(hash)
            if (el) el.scrollIntoView({ behavior: 'smooth' })
          }, 300)
        }
      })
    }
  },
  enhanceApp({ app }) {
    useTheme({
      i18n: {
        regions: regions,
        messages: translationMapper,
      },
      jsonViewer: {
        deep: 1,
      },
      schemaViewer: {
        deep: 1,
      },
    })

    app.component('LocaleSelect', LocaleSelect)
    theme.enhanceApp({ app })
  }
} satisfies Theme
