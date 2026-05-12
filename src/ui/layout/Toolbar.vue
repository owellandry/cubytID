<script setup lang="ts">
import { useEditorStore, type EditorTool } from '../../stores/editorStore'
import { useSceneStore } from '../../stores/sceneStore'
import { useProjectStore } from '../../stores/projectStore'
import {
  MousePointer2, Move, RotateCw, Maximize2,
  Play, Square, Globe, Box, Save,
  Undo2, Redo2, Download, Upload, Trash2
} from 'lucide-vue-next'
import CreateMenu from '../components/CreateMenu.vue'
import { Project } from '../../core/Project'

const editor = useEditorStore()
const scene = useSceneStore()
const project = useProjectStore()

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
  <div class="h-10 flex items-center px-2 gap-1 bg-editor-panel border-b border-editor-border select-none">
    <!-- Logo -->
    <div class="flex items-center gap-2 px-2 mr-2">
      <Box :size="18" class="text-editor-accent" />
      <span class="text-sm font-semibold text-editor-text">CubytID</span>
    </div>

    <div class="w-px h-5 bg-editor-border mx-1" />

    <!-- Tools -->
    <div class="flex items-center gap-0.5">
      <button
        v-for="tool in tools"
        :key="tool.id"
        @click="editor.setTool(tool.id)"
        :title="`${tool.label} (${tool.shortcut})`"
        class="p-1.5 rounded transition-colors"
        :class="editor.activeTool === tool.id
          ? 'bg-editor-accent text-editor-bg'
          : 'text-editor-text-secondary hover:bg-editor-hover hover:text-editor-text'"
      >
        <component :is="tool.icon" :size="16" />
      </button>
    </div>

    <div class="w-px h-5 bg-editor-border mx-1" />

    <!-- Space toggle -->
    <button
      @click="editor.toggleSpace()"
      :title="editor.isWorldSpace ? 'World Space' : 'Local Space'"
      class="p-1.5 rounded text-editor-text-secondary hover:bg-editor-hover hover:text-editor-text transition-colors"
    >
      <Globe :size="16" />
    </button>
    <span class="text-[10px] text-editor-text-muted">{{ editor.isWorldSpace ? 'World' : 'Local' }}</span>

    <div class="w-px h-5 bg-editor-border mx-1" />

    <!-- Create Menu -->
    <CreateMenu />

    <div class="w-px h-5 bg-editor-border mx-1" />

    <!-- Undo / Redo -->
    <button
      @click="scene.engineInstance?.history.undo()"
      :disabled="!editor.canUndo"
      title="Undo (Ctrl+Z)"
      class="p-1.5 rounded transition-colors"
      :class="editor.canUndo ? 'text-editor-text-secondary hover:bg-editor-hover' : 'text-editor-active cursor-not-allowed'"
    >
      <Undo2 :size="16" />
    </button>
    <button
      @click="scene.engineInstance?.history.redo()"
      :disabled="!editor.canRedo"
      title="Redo (Ctrl+Shift+Z)"
      class="p-1.5 rounded transition-colors"
      :class="editor.canRedo ? 'text-editor-text-secondary hover:bg-editor-hover' : 'text-editor-active cursor-not-allowed'"
    >
      <Redo2 :size="16" />
    </button>

    <!-- Spacer -->
    <div class="flex-1" />

    <!-- Play controls -->
    <div class="flex items-center gap-0.5">
      <button
        @click="editor.setMode(editor.mode === 'play' ? 'edit' : 'play')"
        :title="editor.mode === 'play' ? 'Stop' : 'Play'"
        class="p-1.5 rounded transition-colors"
        :class="editor.mode === 'play'
          ? 'bg-editor-error text-white'
          : 'text-editor-success hover:bg-editor-hover'"
      >
        <component :is="editor.mode === 'play' ? Square : Play" :size="16" />
      </button>
    </div>

    <div class="w-px h-5 bg-editor-border mx-1" />

    <!-- File operations -->
    <button @click="loadProject" title="Open Project" class="p-1.5 rounded text-editor-text-secondary hover:bg-editor-hover hover:text-editor-text transition-colors">
      <Upload :size="16" />
    </button>
    <button @click="saveProject" title="Save (Ctrl+S)" class="p-1.5 rounded text-editor-text-secondary hover:bg-editor-hover hover:text-editor-text transition-colors">
      <Save :size="16" />
    </button>
  </div>
</template>
