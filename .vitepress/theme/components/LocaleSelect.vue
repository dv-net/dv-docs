<script setup lang="ts">
import {onMounted, onBeforeUnmount, ref, watch} from 'vue'
import {useTheme} from '@dv.net/docs-vitepress-openapi/client'
import {useRoute, useRouter} from 'vitepress'
import regions from '../../../scripts/regions.json'

const themeConfig = useTheme()
const route = useRoute()
const router = useRouter()
const isOpen = ref(false)
const buttonRef = ref<HTMLButtonElement | null>(null)
const dropdownRef = ref<HTMLDivElement | null>(null)

const currentLocale = ref(regions.find(r => r.slug === route.path.slice(1, 3)) || regions[0])

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const selectLocale = (locale: typeof regions[0]) => {
  router.go(`/${locale.slug}/${route.path.length > 4 ? route.path.slice(4) : ''}`)
  currentLocale.value = locale
  themeConfig.setI18nConfig({locale: locale.slug})
  isOpen.value = false
}

const handleClickOutside = (event: MouseEvent) => {
  if (buttonRef.value && !buttonRef.value.contains(event.target as Node) &&
      dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

watch(() => route.path, () => {
  if (route.path === '/') {
    selectLocale(regions[0])
  } else if (route.path.slice(1, 3)) {
    selectLocale(regions.find(region => region.slug === route.path.slice(1, 3)) || regions[0])
  }
}, {immediate: true})

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="locale-select">
    <button
        ref="buttonRef"
        :class='{"locale-select__button": true, isOpen: isOpen}'
        @click="toggleDropdown"
        :aria-expanded="isOpen"
        aria-haspopup="listbox"
    >
      <span>{{ currentLocale.name }}</span>
      <svg
          class="locale-select__icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
      >
        <path d="m6 9 6 6 6-6"/>
      </svg>
    </button>
    <div
        v-if="isOpen"
        ref="dropdownRef"
        class="locale-select__dropdown"
    >
      <div
          v-for="locale in regions"
          :key="locale.slug"
          class="locale-select__option"
          :class="{ 'locale-select__option--active': locale.slug === currentLocale.slug }"
          @click="selectLocale(locale)"
      >
        {{ locale.name }}
      </div>
    </div>
  </div>
</template>

<style scoped>

.locale-select {
  position: relative;
  align-self: center;
}

.locale-select__button {
  display: flex;
  height: 2.5rem;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  border: 2px solid var(--vp-c-border);
  border-radius: 0.375rem;
  background-color: var(--vp-c-bg-soft);
  cursor: pointer;
  outline: none;
  gap: 4px;

  &.isOpen {
    border: 2px solid #dfdfd6;

    .locale-select__icon {
      transform: rotate(180deg);
    }
  }
}

.locale-select__button:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
  --tw-ring-color: var(--vp-c-brand);
  --tw-ring-offset-width: 2px;
}

.locale-select__button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.locale-select__icon {
  width: 1rem;
  height: 1rem;
  opacity: 0.5;
  transition: transform 0.3s;
}

.locale-select__dropdown {
  position: absolute;
  z-index: 50;
  margin-top: 0.25rem;
  max-height: 15rem;
  width: fit-content;
  overflow: auto;
  border: 1px solid var(--vp-c-border);
  border-radius: 0.375rem;
  background-color: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

.locale-select__option {
  display: flex;
  width: 100%;
  cursor: pointer;
  user-select: none;
  padding: 0.325rem 0.75rem;
  font-size: 0.875rem;
  border-radius: 0.125rem;
  outline: none;
}

.locale-select__option:hover,
.locale-select__option:focus {
  background-color: var(--vp-c-brand-soft);
  color: var(--vp-c-text-1);
}

.locale-select__option--active {
  background-color: var(--vp-c-brand-soft);
  color: var(--vp-c-text-1);
}

.locale-select__option[data-disabled] {
  pointer-events: none;
  opacity: 0.5;
}

</style>
