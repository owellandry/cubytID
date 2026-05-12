<script setup lang="ts">
import { ref } from 'vue'
import { useSceneStore } from '../../stores/sceneStore'
import { useEditorStore } from '../../stores/editorStore'
import type { PrimitiveType } from '../../core/PrimitiveFactory'
import type { LightType } from '../../engine/LightManager'
import {
  Box, Circle, Cylinder, Triangle, Donut, Square,
  Lightbulb, Sun, Cone as ConeIcon, Camera, ChevronDown
} from 'lucide-vue-next'

const scene = useSceneStore()
const editor = useEditorStore()
const showMenu = ref(false)

const primitives: { type: PrimitiveType; label: string; icon: any }[] = [
  { type: 'box', label: 'Box', icon: Box },
  { type: 'sphere', label: 'Sphere', icon: Circle },
  { type: 'cylinder', label: 'Cylinder', icon: Cylinder },
  { type: 'cone', label: 'Cone', icon: Triangle },
  { type: 'torus', label: 'Torus', icon: Donut },
  { type: 'plane', label: 'Plane', icon: Square },
  { type: 'capsule', label: 'Capsule', icon: Circle },
]

const lights: { type: LightType; label: string }[] = [
  { type: 'point', label: 'Point Light' },
  { type: 'directional', label: 'Directional Light' },
  { type: 'spot', label: 'Spot Light' },
  { type: 'hemispheric', label: 'Hemispheric Light' },
]

function create(type: PrimitiveType) {
  scene.createPrimitive(type)
  editor.log(`Created ${type}`)
  showMenu.value = false
}

function createLight(type: LightType) {
  scene.createLight(type)
  editor.log(`Created ${type} light`)
  showMenu.value = false
}

function createCam() {
  scene.createCamera()
  editor.log('Created game camera')
  showMenu.value = false
}

function closeOnOutside(e: MouseEvent) {
  showMenu.value = false
  document.removeEventListener('click', closeOnOutside)
}

function toggle() {
  showMenu.value = !showMenu.value
  if (showMenu.value) {
    setTimeout(() => document.addEventListener('click', closeOnOutside), 0)
  }
}
</script>

<template>
  <div class="relative">
    <button
      @click.stop="toggle"
      class="flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors text-editor-text-secondary hover:bg-editor-hover hover:text-editor-text"
    >
      <Box :size="14" />
      Add
      <ChevronDown :size="12" />
    </button>

    <!-- Dropdown -->
    <div
      v-if="showMenu"
      class="absolute top-full left-0 mt-1 w-52 bg-editor-surface border border-editor-border rounded-lg shadow-xl z-50 py-1 overflow-hidden"
    >
      <!-- Primitives -->
      <div class="px-2 py-1 text-[10px] text-editor-text-muted uppercase tracking-wider">Primitives</div>
      <button
        v-for="p in primitives"
        :key="p.type"
        @click="create(p.type)"
        class="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-editor-text hover:bg-editor-hover transition-colors text-left"
      >
        <component :is="p.icon" :size="14" class="text-editor-text-muted" />
        {{ p.label }}
      </button>

      <div class="h-px bg-editor-border my-1" />

      <!-- Lights -->
      <div class="px-2 py-1 text-[10px] text-editor-text-muted uppercase tracking-wider">Lights</div>
      <button
        v-for="l in lights"
        :key="l.type"
        @click="createLight(l.type)"
        class="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-editor-text hover:bg-editor-hover transition-colors text-left"
      >
        <Lightbulb :size="14" class="text-editor-warning" />
        {{ l.label }}
      </button>

      <div class="h-px bg-editor-border my-1" />

      <!-- Camera -->
      <button
        @click="createCam"
        class="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-editor-text hover:bg-editor-hover transition-colors text-left"
      >
        <Camera :size="14" class="text-editor-accent" />
        Game Camera
      </button>
    </div>
  </div>
</template>
