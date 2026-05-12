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
