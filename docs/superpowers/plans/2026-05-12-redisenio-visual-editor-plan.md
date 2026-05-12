# Rediseño Visual Editor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rediseñar visualmente el editor (minimal oscuro + tema claro) y aplicar un layout nuevo manteniendo funcionalidad actual.

**Architecture:** Mantener Vue 3 + Tailwind v4 + splitpanes. Introducir tokens semánticos y una capa mínima de componentes UI base (panel, header, botones, inputs, tabs) y refactorizar layout/paneles para usarla.

**Tech Stack:** Vue 3, TypeScript, Pinia, Tailwind CSS v4 (`@theme`), Vite, splitpanes, lucide-vue-next.

---

## Estructura de Archivos (Objetivo)

**Crear**
- `src/stores/uiStore.ts` (tema dark/light, persistencia)
- `src/ui/primitives/UiButton.vue`
- `src/ui/primitives/UiIconButton.vue`
- `src/ui/primitives/UiPanel.vue`
- `src/ui/primitives/UiPanelHeader.vue`
- `src/ui/primitives/UiTabs.vue`
- `src/ui/primitives/UiInput.vue`
- `src/ui/primitives/UiToggle.vue`
- `src/ui/layout/BottomTabs.vue` (Assets/Console como tabs)

**Modificar**
- `src/main.ts` (aplicar tema al arrancar)
- `src/style.css` (tokens semánticos + dark/light + tipografía/densidad)
- `src/ui/layout/Toolbar.vue` (chrome nuevo + toggle de tema)
- `src/ui/layout/StatusBar.vue` (densidad cómoda + estilo consistente)
- `src/ui/layout/EditorLayout.vue` (layout nuevo)
- `src/ui/panels/HierarchyPanel.vue`
- `src/ui/panels/InspectorPanel.vue`
- `src/ui/panels/AssetsPanel.vue`
- `src/ui/panels/ConsolePanel.vue`
- `src/ui/panels/ViewportPanel.vue` (overlay tipográfico/contraste)

---

## Task 1: Preparar tokens semánticos + temas (dark/light)

**Files:**
- Modify: `src/style.css`

- [ ] **Step 1: Actualizar `src/style.css` con tokens semánticos y soporte de tema**

Reemplazar el bloque `@theme` y ajustar estilos base para densidad cómoda:

```css
@import "tailwindcss";

@theme {
  --color-editor-bg: var(--surface-app);
  --color-editor-surface: var(--surface-2);
  --color-editor-panel: var(--surface-1);
  --color-editor-hover: var(--interactive-hover);
  --color-editor-active: var(--interactive-active);
  --color-editor-border: var(--border-1);
  --color-editor-text: var(--text-1);
  --color-editor-text-secondary: var(--text-2);
  --color-editor-text-muted: var(--text-3);
  --color-editor-accent: var(--accent-1);
  --color-editor-accent-hover: var(--accent-2);
  --color-editor-warning: var(--state-warn);
  --color-editor-error: var(--state-error);
  --color-editor-success: var(--state-success);
}

:root {
  color-scheme: dark;

  --radius-1: 10px;
  --radius-2: 12px;

  --shadow-1: 0 1px 0 rgba(0, 0, 0, 0.35);
  --shadow-2: 0 10px 30px rgba(0, 0, 0, 0.25);

  --focus-ring: 0 0 0 3px color-mix(in oklab, var(--accent-1) 45%, transparent);
}

html[data-theme="dark"] {
  color-scheme: dark;

  --surface-app: #0b0e14;
  --surface-1: #0f1420;
  --surface-2: #121a29;
  --surface-3: #172033;

  --border-1: color-mix(in oklab, #7aa2f7 18%, #1a2236);

  --text-1: #e6ebff;
  --text-2: #b7c0e2;
  --text-3: #7f89ad;

  --accent-1: #7aa2f7;
  --accent-2: #89dceb;

  --interactive-hover: color-mix(in oklab, var(--surface-3) 85%, white 15%);
  --interactive-active: color-mix(in oklab, var(--surface-3) 75%, white 25%);

  --state-warn: #f6c177;
  --state-error: #ff6b87;
  --state-success: #7ee787;
}

html[data-theme="light"] {
  color-scheme: light;

  --surface-app: #f7f8fc;
  --surface-1: #ffffff;
  --surface-2: #f1f4fb;
  --surface-3: #e7ebf7;

  --border-1: color-mix(in oklab, #3b82f6 16%, #d6dbea);

  --text-1: #0b1220;
  --text-2: #2a3857;
  --text-3: #5a6789;

  --accent-1: #2563eb;
  --accent-2: #0ea5e9;

  --interactive-hover: color-mix(in oklab, var(--surface-3) 80%, black 20%);
  --interactive-active: color-mix(in oklab, var(--surface-3) 70%, black 30%);

  --state-warn: #b45309;
  --state-error: #be123c;
  --state-success: #047857;
}

html, body, #app {
  @apply w-full h-full overflow-hidden bg-editor-bg text-editor-text;
  font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Arial, "Apple Color Emoji", "Segoe UI Emoji";
  font-size: 14px;
  line-height: 1.35;
}

::-webkit-scrollbar { width: 10px; height: 10px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb {
  background: color-mix(in oklab, var(--border-1) 55%, transparent);
  border-radius: 999px;
}
::-webkit-scrollbar-thumb:hover {
  background: color-mix(in oklab, var(--border-1) 80%, transparent);
}

.splitpanes__splitter {
  @apply !bg-editor-border relative;
}
.splitpanes__splitter:hover {
  @apply !bg-editor-accent;
}
.splitpanes--vertical > .splitpanes__splitter {
  width: 4px !important;
  min-width: 4px !important;
}
.splitpanes--horizontal > .splitpanes__splitter {
  height: 4px !important;
  min-height: 4px !important;
}
```

- [ ] **Step 2: Verificar que el build compila**

Run:
```bash
npm install
npm run build
```

Expected: `vite build` completa sin errores de TypeScript.

---

## Task 2: Store de UI (tema) + aplicación del atributo `data-theme`

**Files:**
- Create: `src/stores/uiStore.ts`
- Modify: `src/main.ts`

- [ ] **Step 1: Crear `src/stores/uiStore.ts`**

```ts
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
    setTheme,
    toggleTheme,
    applyThemeToDom,
  }
})
```

- [ ] **Step 2: Modificar `src/main.ts` para aplicar tema al arrancar**

```ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import { useUiStore } from './stores/uiStore'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)

useUiStore(pinia).applyThemeToDom(useUiStore(pinia).theme)

app.mount('#app')
```

- [ ] **Step 3: Validación manual del tema**

Run:
```bash
npm run dev -- --host 0.0.0.0 --port 4173
```

Expected: el editor carga. En DevTools, `<html>` tiene `data-theme="dark"` o `data-theme="light"`.

---

## Task 3: Crear primitivos UI (panel, header, botones, tabs, input, toggle)

**Files:**
- Create: `src/ui/primitives/UiButton.vue`
- Create: `src/ui/primitives/UiIconButton.vue`
- Create: `src/ui/primitives/UiPanel.vue`
- Create: `src/ui/primitives/UiPanelHeader.vue`
- Create: `src/ui/primitives/UiTabs.vue`
- Create: `src/ui/primitives/UiInput.vue`
- Create: `src/ui/primitives/UiToggle.vue`

- [ ] **Step 1: Crear `src/ui/primitives/UiButton.vue`**

```vue
<script setup lang="ts">
type UiButtonVariant = 'primary' | 'ghost' | 'danger'
type UiButtonSize = 'sm' | 'md'

withDefaults(defineProps<{
  variant?: UiButtonVariant
  size?: UiButtonSize
  disabled?: boolean
}>(), {
  variant: 'ghost',
  size: 'md',
  disabled: false,
})
</script>

<template>
  <button
    class="inline-flex items-center justify-center gap-2 rounded-[var(--radius-1)] select-none transition-colors outline-none"
    :disabled="disabled"
    :class="[
      size === 'sm' ? 'h-8 px-3 text-sm' : 'h-9 px-3.5 text-sm',
      disabled ? 'opacity-45 cursor-not-allowed' : 'cursor-pointer',
      variant === 'primary'
        ? 'bg-editor-accent text-editor-bg hover:bg-editor-accent-hover active:bg-editor-accent'
        : variant === 'danger'
          ? 'bg-editor-error text-white hover:bg-editor-error/90 active:bg-editor-error'
          : 'bg-transparent text-editor-text-secondary hover:bg-editor-hover hover:text-editor-text active:bg-editor-active',
      !disabled ? 'focus-visible:[box-shadow:var(--focus-ring)]' : '',
    ]"
  >
    <slot />
  </button>
</template>
```

- [ ] **Step 2: Crear `src/ui/primitives/UiIconButton.vue`**

```vue
<script setup lang="ts">
type UiIconButtonVariant = 'ghost' | 'primary' | 'danger'
type UiIconButtonSize = 'sm' | 'md'

withDefaults(defineProps<{
  variant?: UiIconButtonVariant
  size?: UiIconButtonSize
  disabled?: boolean
  title?: string
  pressed?: boolean
}>(), {
  variant: 'ghost',
  size: 'md',
  disabled: false,
  title: undefined,
  pressed: false,
})
</script>

<template>
  <button
    :title="title"
    :disabled="disabled"
    class="inline-flex items-center justify-center rounded-[var(--radius-1)] select-none transition-colors outline-none"
    :class="[
      size === 'sm' ? 'h-8 w-8' : 'h-9 w-9',
      disabled ? 'opacity-45 cursor-not-allowed' : 'cursor-pointer',
      pressed ? 'bg-editor-active text-editor-text' : '',
      variant === 'primary'
        ? 'bg-editor-accent text-editor-bg hover:bg-editor-accent-hover active:bg-editor-accent'
        : variant === 'danger'
          ? 'bg-editor-error text-white hover:bg-editor-error/90 active:bg-editor-error'
          : 'text-editor-text-secondary hover:bg-editor-hover hover:text-editor-text active:bg-editor-active',
      !disabled ? 'focus-visible:[box-shadow:var(--focus-ring)]' : '',
    ]"
  >
    <slot />
  </button>
</template>
```

- [ ] **Step 3: Crear `src/ui/primitives/UiPanel.vue`**

```vue
<script setup lang="ts">
withDefaults(defineProps<{ padded?: boolean }>(), { padded: false })
</script>

<template>
  <div class="flex flex-col h-full bg-editor-panel border border-editor-border/70 rounded-[var(--radius-2)] overflow-hidden shadow-[var(--shadow-1)]">
    <slot name="header" />
    <div class="flex-1 overflow-hidden" :class="padded ? 'p-3' : ''">
      <slot />
    </div>
  </div>
</template>
```

- [ ] **Step 4: Crear `src/ui/primitives/UiPanelHeader.vue`**

```vue
<script setup lang="ts">
withDefaults(defineProps<{ title?: string }>(), { title: undefined })
</script>

<template>
  <div class="h-10 flex items-center px-3 gap-2 bg-editor-surface border-b border-editor-border/70">
    <div class="min-w-0 flex items-center gap-2">
      <slot name="icon" />
      <div v-if="title" class="text-sm font-semibold text-editor-text truncate">{{ title }}</div>
      <slot name="title" />
    </div>
    <div class="flex-1" />
    <div class="flex items-center gap-1">
      <slot name="actions" />
    </div>
  </div>
</template>
```

- [ ] **Step 5: Crear `src/ui/primitives/UiTabs.vue`**

```vue
<script setup lang="ts">
export type UiTabItem<T extends string> = {
  id: T
  label: string
}

const props = defineProps<{
  modelValue: string
  items: UiTabItem<string>[]
}>()

const emit = defineEmits<{ (e: 'update:modelValue', v: string): void }>()
</script>

<template>
  <div class="h-10 px-2 flex items-center gap-1 bg-editor-surface border-b border-editor-border/70">
    <button
      v-for="item in props.items"
      :key="item.id"
      class="h-8 px-3 rounded-[var(--radius-1)] text-sm transition-colors outline-none"
      :class="props.modelValue === item.id
        ? 'bg-editor-active text-editor-text'
        : 'text-editor-text-secondary hover:bg-editor-hover hover:text-editor-text'"
      @click="emit('update:modelValue', item.id)"
    >
      {{ item.label }}
    </button>
  </div>
</template>
```

- [ ] **Step 6: Crear `src/ui/primitives/UiInput.vue`**

```vue
<script setup lang="ts">
withDefaults(defineProps<{
  modelValue?: string
  placeholder?: string
  disabled?: boolean
}>(), {
  modelValue: '',
  placeholder: undefined,
  disabled: false,
})

const emit = defineEmits<{ (e: 'update:modelValue', v: string): void }>()
</script>

<template>
  <input
    class="h-9 w-full px-3 text-sm bg-editor-surface border border-editor-border/70 rounded-[var(--radius-1)] text-editor-text outline-none"
    :class="disabled ? 'opacity-45 cursor-not-allowed' : 'focus-visible:[box-shadow:var(--focus-ring)]'"
    :disabled="disabled"
    :placeholder="placeholder"
    :value="modelValue"
    @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>
```

- [ ] **Step 7: Crear `src/ui/primitives/UiToggle.vue`**

```vue
<script setup lang="ts">
withDefaults(defineProps<{ modelValue: boolean; disabled?: boolean }>(), { disabled: false })
const emit = defineEmits<{ (e: 'update:modelValue', v: boolean): void }>()
</script>

<template>
  <button
    class="h-7 w-12 rounded-full relative transition-colors outline-none"
    :disabled="disabled"
    :class="[
      modelValue ? 'bg-editor-accent' : 'bg-editor-active',
      disabled ? 'opacity-45 cursor-not-allowed' : 'cursor-pointer focus-visible:[box-shadow:var(--focus-ring)]',
    ]"
    @click="emit('update:modelValue', !modelValue)"
  >
    <div
      class="w-5 h-5 rounded-full bg-white absolute top-1 transition-all"
      :class="modelValue ? 'left-6' : 'left-1'"
    />
  </button>
</template>
```

- [ ] **Step 8: Validar build**

Run:
```bash
npm run build
```

Expected: build OK.

---

## Task 4: Refactor de Toolbar y StatusBar (chrome minimal + toggle de tema)

**Files:**
- Modify: `src/ui/layout/Toolbar.vue`
- Modify: `src/ui/layout/StatusBar.vue`

- [ ] **Step 1: Modificar `src/ui/layout/Toolbar.vue` para usar primitivos y agregar toggle de tema**

Cambios clave:
- Cambiar alto a `h-12` (cómodo).
- Usar `UiIconButton` para herramientas.
- Agregar botón de tema (dark/light).

```vue
<script setup lang="ts">
import { useEditorStore, type EditorTool } from '../../stores/editorStore'
import { useSceneStore } from '../../stores/sceneStore'
import { useProjectStore } from '../../stores/projectStore'
import { useUiStore } from '../../stores/uiStore'
import {
  MousePointer2, Move, RotateCw, Maximize2,
  Play, Square, Globe, Box, Save, Upload, Sun, Moon,
  Undo2, Redo2,
} from 'lucide-vue-next'
import CreateMenu from '../components/CreateMenu.vue'
import UiIconButton from '../primitives/UiIconButton.vue'
import { Project } from '../../core/Project'

const editor = useEditorStore()
const scene = useSceneStore()
const project = useProjectStore()
const ui = useUiStore()

const tools: { id: EditorTool; icon: any; label: string; shortcut: string }[] = [
  { id: 'select', icon: MousePointer2, label: 'Select', shortcut: 'Q' },
  { id: 'translate', icon: Move, label: 'Move', shortcut: 'W' },
  { id: 'rotate', icon: RotateCw, label: 'Rotate', shortcut: 'E' },
  { id: 'scale', icon: Maximize2, label: 'Scale', shortcut: 'R' },
]

function handleKeyboard(e: KeyboardEvent) {
  if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
  const map: Record<string, EditorTool> = { q: 'select', w: 'translate', e: 'rotate', r: 'scale' }
  if (map[e.key.toLowerCase()]) editor.setTool(map[e.key.toLowerCase()])
}

function saveProject() {
  scene.saveProject(project.projectName)
  project.markClean()
  editor.log('Project saved')
}

async function loadProject() {
  const data = await Project.loadFromFile()
  if (!data) return
  scene.clearScene()
  project.setProjectName(data.name)
  editor.log(`Loaded project: ${data.name}`)
}

function handleSaveShortcut(e: KeyboardEvent) {
  if (e.key === 's' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault()
    saveProject()
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('keydown', handleKeyboard)
  window.addEventListener('keydown', handleSaveShortcut)
}
</script>

<template>
  <div class="h-12 flex items-center px-3 gap-2 bg-editor-panel border-b border-editor-border/70 select-none">
    <div class="flex items-center gap-2 pr-2">
      <Box :size="18" class="text-editor-accent" />
      <div class="leading-tight">
        <div class="text-sm font-semibold text-editor-text">CubytID</div>
        <div class="text-xs text-editor-text-muted">{{ project.projectName }}</div>
      </div>
    </div>

    <div class="w-px h-6 bg-editor-border/70" />

    <div class="flex items-center gap-1">
      <UiIconButton
        v-for="tool in tools"
        :key="tool.id"
        :title="`${tool.label} (${tool.shortcut})`"
        :pressed="editor.activeTool === tool.id"
        @click="editor.setTool(tool.id)"
      >
        <component :is="tool.icon" :size="16" />
      </UiIconButton>
    </div>

    <div class="w-px h-6 bg-editor-border/70" />

    <UiIconButton
      @click="editor.toggleSpace()"
      :title="editor.isWorldSpace ? 'World Space' : 'Local Space'"
    >
      <Globe :size="16" />
    </UiIconButton>

    <CreateMenu />

    <div class="w-px h-6 bg-editor-border/70" />

    <UiIconButton
      @click="scene.engineInstance?.history.undo()"
      :disabled="!editor.canUndo"
      title="Undo (Ctrl+Z)"
    >
      <Undo2 :size="16" />
    </UiIconButton>
    <UiIconButton
      @click="scene.engineInstance?.history.redo()"
      :disabled="!editor.canRedo"
      title="Redo (Ctrl+Shift+Z)"
    >
      <Redo2 :size="16" />
    </UiIconButton>

    <div class="flex-1" />

    <UiIconButton
      :title="ui.theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'"
      @click="ui.toggleTheme()"
    >
      <component :is="ui.theme === 'dark' ? Sun : Moon" :size="16" />
    </UiIconButton>

    <UiIconButton @click="loadProject" title="Open Project">
      <Upload :size="16" />
    </UiIconButton>
    <UiIconButton @click="saveProject" title="Save (Ctrl+S)">
      <Save :size="16" />
    </UiIconButton>

    <UiIconButton
      @click="editor.setMode(editor.mode === 'play' ? 'edit' : 'play')"
      :title="editor.mode === 'play' ? 'Stop' : 'Play'"
      :variant="editor.mode === 'play' ? 'danger' : 'ghost'"
    >
      <component :is="editor.mode === 'play' ? Square : Play" :size="16" />
    </UiIconButton>
  </div>
</template>
```

- [ ] **Step 2: Modificar `src/ui/layout/StatusBar.vue` para densidad cómoda**

```vue
<script setup lang="ts">
import { useEditorStore } from '../../stores/editorStore'
import { useProjectStore } from '../../stores/projectStore'
import { useSceneStore } from '../../stores/sceneStore'

const editor = useEditorStore()
const project = useProjectStore()
const scene = useSceneStore()
</script>

<template>
  <div class="h-9 flex items-center px-3 bg-editor-panel border-t border-editor-border/70 text-sm text-editor-text-secondary select-none">
    <span class="truncate max-w-[40%]">{{ project.projectName }}</span>
    <span v-if="project.isDirty" class="text-editor-warning ml-2">●</span>
    <div class="flex-1" />
    <span class="mr-5">Objects: {{ scene.nodes.length }}</span>
    <span class="mr-5">Tool: {{ editor.activeTool }}</span>
    <span class="tabular-nums">{{ editor.fps }} FPS</span>
  </div>
</template>
```

- [ ] **Step 3: Validación manual**

Run:
```bash
npm run dev -- --host 0.0.0.0 --port 4173
```

Expected:
- Toolbar con altura mayor y mejor legibilidad.
- Botón de tema alterna dark/light sin recargar.
- Foco visible en botones con Tab.

---

## Task 5: Layout nuevo (viewport dominante + bottom tabs para Assets/Console)

**Files:**
- Create: `src/ui/layout/BottomTabs.vue`
- Modify: `src/ui/layout/EditorLayout.vue`

- [ ] **Step 1: Crear `src/ui/layout/BottomTabs.vue`**

```vue
<script setup lang="ts">
import { ref } from 'vue'
import UiPanel from '../primitives/UiPanel.vue'
import UiTabs, { type UiTabItem } from '../primitives/UiTabs.vue'
import AssetsPanel from '../panels/AssetsPanel.vue'
import ConsolePanel from '../panels/ConsolePanel.vue'

type BottomTab = 'assets' | 'console'

const tabs: UiTabItem<BottomTab>[] = [
  { id: 'assets', label: 'Assets' },
  { id: 'console', label: 'Console' },
]

const active = ref<BottomTab>('assets')
</script>

<template>
  <UiPanel>
    <template #header>
      <UiTabs v-model="active" :items="tabs" />
    </template>

    <div class="h-full">
      <AssetsPanel v-if="active === 'assets'" />
      <ConsolePanel v-else />
    </div>
  </UiPanel>
</template>
```

- [ ] **Step 2: Modificar `src/ui/layout/EditorLayout.vue`**

```vue
<script setup lang="ts">
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import Toolbar from './Toolbar.vue'
import StatusBar from './StatusBar.vue'
import ViewportPanel from '../panels/ViewportPanel.vue'
import HierarchyPanel from '../panels/HierarchyPanel.vue'
import InspectorPanel from '../panels/InspectorPanel.vue'
import BottomTabs from './BottomTabs.vue'
</script>

<template>
  <div class="flex flex-col w-full h-full bg-editor-bg">
    <Toolbar />

    <div class="flex-1 overflow-hidden p-3">
      <Splitpanes class="h-full !bg-transparent" :dbl-click-splitter="false">
        <Pane :size="18" :min-size="12" :max-size="28">
          <HierarchyPanel />
        </Pane>

        <Pane :size="64">
          <Splitpanes horizontal :dbl-click-splitter="false">
            <Pane :size="72" :min-size="50">
              <ViewportPanel />
            </Pane>
            <Pane :size="28" :min-size="16">
              <BottomTabs />
            </Pane>
          </Splitpanes>
        </Pane>

        <Pane :size="18" :min-size="12" :max-size="28">
          <InspectorPanel />
        </Pane>
      </Splitpanes>
    </div>

    <StatusBar />
  </div>
</template>
```

- [ ] **Step 3: Validación manual de layout**

Expected:
- Assets/Console ya no se muestran lado a lado; aparecen en tabs abajo.
- Paneles laterales tienen más aire (padding del contenedor).
- Viewport es claramente dominante.

---

## Task 6: Migrar paneles al chrome nuevo (UiPanel + UiPanelHeader + controles)

**Files:**
- Modify: `src/ui/panels/HierarchyPanel.vue`
- Modify: `src/ui/panels/InspectorPanel.vue`
- Modify: `src/ui/panels/AssetsPanel.vue`
- Modify: `src/ui/panels/ConsolePanel.vue`

- [ ] **Step 1: Actualizar `HierarchyPanel.vue`**

Objetivo: reemplazar header manual por `UiPanel`/`UiPanelHeader` y estandarizar acciones.

Cambios en template (mantener lógica):

```vue
<script setup lang="ts">
import { useSceneStore, type SceneNode } from '../../stores/sceneStore'
import { Eye, EyeOff, ChevronRight, ChevronDown, Trash2 } from 'lucide-vue-next'
import { ref } from 'vue'
import UiPanel from '../primitives/UiPanel.vue'
import UiPanelHeader from '../primitives/UiPanelHeader.vue'
import UiIconButton from '../primitives/UiIconButton.vue'

const scene = useSceneStore()
const expandedNodes = ref<Set<string>>(new Set())
const dragNodeId = ref<string | null>(null)
const dragOverNodeId = ref<string | null>(null)

function toggleExpand(id: string) {
  if (expandedNodes.value.has(id)) expandedNodes.value.delete(id)
  else expandedNodes.value.add(id)
}

function hasChildren(id: string): boolean {
  return scene.nodes.some(n => n.parentId === id)
}

function getTypeIcon(type: SceneNode['type']): string {
  switch (type) {
    case 'mesh': return '◆'
    case 'light': return '☀'
    case 'camera': return '📷'
    case 'group': return '📁'
    default: return '○'
  }
}

function onDragStart(e: DragEvent, id: string) {
  dragNodeId.value = id
  e.dataTransfer!.effectAllowed = 'move'
}

function onDragOver(e: DragEvent, id: string) {
  e.preventDefault()
  dragOverNodeId.value = id
}

function onDragLeave() {
  dragOverNodeId.value = null
}

function onDrop(e: DragEvent, targetId: string | null) {
  e.preventDefault()
  if (dragNodeId.value && dragNodeId.value !== targetId) {
    scene.reparentNode(dragNodeId.value, targetId)
  }
  dragNodeId.value = null
  dragOverNodeId.value = null
}

function onDropRoot(e: DragEvent) {
  onDrop(e, null)
}
</script>

<template>
  <UiPanel>
    <template #header>
      <UiPanelHeader title="Hierarchy">
        <template #actions>
          <UiIconButton
            v-if="scene.selectedNodeId"
            title="Delete selected"
            @click="scene.deleteSelected()"
          >
            <Trash2 :size="16" />
          </UiIconButton>
        </template>
      </UiPanelHeader>
    </template>

    <div class="flex flex-col h-full">
      <div class="flex-1 overflow-y-auto py-2" @dragover.prevent @drop="onDropRoot">
        <div
          v-if="scene.nodes.length === 0"
          class="px-3 py-8 text-center text-editor-text-muted text-sm"
        >
          Scene is empty.<br>Use <b>Add</b> in the toolbar.
        </div>

        <template v-for="node in scene.getChildren(null)" :key="node.id">
          <div
            draggable="true"
            @dragstart="e => onDragStart(e, node.id)"
            @dragover="e => onDragOver(e, node.id)"
            @dragleave="onDragLeave"
            @drop.stop="e => onDrop(e, node.id)"
            @click="scene.selectNode(node.id)"
            class="flex items-center gap-2 px-3 py-2 cursor-pointer text-sm transition-colors group"
            :class="[
              scene.selectedNodeId === node.id
                ? 'bg-editor-accent/12 text-editor-text'
                : 'text-editor-text hover:bg-editor-hover',
              dragOverNodeId === node.id ? 'focus-visible:[box-shadow:var(--focus-ring)]' : ''
            ]"
          >
            <button
              v-if="hasChildren(node.id)"
              @click.stop="toggleExpand(node.id)"
              class="p-0 text-editor-text-muted hover:text-editor-text"
            >
              <component :is="expandedNodes.has(node.id) ? ChevronDown : ChevronRight" :size="14" />
            </button>
            <span v-else class="w-[14px]" />
            <span class="text-xs w-5 text-center text-editor-text-muted">{{ getTypeIcon(node.type) }}</span>
            <span class="flex-1 truncate">{{ node.name }}</span>
            <button
              @click.stop="node.visible = !node.visible"
              class="p-0 opacity-0 group-hover:opacity-100 text-editor-text-muted hover:text-editor-text"
            >
              <component :is="node.visible ? Eye : EyeOff" :size="14" />
            </button>
          </div>

          <template v-if="expandedNodes.has(node.id)">
            <div
              v-for="child in scene.getChildren(node.id)"
              :key="child.id"
              draggable="true"
              @dragstart="e => onDragStart(e, child.id)"
              @dragover="e => onDragOver(e, child.id)"
              @dragleave="onDragLeave"
              @drop.stop="e => onDrop(e, child.id)"
              @click="scene.selectNode(child.id)"
              class="flex items-center gap-2 px-3 py-2 cursor-pointer text-sm transition-colors group pl-8"
              :class="[
                scene.selectedNodeId === child.id
                  ? 'bg-editor-accent/12 text-editor-text'
                  : 'text-editor-text hover:bg-editor-hover',
                dragOverNodeId === child.id ? 'focus-visible:[box-shadow:var(--focus-ring)]' : ''
              ]"
            >
              <span class="w-[14px]" />
              <span class="text-xs w-5 text-center text-editor-text-muted">{{ getTypeIcon(child.type) }}</span>
              <span class="flex-1 truncate">{{ child.name }}</span>
              <button
                @click.stop="child.visible = !child.visible"
                class="p-0 opacity-0 group-hover:opacity-100 text-editor-text-muted hover:text-editor-text"
              >
                <component :is="child.visible ? Eye : EyeOff" :size="14" />
              </button>
            </div>
          </template>
        </template>
      </div>
    </div>
  </UiPanel>
</template>
```

- [ ] **Step 2: Actualizar `InspectorPanel.vue`**

Objetivo: usar `UiPanel`/`UiPanelHeader`, `UiInput`, `UiToggle`, y tipografía cómoda.

```vue
<script setup lang="ts">
import { useSceneStore } from '../../stores/sceneStore'
import { computed } from 'vue'
import TransformEditor from '../components/TransformEditor.vue'
import MaterialEditor from '../components/MaterialEditor.vue'
import UiPanel from '../primitives/UiPanel.vue'
import UiPanelHeader from '../primitives/UiPanelHeader.vue'
import UiInput from '../primitives/UiInput.vue'
import UiToggle from '../primitives/UiToggle.vue'

const scene = useSceneStore()
const selectedNode = computed(() => scene.getSelectedNode())
const isMesh = computed(() => selectedNode.value?.type === 'mesh')
</script>

<template>
  <UiPanel>
    <template #header>
      <UiPanelHeader title="Inspector" />
    </template>

    <div class="flex-1 overflow-y-auto">
      <div v-if="!selectedNode" class="px-3 py-10 text-center text-editor-text-muted text-sm">
        No object selected
      </div>

      <div v-else class="p-4 space-y-5">
        <div>
          <label class="block text-xs text-editor-text-muted mb-2">Name</label>
          <UiInput
            :model-value="selectedNode.name"
            @update:model-value="v => scene.renameNode(selectedNode!.id, v)"
          />
        </div>

        <div class="flex items-center justify-between">
          <div class="text-xs text-editor-text-muted">Visible</div>
          <UiToggle
            :model-value="selectedNode.visible"
            @update:model-value="v => (selectedNode!.visible = v)"
          />
        </div>

        <div class="h-px bg-editor-border/50" />

        <TransformEditor v-if="isMesh" />

        <div v-if="isMesh" class="h-px bg-editor-border/50" />

        <MaterialEditor v-if="isMesh" />
      </div>
    </div>
  </UiPanel>
</template>
```

- [ ] **Step 3: Actualizar `AssetsPanel.vue` y `ConsolePanel.vue`**

Objetivo: como ahora viven dentro de `BottomTabs` (que ya trae su propio header), estos paneles deben renderizar solo contenido (sin su header propio).

Cambios mínimos:
- Eliminar el header de cada panel.
- Mantener acciones (import/clear) moviéndolas a `BottomTabs` si se requieren.

Primero: ajustar `AssetsPanel.vue` para exponer `openFileDialog()` vía `defineExpose`:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { FolderOpen, Upload, FileBox } from 'lucide-vue-next'
import { useSceneStore } from '../../stores/sceneStore'
import { useEditorStore } from '../../stores/editorStore'

const scene = useSceneStore()
const editor = useEditorStore()
const importedAssets = ref<string[]>([])
const isDragOver = ref(false)

function onDrop(e: DragEvent) {
  e.preventDefault()
  isDragOver.value = false
  if (!e.dataTransfer?.files.length) return
  handleFiles(e.dataTransfer.files)
}

function onDragOver(e: DragEvent) {
  e.preventDefault()
  isDragOver.value = true
}

function onDragLeave() {
  isDragOver.value = false
}

function openFileDialog() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.glb,.gltf,.obj,.fbx,.png,.jpg,.jpeg,.svg'
  input.multiple = true
  input.onchange = () => {
    if (input.files) handleFiles(input.files)
  }
  input.click()
}

async function handleFiles(files: FileList) {
  const engine = scene.engineInstance
  if (!engine) return

  for (const file of files) {
    const ext = file.name.split('.').pop()?.toLowerCase()
    if (['glb', 'gltf', 'obj', 'fbx'].includes(ext || '')) {
      try {
        editor.log(`Importing model: ${file.name}...`)
        const result = await engine.assetManager.importModel(file)
        result.meshes.forEach(mesh => {
          const id = mesh.uniqueId.toString()
          engine.sceneGraph.registerNode(id, mesh)
          scene.addNode({
            id,
            name: mesh.name || result.rootName,
            type: 'mesh',
            parentId: null,
            visible: true,
            locked: false,
          })
        })
        importedAssets.value.push(file.name)
        editor.log(`✓ Imported ${file.name}`, 'info')
      } catch (err) {
        editor.log(`✗ Failed to import ${file.name}: ${err}`, 'error')
      }
    } else {
      importedAssets.value.push(file.name)
      editor.log(`Added texture: ${file.name}`)
    }
  }
}

defineExpose({ openFileDialog })
</script>

<template>
  <div
    class="h-full overflow-y-auto"
    @drop="onDrop"
    @dragover="onDragOver"
    @dragleave="onDragLeave"
  >
    <div
      v-if="importedAssets.length === 0"
      class="px-4 py-10 text-center text-editor-text-muted text-sm"
      :class="isDragOver ? 'bg-editor-accent/10 focus-visible:[box-shadow:var(--focus-ring)] rounded' : ''"
    >
      <FolderOpen :size="26" class="mx-auto mb-3 opacity-60" />
      <p>Drop 3D models or textures here<br>(.glb, .gltf, .obj, .png, .jpg)</p>
    </div>

    <div v-else class="p-2">
      <div
        v-for="asset in importedAssets"
        :key="asset"
        class="flex items-center gap-2 px-3 py-2 text-sm text-editor-text hover:bg-editor-hover rounded-[var(--radius-1)] cursor-default"
      >
        <FileBox :size="16" class="text-editor-text-muted shrink-0" />
        <span class="truncate">{{ asset }}</span>
      </div>
    </div>
  </div>
</template>
```

Luego: ajustar `ConsolePanel.vue` para solo logs:

```vue
<script setup lang="ts">
import { useEditorStore } from '../../stores/editorStore'
const editor = useEditorStore()
</script>

<template>
  <div class="h-full overflow-y-auto font-mono text-sm">
    <div
      v-for="(log, i) in editor.consoleMessages"
      :key="i"
      class="flex items-start gap-3 px-4 py-2 border-b border-editor-border/30"
      :class="{
        'text-editor-text': log.type === 'info',
        'text-editor-warning': log.type === 'warn',
        'text-editor-error': log.type === 'error',
      }"
    >
      <span class="text-editor-text-muted shrink-0 tabular-nums">{{ log.timestamp }}</span>
      <span class="whitespace-pre-wrap break-words">{{ log.message }}</span>
    </div>
  </div>
</template>
```

- [ ] **Step 4: Conectar acciones de Assets/Console a `BottomTabs.vue`**

Actualizar `BottomTabs.vue` para mostrar acciones según tab:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Upload, Trash2 } from 'lucide-vue-next'
import UiPanel from '../primitives/UiPanel.vue'
import UiTabs, { type UiTabItem } from '../primitives/UiTabs.vue'
import UiIconButton from '../primitives/UiIconButton.vue'
import AssetsPanel from '../panels/AssetsPanel.vue'
import ConsolePanel from '../panels/ConsolePanel.vue'
import { useEditorStore } from '../../stores/editorStore'

type BottomTab = 'assets' | 'console'

const tabs: UiTabItem<BottomTab>[] = [
  { id: 'assets', label: 'Assets' },
  { id: 'console', label: 'Console' },
]

const active = ref<BottomTab>('assets')
const assetsRef = ref<InstanceType<typeof AssetsPanel> | null>(null)
const editor = useEditorStore()
</script>

<template>
  <UiPanel>
    <template #header>
      <div class="flex items-center bg-editor-surface border-b border-editor-border/70">
        <div class="flex-1">
          <UiTabs v-model="active" :items="tabs" />
        </div>
        <div class="pr-2 flex items-center gap-1">
          <UiIconButton
            v-if="active === 'assets'"
            title="Import"
            @click="assetsRef?.openFileDialog()"
          >
            <Upload :size="16" />
          </UiIconButton>
          <UiIconButton
            v-else
            title="Clear"
            @click="editor.consoleMessages = []"
          >
            <Trash2 :size="16" />
          </UiIconButton>
        </div>
      </div>
    </template>

    <div class="h-full">
      <AssetsPanel v-if="active === 'assets'" ref="assetsRef" />
      <ConsolePanel v-else />
    </div>
  </UiPanel>
</template>
```

- [ ] **Step 5: Validación manual de paneles**

Expected:
- Headers consistentes, tipografía más grande y padding cómodo.
- Acciones Import/Clear funcionan desde el header de tabs.
- Drag & drop y selección siguen funcionando.

---

## Task 7: Ajustes del Viewport (superficie, overlay, contraste)

**Files:**
- Modify: `src/ui/panels/ViewportPanel.vue`

- [ ] **Step 1: Ajustar container del viewport para que coincida con el chrome**

Modificar wrapper para que se vea como panel (sin romper el canvas):

```vue
<template>
  <div
    ref="containerRef"
    class="w-full h-full relative overflow-hidden bg-editor-panel border border-editor-border/70 rounded-[var(--radius-2)] shadow-[var(--shadow-1)]"
    @drop="onDrop"
    @dragover="onDragOver"
  >
    <canvas ref="canvasRef" class="w-full h-full outline-none block" />

    <div class="absolute top-3 left-3 text-sm text-editor-text-muted pointer-events-none select-none">
      Perspective
    </div>

    <div
      v-if="editorStore.mode === 'play'"
      class="absolute top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-editor-error/85 text-white text-sm font-semibold rounded-full"
    >
      ▶ PLAY MODE
    </div>
  </div>
</template>
```

- [ ] **Step 2: Validación manual**

Expected:
- Viewport se integra visualmente con paneles (borde + radius + shadow).
- Canvas sigue respondiendo a resize (splitpanes).

---

## Task 8: Verificación final + auditoría con guía de diseño

**Files:**
- (solo verificación)

- [ ] **Step 1: Verificación de build**

Run:
```bash
npm run build
npm run preview -- --host 0.0.0.0 --port 4173
```

Expected: preview funciona, sin errores en consola.

- [ ] **Step 2: Checklist manual (usabilidad)**

Validar:
- Focus visible en botones e inputs (Tab / Shift+Tab).
- Contraste de texto en dark y light.
- Tamaños cómodos (toolbar/panel headers/filas).
- Scrollbars y splitters se ven bien en ambos temas.

- [ ] **Step 3: Auditoría de UI con `web-design-guidelines`**

Revisar:
- Jerarquía visual, consistencia de spacing y tipografía.
- Estados interactivos (hover/active/focus) coherentes.
- Accesibilidad base (focus visible, targets, contraste).

