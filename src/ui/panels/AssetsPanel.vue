<script setup lang="ts">
import { ref } from 'vue'
import { FolderOpen, Upload, FileBox } from 'lucide-vue-next'
import { useSceneStore } from '../../stores/sceneStore'
import { useEditorStore } from '../../stores/editorStore'

const scene = useSceneStore()
const editor = useEditorStore()
const importedAssets = ref<string[]>([])
const isDragOver = ref(false)

function onDrop(e: DragEvent) {
  e.preventDefault()
  isDragOver.value = false
  if (!e.dataTransfer?.files.length) return
  handleFiles(e.dataTransfer.files)
}

function onDragOver(e: DragEvent) {
  e.preventDefault()
  isDragOver.value = true
}

function onDragLeave() {
  isDragOver.value = false
}

function openFileDialog() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.glb,.gltf,.obj,.fbx,.png,.jpg,.jpeg,.svg'
  input.multiple = true
  input.onchange = () => {
    if (input.files) handleFiles(input.files)
  }
  input.click()
}

async function handleFiles(files: FileList) {
  const engine = scene.engineInstance
  if (!engine) return

  for (const file of files) {
    const ext = file.name.split('.').pop()?.toLowerCase()
    if (['glb', 'gltf', 'obj', 'fbx'].includes(ext || '')) {
      try {
        editor.log(`Importing model: ${file.name}...`)
        const result = await engine.assetManager.importModel(file)
        result.meshes.forEach(mesh => {
          const id = mesh.uniqueId.toString()
          engine.sceneGraph.registerNode(id, mesh)
          scene.addNode({
            id,
            name: mesh.name || result.rootName,
            type: 'mesh',
            parentId: null,
            visible: true,
            locked: false,
          })
        })
        importedAssets.value.push(file.name)
        editor.log(`✓ Imported ${file.name}`, 'info')
      } catch (err) {
        editor.log(`✗ Failed to import ${file.name}: ${err}`, 'error')
      }
    } else {
      importedAssets.value.push(file.name)
      editor.log(`Added texture: ${file.name}`)
    }
  }
}
</script>

<template>
  <div class="flex flex-col h-full bg-editor-panel">
    <!-- Header -->
    <div class="h-7 flex items-center px-3 border-b border-editor-border text-xs font-semibold text-editor-text-secondary uppercase tracking-wider shrink-0">
      Assets
      <div class="flex-1" />
      <button @click="openFileDialog" class="p-0.5 text-editor-text-muted hover:text-editor-text" title="Import">
        <Upload :size="12" />
      </button>
    </div>

    <!-- Content -->
    <div
      class="flex-1 overflow-y-auto"
      @drop="onDrop"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
    >
      <!-- Drop zone when empty -->
      <div
        v-if="importedAssets.length === 0"
        class="px-3 py-8 text-center text-editor-text-muted text-xs"
        :class="isDragOver ? 'bg-editor-accent/10 ring-2 ring-editor-accent ring-inset rounded' : ''"
      >
        <FolderOpen :size="24" class="mx-auto mb-2 opacity-50" />
        <p>Drop 3D models or textures here<br>(.glb, .gltf, .obj, .png, .jpg)</p>
      </div>

      <!-- Asset list -->
      <div v-else class="p-1">
        <div
          v-for="asset in importedAssets"
          :key="asset"
          class="flex items-center gap-2 px-2 py-1 text-xs text-editor-text hover:bg-editor-hover rounded cursor-default"
        >
          <FileBox :size="14" class="text-editor-text-muted shrink-0" />
          <span class="truncate">{{ asset }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
