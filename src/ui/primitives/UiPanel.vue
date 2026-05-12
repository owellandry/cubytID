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

