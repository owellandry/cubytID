import { Scene } from '@babylonjs/core/scene'
import { GizmoManager as BabylonGizmoManager } from '@babylonjs/core/Gizmos/gizmoManager'
import { AbstractMesh } from '@babylonjs/core/Meshes/abstractMesh'
import type { EditorTool } from '../stores/editorStore'

export class EditorGizmoManager {
  private gizmoManager: BabylonGizmoManager

  constructor(scene: Scene) {
    this.gizmoManager = new BabylonGizmoManager(scene)
    this.gizmoManager.positionGizmoEnabled = false
    this.gizmoManager.rotationGizmoEnabled = false
    this.gizmoManager.scaleGizmoEnabled = false
    this.gizmoManager.boundingBoxGizmoEnabled = false
    this.gizmoManager.usePointerToAttachGizmos = false
  }

  setTool(tool: EditorTool) {
    this.gizmoManager.positionGizmoEnabled = tool === 'translate'
    this.gizmoManager.rotationGizmoEnabled = tool === 'rotate'
    this.gizmoManager.scaleGizmoEnabled = tool === 'scale'
  }

  attachToMesh(mesh: AbstractMesh | null) {
    this.gizmoManager.attachToMesh(mesh)
  }

  setWorldSpace(isWorld: boolean) {
    if (this.gizmoManager.gizmos.positionGizmo) {
      this.gizmoManager.gizmos.positionGizmo.updateGizmoRotationToMatchAttachedMesh = !isWorld
    }
    if (this.gizmoManager.gizmos.rotationGizmo) {
      this.gizmoManager.gizmos.rotationGizmo.updateGizmoRotationToMatchAttachedMesh = !isWorld
    }
  }

  dispose() {
    this.gizmoManager.dispose()
  }
}
