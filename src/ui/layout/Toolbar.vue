<script setup lang="ts">
import { useEditorStore, type EditorTool } from '../../stores/editorStore'
import { useSceneStore } from '../../stores/sceneStore'
import { useProjectStore } from '../../stores/projectStore'
import { useUiStore } from '../../stores/uiStore'
import {
  MousePointer2, Move, RotateCw, Maximize2,
  Play, Square, Globe, Box, Save, Upload, Sun, Moon,
  Undo2, Redo2
} from 'lucide-vue-next'
import CreateMenu from '../components/CreateMenu.vue'
import { Project } from '../../core/Project'
import UiIconButton from '../primitives/UiIconButton.vue'

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
  if (map[e.key.toLowerCase()]) {
    editor.setTool(map[e.key.toLowerCase()])
  }
}

function saveProject() {
  scene.saveProject(project.projectName)
  project.markClean()
  editor.log('Project saved')
}

async function loadProject() {
  const data = await Project.loadFromFile()
  if (data) {
    // Clear current scene and load - basic implementation
    scene.clearScene()
    project.setProjectName(data.name)
    editor.log(`Loaded project: ${data.name}`)
    // TODO: Reconstruct meshes from serialized data
  }
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

    <div class="w-px h-6 bg-editor-border/70" />

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

    <div class="w-px h-6 bg-editor-border/70" />

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
