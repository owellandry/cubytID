import { defineStore } from 'pinia'
import { ref } from 'vue'

export type EditorTool = 'select' | 'translate' | 'rotate' | 'scale'
export type EditorMode = 'edit' | 'play'

export const useEditorStore = defineStore('editor', () => {
  const activeTool = ref<EditorTool>('select')
  const mode = ref<EditorMode>('edit')
  const isWorldSpace = ref(true)
  const showGrid = ref(true)
  const fps = ref(0)
  const canUndo = ref(false)
  const canRedo = ref(false)
  const consoleMessages = ref<Array<{ type: 'info' | 'warn' | 'error'; message: string; timestamp: string }>>([
    { type: 'info', message: 'CubytID Engine Editor initialized', timestamp: new Date().toLocaleTimeString() },
  ])

  function setTool(tool: EditorTool) {
    activeTool.value = tool
  }

  function toggleSpace() {
    isWorldSpace.value = !isWorldSpace.value
  }

  function setMode(newMode: EditorMode) {
    mode.value = newMode
  }

  function log(message: string, type: 'info' | 'warn' | 'error' = 'info') {
    consoleMessages.value.push({ type, message, timestamp: new Date().toLocaleTimeString() })
    if (consoleMessages.value.length > 200) consoleMessages.value.shift()
  }

  return {
    activeTool, mode, isWorldSpace, showGrid, fps,
    canUndo, canRedo, consoleMessages,
    setTool, toggleSpace, setMode, log,
  }
})
