<script setup lang="ts">
import { ref } from 'vue'
import { FolderOpen, FileBox } from 'lucide-vue-next'
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

defineExpose({ openFileDialog })
</script>

<template>
  <div
    class="h-full overflow-y-auto"
    @drop="onDrop"
    @dragover="onDragOver"
    @dragleave="onDragLeave"
  >
    <div
      v-if="importedAssets.length === 0"
      class="px-4 py-10 text-center text-editor-text-muted text-sm"
      :class="isDragOver ? 'bg-editor-accent/10 focus-visible:[box-shadow:var(--focus-ring)] rounded-[var(--radius-2)]' : ''"
    >
      <FolderOpen :size="26" class="mx-auto mb-3 opacity-60" />
      <p>Drop 3D models or textures here<br>(.glb, .gltf, .obj, .png, .jpg)</p>
    </div>

    <div v-else class="p-2">
      <div
        v-for="asset in importedAssets"
        :key="asset"
        class="flex items-center gap-2 px-3 py-2 text-sm text-editor-text hover:bg-editor-hover rounded-[var(--radius-1)] cursor-default"
      >
        <FileBox :size="16" class="text-editor-text-muted shrink-0" />
        <span class="truncate">{{ asset }}</span>
      </div>
    </div>
  </div>
</template>
