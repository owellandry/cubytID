import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export type UiTheme = 'dark' | 'light'

const STORAGE_KEY = 'cubytid.ui.theme'

function readInitialTheme(): UiTheme {
  if (typeof window === 'undefined') return 'dark'
  const stored = window.localStorage.getItem(STORAGE_KEY) as UiTheme | null
  if (stored === 'dark' || stored === 'light') return stored
  return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

export const useUiStore = defineStore('ui', () => {
  const theme = ref<UiTheme>(readInitialTheme())

  const isDark = computed(() => theme.value === 'dark')

  function applyThemeToDom(next: UiTheme) {
    if (typeof document === 'undefined') return
    document.documentElement.dataset.theme = next
    const meta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null
    if (meta) {
      meta.content = next === 'dark' ? '#0b0e14' : '#f7f8fc'
    }
  }

  function init() {
    applyThemeToDom(theme.value)
  }

  function setTheme(next: UiTheme) {
    theme.value = next
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, next)
    }
    applyThemeToDom(next)
  }

  function toggleTheme() {
    setTheme(theme.value === 'dark' ? 'light' : 'dark')
  }

  return {
    theme,
    isDark,
    init,
    setTheme,
    toggleTheme,
  }
})
