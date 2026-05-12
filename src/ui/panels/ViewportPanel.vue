<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { Engine } from '../../engine/Engine'
import { useSceneStore } from '../../stores/sceneStore'
import { useEditorStore } from '../../stores/editorStore'

const canvasRef = ref<HTMLCanvasElement | null>(null)
const containerRef = ref<HTMLDivElement | null>(null)
const sceneStore = useSceneStore()
const editorStore = useEditorStore()
let engine: Engine | null = null
let resizeObserver: ResizeObserver | null = null
let fpsInterval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  if (!canvasRef.value) return

  engine = new Engine(canvasRef.value)
  sceneStore.engineInstance = engine

  // Track FPS
  fpsInterval = setInterval(() => {
    if (engine) {
      editorStore.fps = Math.round(engine.scene.getEngine().getFps())
    }
  }, 500)

  // Auto-resize canvas when panel resizes
  resizeObserver = new ResizeObserver(() => {
    engine?.resize()
  })
  if (containerRef.value) {
    resizeObserver.observe(containerRef.value)
  }

  // Click to select objects
  canvasRef.value.addEventListener('pointerdown', onPointerDown)

  // Keyboard shortcuts
  window.addEventListener('keydown', onKeyDown)

  // Track history changes
  engine.history.onChange(() => {
    editorStore.canUndo = engine!.history.canUndo
    editorStore.canRedo = engine!.history.canRedo
  })
})

function onPointerDown(e: PointerEvent) {
  if (!engine || e.button !== 0) return
  // Only pick if select tool is active
  if (editorStore.activeTool !== 'select') return

  const mesh = engine.selection.pick(e.offsetX, e.offsetY)
  if (mesh) {
    const nodeId = engine.sceneGraph.findNodeIdByMesh(mesh)
    if (nodeId) sceneStore.selectNode(nodeId)
  } else {
    sceneStore.selectNode(null)
  }
}

function onKeyDown(e: KeyboardEvent) {
  if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
  // Delete key
  if (e.key === 'Delete' || e.key === 'Backspace') {
    sceneStore.deleteSelected()
  }
  // Ctrl+D duplicate
  if (e.key === 'd' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault()
    sceneStore.duplicateSelected()
  }
  // Ctrl+Z undo
  if (e.key === 'z' && (e.ctrlKey || e.metaKey) && !e.shiftKey) {
    e.preventDefault()
    engine?.history.undo()
  }
  // Ctrl+Shift+Z or Ctrl+Y redo
  if ((e.key === 'z' && (e.ctrlKey || e.metaKey) && e.shiftKey) || (e.key === 'y' && (e.ctrlKey || e.metaKey))) {
    e.preventDefault()
    engine?.history.redo()
  }
}

// Watch tool changes to update gizmos
watch(() => editorStore.activeTool, (tool) => {
  engine?.gizmoManager.setTool(tool)
})

// Watch space mode changes
watch(() => editorStore.isWorldSpace, (isWorld) => {
  engine?.gizmoManager.setWorldSpace(isWorld)
})

// Watch play mode
watch(() => editorStore.mode, (mode) => {
  if (mode === 'play') {
    engine?.startPlay()
    editorStore.log('Play mode started', 'info')
  } else {
    engine?.stopPlay()
    editorStore.log('Edit mode resumed', 'info')
  }
})

// Handle file drops for asset import
function onDrop(e: DragEvent) {
  e.preventDefault()
  if (!engine || !e.dataTransfer?.files.length) return
  const file = e.dataTransfer.files[0]
  importFile(file)
}

async function importFile(file: File) {
  if (!engine) return
  try {
    editorStore.log(`Importing ${file.name}...`)
    const result = await engine.assetManager.importModel(file)
    result.meshes.forEach(mesh => {
      const id = mesh.uniqueId.toString()
      engine!.sceneGraph.registerNode(id, mesh)
      sceneStore.addNode({
        id,
        name: mesh.name || result.rootName,
        type: 'mesh',
        parentId: null,
        visible: true,
        locked: false,
      })
    })
    editorStore.log(`Imported ${file.name} (${result.meshes.length} meshes)`, 'info')
  } catch (err) {
    editorStore.log(`Failed to import ${file.name}: ${err}`, 'error')
  }
}

function onDragOver(e: DragEvent) {
  e.preventDefault()
}

onBeforeUnmount(() => {
  if (fpsInterval) clearInterval(fpsInterval)
  resizeObserver?.disconnect()
  window.removeEventListener('keydown', onKeyDown)
  engine?.dispose()
  engine = null
})
</script>

<template>
  <div
    ref="containerRef"
    class="w-full h-full relative overflow-hidden bg-editor-bg"
    @drop="onDrop"
    @dragover="onDragOver"
  >
    <canvas ref="canvasRef" class="w-full h-full outline-none block" />
    <!-- Viewport overlay info -->
    <div class="absolute top-2 left-2 text-xs text-editor-text-muted pointer-events-none select-none">
      Perspective
    </div>
    <!-- Play mode indicator -->
    <div
      v-if="editorStore.mode === 'play'"
      class="absolute top-2 left-1/2 -translate-x-1/2 px-4 py-1 bg-editor-error/80 text-white text-xs font-bold rounded-full"
    >
      ▶ PLAY MODE
    </div>
  </div>
</template>
