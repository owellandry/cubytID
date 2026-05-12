<script setup lang="ts">
import { Terminal, Trash2 } from 'lucide-vue-next'
import { useEditorStore } from '../../stores/editorStore'

const editor = useEditorStore()
</script>

<template>
  <div class="flex flex-col h-full bg-editor-panel">
    <!-- Header -->
    <div class="h-7 flex items-center px-3 border-b border-editor-border text-xs font-semibold text-editor-text-secondary uppercase tracking-wider shrink-0">
      <Terminal :size="12" class="mr-1.5" />
      Console
      <div class="flex-1" />
      <button @click="editor.consoleMessages = []" class="p-0.5 text-editor-text-muted hover:text-editor-text" title="Clear">
        <Trash2 :size="12" />
      </button>
    </div>

    <!-- Logs -->
    <div class="flex-1 overflow-y-auto font-mono text-[11px]">
      <div
        v-for="(log, i) in editor.consoleMessages"
        :key="i"
        class="flex items-start gap-2 px-3 py-0.5 border-b border-editor-border/30"
        :class="{
          'text-editor-text': log.type === 'info',
          'text-editor-warning': log.type === 'warn',
          'text-editor-error': log.type === 'error',
        }"
      >
        <span class="text-editor-text-muted shrink-0">{{ log.timestamp }}</span>
        <span>{{ log.message }}</span>
      </div>
    </div>
  </div>
</template>
