<script setup lang="ts">
import { useSceneStore, type SceneNode } from '../../stores/sceneStore'
import { Eye, EyeOff, ChevronRight, ChevronDown, Trash2 } from 'lucide-vue-next'
import { ref } from 'vue'
import UiPanel from '../primitives/UiPanel.vue'
import UiPanelHeader from '../primitives/UiPanelHeader.vue'
import UiIconButton from '../primitives/UiIconButton.vue'

const scene = useSceneStore()
const expandedNodes = ref<Set<string>>(new Set())
const dragNodeId = ref<string | null>(null)
const dragOverNodeId = ref<string | null>(null)

function toggleExpand(id: string) {
  if (expandedNodes.value.has(id)) expandedNodes.value.delete(id)
  else expandedNodes.value.add(id)
}

function hasChildren(id: string): boolean {
  return scene.nodes.some(n => n.parentId === id)
}

function getTypeIcon(type: SceneNode['type']): string {
  switch (type) {
    case 'mesh': return '◆'
    case 'light': return '☀'
    case 'camera': return '📷'
    case 'group': return '📁'
    default: return '○'
  }
}

// Drag & drop for reparenting
function onDragStart(e: DragEvent, id: string) {
  dragNodeId.value = id
  e.dataTransfer!.effectAllowed = 'move'
}

function onDragOver(e: DragEvent, id: string) {
  e.preventDefault()
  dragOverNodeId.value = id
}

function onDragLeave() {
  dragOverNodeId.value = null
}

function onDrop(e: DragEvent, targetId: string | null) {
  e.preventDefault()
  if (dragNodeId.value && dragNodeId.value !== targetId) {
    scene.reparentNode(dragNodeId.value, targetId)
  }
  dragNodeId.value = null
  dragOverNodeId.value = null
}

function onDropRoot(e: DragEvent) {
  onDrop(e, null)
}
</script>

<template>
  <UiPanel>
    <template #header>
      <UiPanelHeader title="Hierarchy">
        <template #actions>
          <UiIconButton
            v-if="scene.selectedNodeId"
            title="Delete selected"
            @click="scene.deleteSelected()"
          >
            <Trash2 :size="16" />
          </UiIconButton>
        </template>
      </UiPanelHeader>
    </template>

    <div class="flex flex-col h-full">
      <div class="flex-1 overflow-y-auto py-2" @dragover.prevent @drop="onDropRoot">
        <div
          v-if="scene.nodes.length === 0"
          class="px-3 py-10 text-center text-editor-text-muted text-sm"
        >
          Scene is empty.<br>Use <b>Add</b> in the toolbar.
        </div>

        <template v-for="node in scene.getChildren(null)" :key="node.id">
          <div
            draggable="true"
            @dragstart="e => onDragStart(e, node.id)"
            @dragover="e => onDragOver(e, node.id)"
            @dragleave="onDragLeave"
            @drop.stop="e => onDrop(e, node.id)"
            @click="scene.selectNode(node.id)"
            class="flex items-center gap-2 px-3 py-2 cursor-pointer text-sm transition-colors group"
            :class="[
              scene.selectedNodeId === node.id
                ? 'bg-editor-accent/12 text-editor-text'
                : 'text-editor-text hover:bg-editor-hover',
              dragOverNodeId === node.id ? 'focus-visible:[box-shadow:var(--focus-ring)]' : ''
            ]"
          >
            <button
              v-if="hasChildren(node.id)"
              @click.stop="toggleExpand(node.id)"
              :aria-label="expandedNodes.has(node.id) ? 'Collapse' : 'Expand'"
              class="p-0 text-editor-text-muted hover:text-editor-text"
            >
              <component :is="expandedNodes.has(node.id) ? ChevronDown : ChevronRight" :size="14" />
            </button>
            <span v-else class="w-[14px]" />
            <span class="text-xs w-5 text-center text-editor-text-muted">{{ getTypeIcon(node.type) }}</span>
            <span class="flex-1 truncate">{{ node.name }}</span>
            <button
              @click.stop="node.visible = !node.visible"
              :aria-label="node.visible ? 'Hide' : 'Show'"
              class="p-0 opacity-0 group-hover:opacity-100 text-editor-text-muted hover:text-editor-text"
            >
              <component :is="node.visible ? Eye : EyeOff" :size="14" />
            </button>
          </div>

          <template v-if="expandedNodes.has(node.id)">
            <div
              v-for="child in scene.getChildren(node.id)"
              :key="child.id"
              draggable="true"
              @dragstart="e => onDragStart(e, child.id)"
              @dragover="e => onDragOver(e, child.id)"
              @dragleave="onDragLeave"
              @drop.stop="e => onDrop(e, child.id)"
              @click="scene.selectNode(child.id)"
              class="flex items-center gap-2 px-3 py-2 cursor-pointer text-sm transition-colors group pl-8"
              :class="[
                scene.selectedNodeId === child.id
                  ? 'bg-editor-accent/12 text-editor-text'
                  : 'text-editor-text hover:bg-editor-hover',
                dragOverNodeId === child.id ? 'focus-visible:[box-shadow:var(--focus-ring)]' : ''
              ]"
            >
              <span class="w-[14px]" />
              <span class="text-xs w-5 text-center text-editor-text-muted">{{ getTypeIcon(child.type) }}</span>
              <span class="flex-1 truncate">{{ child.name }}</span>
              <button
                @click.stop="child.visible = !child.visible"
                :aria-label="child.visible ? 'Hide' : 'Show'"
                class="p-0 opacity-0 group-hover:opacity-100 text-editor-text-muted hover:text-editor-text"
              >
                <component :is="child.visible ? Eye : EyeOff" :size="14" />
              </button>
            </div>
          </template>
        </template>
      </div>
    </div>
  </UiPanel>
</template>
