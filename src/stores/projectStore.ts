import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useProjectStore = defineStore('project', () => {
  const projectName = ref('Untitled Project')
  const isDirty = ref(false)
  const projectPath = ref<string | null>(null)

  function setProjectName(name: string) {
    projectName.value = name
  }

  function markDirty() {
    isDirty.value = true
  }

  function markClean() {
    isDirty.value = false
  }

  return { projectName, isDirty, projectPath, setProjectName, markDirty, markClean }
})
