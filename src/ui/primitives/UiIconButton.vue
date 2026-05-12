<script setup lang="ts">
type UiIconButtonVariant = 'ghost' | 'primary' | 'danger'
type UiIconButtonSize = 'sm' | 'md'

withDefaults(defineProps<{
  variant?: UiIconButtonVariant
  size?: UiIconButtonSize
  disabled?: boolean
  title?: string
  ariaLabel?: string
  pressed?: boolean
}>(), {
  variant: 'ghost',
  size: 'md',
  disabled: false,
  title: undefined,
  ariaLabel: undefined,
  pressed: false,
})
</script>

<template>
  <button
    type="button"
    :title="title"
    :aria-label="ariaLabel ?? title"
    :disabled="disabled"
    class="inline-flex items-center justify-center rounded-[var(--radius-1)] select-none transition-colors outline-none"
    :class="[
      size === 'sm' ? 'h-8 w-8' : 'h-9 w-9',
      disabled ? 'opacity-45 cursor-not-allowed' : 'cursor-pointer',
      pressed ? 'bg-editor-active text-editor-text' : '',
      variant === 'primary'
        ? 'bg-editor-accent text-editor-bg hover:bg-editor-accent-hover active:bg-editor-accent'
        : variant === 'danger'
          ? 'bg-editor-error text-white hover:bg-editor-error/90 active:bg-editor-error'
          : 'text-editor-text-secondary hover:bg-editor-hover hover:text-editor-text active:bg-editor-active',
      !disabled ? 'focus-visible:[box-shadow:var(--focus-ring)]' : '',
    ]"
  >
    <slot />
  </button>
</template>
