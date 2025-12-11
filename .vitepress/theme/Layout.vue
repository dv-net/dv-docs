<script setup>
import DefaultTheme from 'vitepress/theme'
const { Layout } = DefaultTheme

const isProduction = import.meta.env.VITE_NODE_ENV === 'production'
const gtagId = import.meta.env.VITE_GTAG_ID
</script>

<template>
  <!-- Google Tag Manager (noscript) -->
  <noscript v-if="isProduction && gtagId">
    <iframe :src="`https://www.googletagmanager.com/ns.html?id=${gtagId}`" height="0" width="0" style="display:none;visibility:hidden"></iframe>
  </noscript>
  <!-- End Google Tag Manager (noscript) -->
  <Layout />
</template>
