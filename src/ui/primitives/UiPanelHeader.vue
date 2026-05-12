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

