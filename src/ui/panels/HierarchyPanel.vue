<script setup lang="ts">
import { useSceneStore, type SceneNode } from '../../stores/sceneStore'
import { Eye, EyeOff, ChevronRight, ChevronDown, Trash2 } from 'lucide-vue-next'
import { ref } from 'vue'

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

function renderNodes(parentId: string | null, depth = 0): SceneNode[] {
  return scene.getChildren(parentId)
}
</script>

<template>
  <div class="flex flex-col h-full bg-editor-panel">
    <!-- Header -->
    <div class="h-7 flex items-center px-3 border-b border-editor-border text-xs font-semibold text-editor-text-secondary uppercase tracking-wider shrink-0">
      Hierarchy
      <div class="flex-1" />
      <button
        v-if="scene.selectedNodeId"
        @click="scene.deleteSelected()"
        class="p-0.5 text-editor-text-muted hover:text-editor-error"
        title="Delete selected"
      >
        <Trash2 :size="12" />
      </button>
    </div>

    <!-- Node list -->
    <div
      class="flex-1 overflow-y-auto py-1"
      @dragover.prevent
      @drop="onDropRoot"
    >
      <div
        v-if="scene.nodes.length === 0"
        class="px-3 py-8 text-center text-editor-text-muted text-xs"
      >
        Scene is empty.<br>Use <b>Add</b> in the toolbar.
      </div>

      <template v-for="node in scene.getChildren(null)" :key="node.id">
        <!-- Root node -->
        <div
          draggable="true"
          @dragstart="e => onDragStart(e, node.id)"
          @dragover="e => onDragOver(e, node.id)"
          @dragleave="onDragLeave"
          @drop.stop="e => onDrop(e, node.id)"
          @click="scene.selectNode(node.id)"
          class="flex items-center gap-1 px-2 py-0.5 cursor-pointer text-xs transition-colors group"
          :class="[
            scene.selectedNodeId === node.id
              ? 'bg-editor-accent/20 text-editor-accent'
              : 'text-editor-text hover:bg-editor-hover',
            dragOverNodeId === node.id ? 'ring-1 ring-editor-accent' : ''
          ]"
        >
          <button
            v-if="hasChildren(node.id)"
            @click.stop="toggleExpand(node.id)"
            class="p-0 text-editor-text-muted hover:text-editor-text"
          >
            <component :is="expandedNodes.has(node.id) ? ChevronDown : ChevronRight" :size="12" />
          </button>
          <span v-else class="w-3" />
          <span class="text-[10px] w-4 text-center">{{ getTypeIcon(node.type) }}</span>
          <span class="flex-1 truncate">{{ node.name }}</span>
          <button
            @click.stop="node.visible = !node.visible"
            class="p-0 opacity-0 group-hover:opacity-100 text-editor-text-muted hover:text-editor-text"
          >
            <component :is="node.visible ? Eye : EyeOff" :size="12" />
          </button>
        </div>

        <!-- Children -->
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
            class="flex items-center gap-1 px-2 py-0.5 cursor-pointer text-xs transition-colors group pl-6"
            :class="[
              scene.selectedNodeId === child.id
                ? 'bg-editor-accent/20 text-editor-accent'
                : 'text-editor-text hover:bg-editor-hover',
              dragOverNodeId === child.id ? 'ring-1 ring-editor-accent' : ''
            ]"
          >
            <span class="w-3" />
            <span class="text-[10px] w-4 text-center">{{ getTypeIcon(child.type) }}</span>
            <span class="flex-1 truncate">{{ child.name }}</span>
            <button
              @click.stop="child.visible = !child.visible"
              class="p-0 opacity-0 group-hover:opacity-100 text-editor-text-muted hover:text-editor-text"
            >
              <component :is="child.visible ? Eye : EyeOff" :size="12" />
            </button>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>
