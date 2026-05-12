<script setup lang="ts">
import { ref, watch, computed } from 'vue'

const props = defineProps<{
  modelValue: number
  step?: number
  min?: number
  max?: number
  label?: string
  color?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const startX = ref(0)
const startValue = ref(0)

const displayValue = computed(() => {
  return Number(props.modelValue.toFixed(3))
})

function onInput(e: Event) {
  const val = parseFloat((e.target as HTMLInputElement).value)
  if (!isNaN(val)) emit('update:modelValue', val)
}

function onPointerDown(e: PointerEvent) {
  if (e.target === inputRef.value) return
  isDragging.value = true
  startX.value = e.clientX
  startValue.value = props.modelValue
  document.addEventListener('pointermove', onPointerMove)
  document.addEventListener('pointerup', onPointerUp)
}

function onPointerMove(e: PointerEvent) {
  if (!isDragging.value) return
  const delta = (e.clientX - startX.value) * (props.step || 0.1)
  let newVal = startValue.value + delta
  if (props.min !== undefined) newVal = Math.max(props.min, newVal)
  if (props.max !== undefined) newVal = Math.min(props.max, newVal)
  emit('update:modelValue', newVal)
}

function onPointerUp() {
  isDragging.value = false
  document.removeEventListener('pointermove', onPointerMove)
  document.removeEventListener('pointerup', onPointerUp)
}
</script>

<template>
  <div
    class="flex items-center gap-1 group cursor-ew-resize"
    @pointerdown="onPointerDown"
  >
    <span
      v-if="label"
      class="text-xs font-bold w-3 text-center select-none"
      :class="color || 'text-editor-text-muted'"
    >{{ label }}</span>
    <input
      ref="inputRef"
      type="number"
      :value="displayValue"
      :step="step || 0.1"
      @input="onInput"
      class="flex-1 w-full min-w-0 px-1.5 py-0.5 text-xs bg-editor-surface border border-editor-border rounded text-editor-text focus:border-editor-accent outline-none cursor-ew-resize"
    />
  </div>
</template>
