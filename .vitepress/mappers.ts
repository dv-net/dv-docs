import specEn from '../src/en/openapi.json'
import specEs from '../src/es/openapi.json'
import specHi from '../src/hi/openapi.json'
import specRu from '../src/ru/openapi.json'
import specZh from '../src/zh/openapi.json'
import specDe from '../src/de/openapi.json'
import specAr from '../src/ar/openapi.json'
import specKo from '../src/ko/openapi.json'

import translationsEn from '../src/en/t.json'
import translationsEs from '../src/es/t.json'
import translationsHi from '../src/hi/t.json'
import translationsRu from '../src/ru/t.json'
import translationsZh from '../src/zh/t.json'
import translationsDe from '../src/de/t.json'
import translationsAr from '../src/ar/t.json'
import translationsKo from '../src/ko/t.json'

export const specsMapper = {
  en: specEn, es: specEs, hi: specHi, ru: specRu, zh: specZh, de: specDe, ar: specAr, ko: specKo
}

export const translationMapper = {
  ar: translationsAr,
  de: translationsDe,
  es: translationsEs,
  en: translationsEn,
  hi: translationsHi,
  ko: translationsKo,
  ru: translationsRu,
  zh: translationsZh
}