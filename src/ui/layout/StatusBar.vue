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
