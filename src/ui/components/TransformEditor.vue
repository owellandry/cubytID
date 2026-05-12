<script setup lang="ts">
import NumberInput from './NumberInput.vue'
import { ref, watch, onUnmounted } from 'vue'
import { useSceneStore } from '../../stores/sceneStore'

const scene = useSceneStore()

const pos = ref({ x: 0, y: 0, z: 0 })
const rot = ref({ x: 0, y: 0, z: 0 })
const scl = ref({ x: 1, y: 1, z: 1 })

let pollInterval: ReturnType<typeof setInterval> | null = null

function syncFromEngine() {
  const t = scene.getSelectedTransform()
  if (t) {
    pos.value = { ...t.position }
    rot.value = { ...t.rotation }
    scl.value = { ...t.scaling }
  }
}

watch(() => scene.selectedNodeId, () => {
  syncFromEngine()
  if (pollInterval) clearInterval(pollInterval)
  if (scene.selectedNodeId) {
    pollInterval = setInterval(syncFromEngine, 100)
  }
}, { immediate: true })

onUnmounted(() => {
  if (pollInterval) clearInterval(pollInterval)
})

function updatePos(axis: 'x' | 'y' | 'z', val: number) {
  pos.value[axis] = val
  scene.setSelectedPosition(axis, val)
}

function updateRot(axis: 'x' | 'y' | 'z', val: number) {
  rot.value[axis] = val
  scene.setSelectedRotation(axis, val)
}

function updateScl(axis: 'x' | 'y' | 'z', val: number) {
  scl.value[axis] = val
  scene.setSelectedScaling(axis, val)
}
</script>

<template>
  <div class="space-y-3">
    <!-- Position -->
    <div>
      <div class="text-[10px] text-editor-text-muted mb-1 uppercase tracking-wider">Position</div>
      <div class="grid grid-cols-3 gap-1">
        <NumberInput :modelValue="pos.x" @update:modelValue="v => updatePos('x', v)" label="X" color="text-editor-error" :step="0.1" />
        <NumberInput :modelValue="pos.y" @update:modelValue="v => updatePos('y', v)" label="Y" color="text-editor-success" :step="0.1" />
        <NumberInput :modelValue="pos.z" @update:modelValue="v => updatePos('z', v)" label="Z" color="text-editor-accent" :step="0.1" />
      </div>
    </div>

    <!-- Rotation -->
    <div>
      <div class="text-[10px] text-editor-text-muted mb-1 uppercase tracking-wider">Rotation</div>
      <div class="grid grid-cols-3 gap-1">
        <NumberInput :modelValue="rot.x" @update:modelValue="v => updateRot('x', v)" label="X" color="text-editor-error" :step="1" />
        <NumberInput :modelValue="rot.y" @update:modelValue="v => updateRot('y', v)" label="Y" color="text-editor-success" :step="1" />
        <NumberInput :modelValue="rot.z" @update:modelValue="v => updateRot('z', v)" label="Z" color="text-editor-accent" :step="1" />
      </div>
    </div>

    <!-- Scale -->
    <div>
      <div class="text-[10px] text-editor-text-muted mb-1 uppercase tracking-wider">Scale</div>
      <div class="grid grid-cols-3 gap-1">
        <NumberInput :modelValue="scl.x" @update:modelValue="v => updateScl('x', v)" label="X" color="text-editor-error" :step="0.1" :min="0.01" />
        <NumberInput :modelValue="scl.y" @update:modelValue="v => updateScl('y', v)" label="Y" color="text-editor-success" :step="0.1" :min="0.01" />
        <NumberInput :modelValue="scl.z" @update:modelValue="v => updateScl('z', v)" label="Z" color="text-editor-accent" :step="0.1" :min="0.01" />
      </div>
    </div>
  </div>
</template>
