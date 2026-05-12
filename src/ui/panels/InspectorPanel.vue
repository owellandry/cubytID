<script setup lang="ts">
import { useSceneStore } from '../../stores/sceneStore'
import { computed, inject } from 'vue'
import TransformEditor from '../components/TransformEditor.vue'
import MaterialEditor from '../components/MaterialEditor.vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import UiPanel from '../primitives/UiPanel.vue'
import UiPanelHeader from '../primitives/UiPanelHeader.vue'
import UiIconButton from '../primitives/UiIconButton.vue'
import UiInput from '../primitives/UiInput.vue'
import UiToggle from '../primitives/UiToggle.vue'
import { layoutContextKey } from '../layout/layoutContext'

const scene = useSceneStore()
const layout = inject(layoutContextKey, null)
const isCollapsed = computed(() => layout?.rightCollapsed.value ?? false)

const selectedNode = computed(() => scene.getSelectedNode())
const isMesh = computed(() => selectedNode.value?.type === 'mesh')
</script>

<template>
  <UiPanel>
    <template #header>
      <UiPanelHeader title="Inspector">
        <template #actions>
          <UiIconButton
            v-if="layout"
            :title="isCollapsed ? 'Expand panel' : 'Collapse panel'"
            @click="layout.toggleRight()"
          >
            <component :is="isCollapsed ? ChevronLeft : ChevronRight" :size="16" />
          </UiIconButton>
        </template>
      </UiPanelHeader>
    </template>

    <div class="flex-1 overflow-y-auto">
      <div v-if="!selectedNode" class="px-3 py-10 text-center text-editor-text-muted text-sm">
        No object selected
      </div>

      <div v-else class="p-4 space-y-5">
        <div>
          <label class="block text-xs text-editor-text-muted mb-2">Name</label>
          <UiInput
            :model-value="selectedNode.name"
            @update:model-value="v => scene.renameNode(selectedNode!.id, v)"
          />
        </div>

        <div class="flex items-center justify-between">
          <div class="text-xs text-editor-text-muted">Visible</div>
          <UiToggle
            :model-value="selectedNode.visible"
            aria-label="Toggle visibility"
            @update:model-value="v => (selectedNode!.visible = v)"
          />
        </div>

        <div class="h-px bg-editor-border/50" />

        <TransformEditor v-if="isMesh" />

        <div v-if="isMesh" class="h-px bg-editor-border/50" />

        <MaterialEditor v-if="isMesh" />
      </div>
    </div>
  </UiPanel>
</template>
