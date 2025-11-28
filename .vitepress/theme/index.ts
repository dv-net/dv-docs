import DefaultTheme from 'vitepress/theme'
import type {Theme} from 'vitepress'
import {theme, useTheme, usePlayground} from '@dv.net/docs-vitepress-openapi/client'
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
    const playground = usePlayground()
      playground.setSecuritySchemeDefaultValues({
          apiKey: 'm8GOjP8qXsGgBZvmJb0jjFt6EZ3yz3lhPdbMhDicYAVdUfzYBIdEl6eEcGAivjrP',
    })
    useTheme({
      i18n: {
        regions: regions,
        messages: translationMapper,
      },
      jsonViewer: {
          deep: Infinity,
      },
      schemaViewer: {
          deep: Infinity
      }
    })

    app.component('LocaleSelect', LocaleSelect)
    theme.enhanceApp({ app })
  }
} satisfies Theme
