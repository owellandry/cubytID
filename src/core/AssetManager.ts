import { Scene } from '@babylonjs/core/scene'
import { SceneLoader } from '@babylonjs/core/Loading/sceneLoader'
import '@babylonjs/loaders/glTF'
import { AbstractMesh } from '@babylonjs/core/Meshes/abstractMesh'

export interface ImportResult {
  meshes: AbstractMesh[]
  rootName: string
}

export class AssetManager {
  private scene: Scene
  private loadedAssets: Map<string, any> = new Map()

  constructor(scene: Scene) {
    this.scene = scene
  }

  async importModel(file: File): Promise<ImportResult> {
    const url = URL.createObjectURL(file)
    try {
      const result = await SceneLoader.ImportMeshAsync('', '', url, this.scene, undefined, file.name.endsWith('.glb') || file.name.endsWith('.gltf') ? '.glb' : undefined)
      const meshes = result.meshes.filter(m => m instanceof AbstractMesh) as AbstractMesh[]
      const rootName = file.name.replace(/\.[^.]+$/, '')
      this.loadedAssets.set(rootName, { meshes, file: file.name })
      URL.revokeObjectURL(url)
      return { meshes, rootName }
    } catch (e) {
      URL.revokeObjectURL(url)
      throw e
    }
  }

  async importModelFromUrl(url: string, name: string): Promise<ImportResult> {
    const result = await SceneLoader.ImportMeshAsync('', url, '', this.scene)
    const meshes = result.meshes.filter(m => m instanceof AbstractMesh) as AbstractMesh[]
    this.loadedAssets.set(name, { meshes, url })
    return { meshes, rootName: name }
  }

  getLoadedAssets(): string[] {
    return Array.from(this.loadedAssets.keys())
  }
}
