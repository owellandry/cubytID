<script setup lang="ts">
import { useSceneStore } from '../../stores/sceneStore'
import { computed } from 'vue'
import TransformEditor from '../components/TransformEditor.vue'
import MaterialEditor from '../components/MaterialEditor.vue'

const scene = useSceneStore()

const selectedNode = computed(() => scene.getSelectedNode())
const isMesh = computed(() => selectedNode.value?.type === 'mesh')
</script>

<template>
  <div class="flex flex-col h-full bg-editor-panel">
    <!-- Header -->
    <div class="h-7 flex items-center px-3 border-b border-editor-border text-xs font-semibold text-editor-text-secondary uppercase tracking-wider shrink-0">
      Inspector
    </div>

    <div class="flex-1 overflow-y-auto">
      <!-- No selection -->
      <div v-if="!selectedNode" class="px-3 py-8 text-center text-editor-text-muted text-xs">
        No object selected
      </div>

      <!-- Selected object properties -->
      <div v-else class="p-3 space-y-4">
        <!-- Name -->
        <div>
          <label class="block text-[10px] text-editor-text-muted mb-1 uppercase tracking-wider">Name</label>
          <input
            :value="selectedNode.name"
            @change="e => scene.renameNode(selectedNode!.id, (e.target as HTMLInputElement).value)"
            type="text"
            class="w-full px-2 py-1 text-xs bg-editor-surface border border-editor-border rounded text-editor-text focus:border-editor-accent outline-none"
          />
        </div>

        <!-- Type badge -->
        <div class="flex items-center gap-2">
          <span class="text-[10px] text-editor-text-muted uppercase tracking-wider">Type</span>
          <span class="text-[10px] px-2 py-0.5 rounded-full capitalize"
            :class="{
              'bg-editor-accent/20 text-editor-accent': selectedNode.type === 'mesh',
              'bg-editor-warning/20 text-editor-warning': selectedNode.type === 'light',
              'bg-editor-success/20 text-editor-success': selectedNode.type === 'camera',
              'bg-editor-active text-editor-text-secondary': selectedNode.type === 'group',
            }"
          >{{ selectedNode.type }}</span>
        </div>

        <!-- Visibility toggle -->
        <div class="flex items-center justify-between">
          <span class="text-[10px] text-editor-text-muted uppercase tracking-wider">Visible</span>
          <button
            @click="selectedNode!.visible = !selectedNode!.visible"
            class="w-8 h-4 rounded-full transition-colors relative"
            :class="selectedNode.visible ? 'bg-editor-accent' : 'bg-editor-active'"
          >
            <div
              class="w-3 h-3 rounded-full bg-white absolute top-0.5 transition-all"
              :class="selectedNode.visible ? 'left-4' : 'left-0.5'"
            />
          </button>
        </div>

        <div class="h-px bg-editor-border" />

        <!-- Transform (meshes only) -->
        <TransformEditor v-if="isMesh" />

        <div v-if="isMesh" class="h-px bg-editor-border" />

        <!-- Material (meshes only) -->
        <MaterialEditor v-if="isMesh" />
      </div>
    </div>
  </div>
</template>
