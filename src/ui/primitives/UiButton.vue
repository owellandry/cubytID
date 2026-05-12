<script setup lang="ts">
type UiButtonVariant = 'primary' | 'ghost' | 'danger'
type UiButtonSize = 'sm' | 'md'

withDefaults(defineProps<{
  variant?: UiButtonVariant
  size?: UiButtonSize
  disabled?: boolean
}>(), {
  variant: 'ghost',
  size: 'md',
  disabled: false,
})
</script>

<template>
  <button
    class="inline-flex items-center justify-center gap-2 rounded-[var(--radius-1)] select-none transition-colors outline-none"
    :disabled="disabled"
    :class="[
      size === 'sm' ? 'h-8 px-3 text-sm' : 'h-9 px-3.5 text-sm',
      disabled ? 'opacity-45 cursor-not-allowed' : 'cursor-pointer',
      variant === 'primary'
        ? 'bg-editor-accent text-editor-bg hover:bg-editor-accent-hover active:bg-editor-accent'
        : variant === 'danger'
          ? 'bg-editor-error text-white hover:bg-editor-error/90 active:bg-editor-error'
          : 'bg-transparent text-editor-text-secondary hover:bg-editor-hover hover:text-editor-text active:bg-editor-active',
      !disabled ? 'focus-visible:[box-shadow:var(--focus-ring)]' : '',
    ]"
  >
    <slot />
  </button>
</template>

