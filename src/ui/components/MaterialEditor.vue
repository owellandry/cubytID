<script setup lang="ts">
import { ref, watch } from 'vue'
import { useSceneStore } from '../../stores/sceneStore'
import NumberInput from './NumberInput.vue'

const scene = useSceneStore()

const diffuseR = ref(0.7)
const diffuseG = ref(0.7)
const diffuseB = ref(0.7)
const alpha = ref(1)
const metallic = ref(0)
const roughness = ref(1)
const diffuseHex = ref('#b3b3b3')

function syncFromEngine() {
  const engine = scene.engineInstance
  if (!engine || !scene.selectedNodeId) return
  const mesh = engine.sceneGraph.getMesh(scene.selectedNodeId)
  if (!mesh?.material) return
  const mat = mesh.material as any
  if (mat.diffuseColor) {
    diffuseR.value = mat.diffuseColor.r
    diffuseG.value = mat.diffuseColor.g
    diffuseB.value = mat.diffuseColor.b
    diffuseHex.value = mat.diffuseColor.toHexString()
  }
  if (mat.alpha !== undefined) alpha.value = mat.alpha
  if (mat.metallic !== undefined) metallic.value = mat.metallic
  if (mat.roughness !== undefined) roughness.value = mat.roughness
}

watch(() => scene.selectedNodeId, syncFromEngine, { immediate: true })

function updateColor(hex: string) {
  diffuseHex.value = hex
  const engine = scene.engineInstance
  if (!engine || !scene.selectedNodeId) return
  const mesh = engine.sceneGraph.getMesh(scene.selectedNodeId)
  if (!mesh?.material) return
  const mat = mesh.material as any
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  if (mat.diffuseColor) {
    mat.diffuseColor.r = r
    mat.diffuseColor.g = g
    mat.diffuseColor.b = b
  }
}

function updateAlpha(val: number) {
  alpha.value = val
  const engine = scene.engineInstance
  if (!engine || !scene.selectedNodeId) return
  const mesh = engine.sceneGraph.getMesh(scene.selectedNodeId)
  if (mesh?.material) (mesh.material as any).alpha = val
}
</script>

<template>
  <div class="space-y-3">
    <div class="text-[10px] text-editor-text-muted uppercase tracking-wider">Material</div>

    <!-- Color -->
    <div>
      <label class="block text-xs text-editor-text-muted mb-1">Diffuse Color</label>
      <div class="flex items-center gap-2">
        <input
          type="color"
          :value="diffuseHex"
          @input="e => updateColor((e.target as HTMLInputElement).value)"
          class="w-8 h-6 border border-editor-border rounded cursor-pointer bg-transparent"
        />
        <span class="text-xs text-editor-text-secondary font-mono">{{ diffuseHex }}</span>
      </div>
    </div>

    <!-- Alpha -->
    <div>
      <label class="block text-xs text-editor-text-muted mb-1">Opacity</label>
      <div class="flex items-center gap-2">
        <input
          type="range"
          :value="alpha"
          @input="e => updateAlpha(parseFloat((e.target as HTMLInputElement).value))"
          min="0" max="1" step="0.01"
          class="flex-1 h-1 accent-editor-accent"
        />
        <span class="text-xs text-editor-text-secondary w-8 text-right">{{ (alpha * 100).toFixed(0) }}%</span>
      </div>
    </div>
  </div>
</template>
