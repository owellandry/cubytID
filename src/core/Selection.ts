import { Scene } from '@babylonjs/core/scene'
import { AbstractMesh } from '@babylonjs/core/Meshes/abstractMesh'
import { HighlightLayer } from '@babylonjs/core/Layers/highlightLayer'
import { Color3 } from '@babylonjs/core/Maths/math.color'
import type { PickingInfo } from '@babylonjs/core/Collisions/pickingInfo'

export class Selection {
  private scene: Scene
  private highlightLayer: HighlightLayer
  private _selectedMesh: AbstractMesh | null = null
  private onSelectCallbacks: Array<(mesh: AbstractMesh | null) => void> = []

  constructor(scene: Scene) {
    this.scene = scene
    this.highlightLayer = new HighlightLayer('selectionHighlight', scene)
    this.highlightLayer.outerGlow = true
    this.highlightLayer.innerGlow = false
  }

  pick(x: number, y: number): AbstractMesh | null {
    const pick: PickingInfo = this.scene.pick(x, y, (mesh) => {
      return mesh.isPickable && mesh.name !== 'editorGrid' && !mesh.name.startsWith('axis')
    })
    if (pick.hit && pick.pickedMesh) {
      this.select(pick.pickedMesh as AbstractMesh)
      return pick.pickedMesh as AbstractMesh
    }
    this.deselect()
    return null
  }

  select(mesh: AbstractMesh | null) {
    this.deselect()
    if (mesh) {
      this._selectedMesh = mesh
      this.highlightLayer.addMesh(mesh as any, new Color3(0.54, 0.71, 0.98))
    }
    this.onSelectCallbacks.forEach(cb => cb(mesh))
  }

  deselect() {
    if (this._selectedMesh) {
      this.highlightLayer.removeMesh(this._selectedMesh as any)
      this._selectedMesh = null
    }
    this.onSelectCallbacks.forEach(cb => cb(null))
  }

  get selectedMesh(): AbstractMesh | null {
    return this._selectedMesh
  }

  onSelect(callback: (mesh: AbstractMesh | null) => void) {
    this.onSelectCallbacks.push(callback)
  }

  dispose() {
    this.highlightLayer.dispose()
  }
}
