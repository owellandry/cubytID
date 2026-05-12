import { Serializer, type SerializedProject } from './Serializer'

export class Project {
  name: string
  path: string | null
  isDirty: boolean
  autoSaveInterval: ReturnType<typeof setInterval> | null = null

  constructor(name = 'Untitled Project') {
    this.name = name
    this.path = null
    this.isDirty = false
  }

  enableAutoSave(saveFn: () => void, intervalMs = 60000) {
    this.disableAutoSave()
    this.autoSaveInterval = setInterval(() => {
      if (this.isDirty) {
        saveFn()
        this.isDirty = false
      }
    }, intervalMs)
  }

  disableAutoSave() {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval)
      this.autoSaveInterval = null
    }
  }

  static async loadFromFile(): Promise<SerializedProject | null> {
    return new Promise((resolve) => {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = '.cubytid,.json'
      input.onchange = async () => {
        const file = input.files?.[0]
        if (!file) { resolve(null); return }
        const text = await file.text()
        try {
          resolve(Serializer.fromJSON(text))
        } catch {
          console.error('Failed to parse project file')
          resolve(null)
        }
      }
      input.click()
    })
  }
}
