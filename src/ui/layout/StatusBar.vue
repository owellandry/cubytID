<script setup lang="ts">
import { useEditorStore } from '../../stores/editorStore'
import { useProjectStore } from '../../stores/projectStore'
import { useSceneStore } from '../../stores/sceneStore'

const editor = useEditorStore()
const project = useProjectStore()
const scene = useSceneStore()
</script>

<template>
  <div class="h-6 flex items-center px-3 bg-editor-panel border-t border-editor-border text-xs text-editor-text-muted select-none">
    <span>{{ project.projectName }}</span>
    <span v-if="project.isDirty" class="text-editor-warning ml-1">●</span>
    <div class="flex-1" />
    <span class="mr-4">Objects: {{ scene.nodes.length }}</span>
    <span class="mr-4">Tool: {{ editor.activeTool }}</span>
    <span>{{ editor.fps }} FPS</span>
  </div>
</template>
