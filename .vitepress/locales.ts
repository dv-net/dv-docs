import {RegionsType, SidebarItemType} from "./types";
import {useSidebar} from '@dv.net/docs-vitepress-openapi'
import regions from '../scripts/regions.json'
import {translationMapper, specsMapper} from "./mappers.js";

export const locales = {}

const tHandler = (slug: string, str: string) => translationMapper?.[slug]?.[str] || str

// prepared sidebar for languages
const sidebarItemsMap = new Map<string, SidebarItemType[]>()
regions.forEach((region: RegionsType) => {
  sidebarItemsMap.set(`/${region.slug}/`, [
    { text: tHandler(region.slug, 'Introduction'), link: `/${region.slug}/` },
    {
      text: tHandler(region.slug, "Description"),
      collapsible: true,
      collapsed: false,
      items: [
        { text: tHandler(region.slug, "Cloud vs on-premises"), link: `/${region.slug}/description/cloud-and-on-premises.md` },
        { text: tHandler(region.slug, "Modules"), link: `/${region.slug}/description/modules.md` },
      ],
    },
    {
      text: tHandler(region.slug, "Installation"),
      collapsible: true,
      collapsed: false,
      items: [
        { text: tHandler(region.slug, "System requirements"), link: `/${region.slug}/installation/system-requirements.md` },
        { text: tHandler(region.slug, "Installation with docker"), link: `/${region.slug}/installation/docker-installation.md` },
        { text: tHandler(region.slug, "Installation"), link: `/${region.slug}/installation/installation.md` },
        { text: tHandler(region.slug, "Domain linking"), link: `/${region.slug}/installation/domain-linking.md` },
        { text: tHandler(region.slug, "List of libraries for integrations"), link: `/${region.slug}/installation/list-of-libraries-for-integrations.md` },
      ],
    },
    {
      text: tHandler(region.slug, "Integration"),
      collapsible: true,
      collapsed: false,
      items: [
        { text: tHandler(region.slug, "Obtaining an API key and secret"), link: `/${region.slug}/integration/obtaining-api-key-and-secret.md` },
        { text: tHandler(region.slug, "Connecting a payment form without API"), link: `/${region.slug}/integration/connecting-payment-form-without-api.md` },
        { text: tHandler(region.slug, "Creating deposit wallets"), link: `/${region.slug}/integration/creating-deposit-wallets.md` },
        { text: tHandler(region.slug, "Webhooks"), link: `/${region.slug}/integration/webhooks.md` },
        { text: tHandler(region.slug, "Webhook signature verification"), link: `/${region.slug}/integration/webhook-signature-verification.md` },
        { text: tHandler(region.slug, "Integration examples"), link: `/${region.slug}/integration/integrationExamples.md` },
      ],
    },
    {
      text: tHandler(region.slug, "Security"),
      collapsible: true,
      collapsed: false,
      items: [
        { text: tHandler(region.slug, "Package signature verification"), link: `/${region.slug}/security/package-pgp-sign.md` },
        { text: tHandler(region.slug, "Application update history"), link: `/${region.slug}/security/update-history.md` },
        { text: tHandler(region.slug, "DV.net Api request logging"), link: `/${region.slug}/security/api-requests-logging.md` },
        { text: tHandler(region.slug, "Hide control panel with nginx"), link: `/${region.slug}/security/hide-control-panel-with-nginx.md` },
      ],
    },
    {
      text: tHandler(region.slug, "Exchanges"),
      collapsible: true,
      collapsed: false,
      items: [
        { text: tHandler(region.slug, "Exchanges integration"), link: `/${region.slug}/exchanges/exchange-integration.md` },
        { text: "Binance", link: `/${region.slug}/exchanges/binance.md` },
        { text: "OKX", link: `/${region.slug}/exchanges/okx.md` },
        { text: "Bitget", link: `/${region.slug}/exchanges/bitget.md` },
        { text: "HTX", link: `/${region.slug}/exchanges/htx.md` },
        { text: "Bybit", link: `/${region.slug}/exchanges/bybit.md` },
        { text: "Gateio", link: `/${region.slug}/exchanges/gate.md` },
        { text: "MEXC", link: `/${region.slug}/exchanges/mexc.md` },
        { text: "KuCoin", link: `/${region.slug}/exchanges/kucoin.md` }
      ],
    },
    {
      text: tHandler(region.slug, "API Integration"),
      collapsible: true,
      collapsed: false,
      items: useSidebar({ spec: specsMapper[region.slug] })
        .generateSidebarGroups()
        .map(group => {
          return {
            ...group,
            items: group.items.map(item => ({
              ...item,
              link: `/${region.slug}${item.link}`,
            })),
          }
        }),
    },
  ])
})

export const sidebarItems = Object.fromEntries(sidebarItemsMap) as Record<string, SidebarItemType[]>

// preparing locales prev/next buttons
Object.keys(translationMapper).forEach(slug => {
  locales[slug] = {
    themeConfig: {
      docFooter: { prev: tHandler(slug, "prev"), next: tHandler(slug, "next") },
      outline: { label: tHandler(slug, "On this page") },
      notFound: {
        title: tHandler(slug, "PAGE NOT FOUND"),
        quote: tHandler(slug, "But if you don't change your direction, and if you keep looking, you may end up where you are heading."),
        linkText: tHandler(slug, 'Go home')
      },
      logo: '/favicon.ico',
      sidebar: sidebarItems,
      nav: [{ component: 'LocaleSelect' }, { text: 'dv.net', link: 'https://dv.net' }],
      socialLinks: [{ icon: 'github', link: 'https://github.com/dv-net' }]
    },
  }
})
