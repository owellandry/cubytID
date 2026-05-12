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

