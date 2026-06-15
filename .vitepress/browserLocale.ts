import regions from '../scripts/regions.json'

export const localeSlugs = regions.map((region) => region.slug)

export function resolveLocale(tags: string[], supported: string[] = localeSlugs, fallback = 'en') {
  for (const tag of tags) {
    const primary = tag.toLowerCase().split(';')[0].trim().split('-')[0]
    if (supported.includes(primary)) {
      return primary
    }
  }
  return fallback
}

export function parseAcceptLanguage(header: string): string[] {
  return header
    .split(',')
    .map((part) => {
      const [tag, ...params] = part.trim().split(';')
      const qParam = params.find((param) => param.trim().startsWith('q='))
      const q = qParam ? Number.parseFloat(qParam.split('=')[1]) : 1
      return { tag: tag.trim(), q: Number.isNaN(q) ? 0 : q }
    })
    .sort((a, b) => b.q - a.q)
    .map((item) => item.tag)
}

export function resolveLocaleFromHeader(acceptLanguage?: string) {
  const tags = acceptLanguage ? parseAcceptLanguage(acceptLanguage) : []
  return resolveLocale(tags)
}

export function buildRootRedirectHtml(supported: string[] = localeSlugs) {
  return `<!DOCTYPE html><html><head><script>
${resolveLocale.toString()}
var tags = navigator.languages && navigator.languages.length ? Array.from(navigator.languages) : [navigator.language || ''];
location.replace('/' + resolveLocale(tags, ${JSON.stringify(supported)}, 'en') + '/');
</script></head></html>`
}
