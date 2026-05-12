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
      class="h-8 px-3 rounded-[var(--radius-1)] text-sm transition-colors outline-none focus-visible:[box-shadow:var(--focus-ring)]"
      :class="props.modelValue === item.id
        ? 'bg-editor-active text-editor-text'
        : 'text-editor-text-secondary hover:bg-editor-hover hover:text-editor-text'"
      @click="emit('update:modelValue', item.id)"
    >
      {{ item.label }}
    </button>
  </div>
</template>
