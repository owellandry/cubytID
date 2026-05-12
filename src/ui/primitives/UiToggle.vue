<script setup lang="ts">
withDefaults(defineProps<{ modelValue: boolean; disabled?: boolean; ariaLabel?: string }>(), { disabled: false, ariaLabel: undefined })
const emit = defineEmits<{ (e: 'update:modelValue', v: boolean): void }>()
</script>

<template>
  <button
    type="button"
    class="h-7 w-12 rounded-full relative transition-colors outline-none"
    :disabled="disabled"
    :aria-label="ariaLabel"
    :class="[
      modelValue ? 'bg-editor-accent' : 'bg-editor-active',
      disabled ? 'opacity-45 cursor-not-allowed' : 'cursor-pointer focus-visible:[box-shadow:var(--focus-ring)]',
    ]"
    @click="emit('update:modelValue', !modelValue)"
  >
    <div
      class="w-5 h-5 rounded-full bg-white absolute top-1 transition-all"
      :class="modelValue ? 'left-6' : 'left-1'"
    />
  </button>
</template>
