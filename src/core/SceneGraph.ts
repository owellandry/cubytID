import { Scene } from '@babylonjs/core/scene'
import { AbstractMesh } from '@babylonjs/core/Meshes/abstractMesh'
import { Node } from '@babylonjs/core/node'
import { Light } from '@babylonjs/core/Lights/light'
import { Camera } from '@babylonjs/core/Cameras/camera'
import type { SceneNode } from '../stores/sceneStore'

export class SceneGraph {
  private scene: Scene
  private nodeMap: Map<string, Node> = new Map()

  constructor(scene: Scene) {
    this.scene = scene
  }

  registerNode(id: string, node: Node) {
    this.nodeMap.set(id, node)
  }

  unregisterNode(id: string) {
    this.nodeMap.delete(id)
  }

  getBabylonNode(id: string): Node | undefined {
    return this.nodeMap.get(id)
  }

  getMesh(id: string): AbstractMesh | undefined {
    const node = this.nodeMap.get(id)
    return node instanceof AbstractMesh ? node : undefined
  }

  findNodeIdByMesh(mesh: AbstractMesh): string | undefined {
    for (const [id, node] of this.nodeMap) {
      if (node === mesh) return id
    }
    return undefined
  }

  setParent(childId: string, parentId: string | null) {
    const child = this.nodeMap.get(childId)
    if (!child) return
    if (parentId) {
      const parent = this.nodeMap.get(parentId)
      if (parent) child.parent = parent
    } else {
      child.parent = null
    }
  }

  removeFromScene(id: string) {
    const node = this.nodeMap.get(id)
    if (node) {
      node.dispose()
      this.nodeMap.delete(id)
    }
  }

  duplicateNode(id: string, newId: string, newName: string): Node | null {
    const node = this.nodeMap.get(id)
    if (!node || !(node instanceof AbstractMesh)) return null
    const clone = node.clone(newName, node.parent)
    if (clone) {
      this.nodeMap.set(newId, clone)
      return clone
    }
    return null
  }

  getNodeType(node: Node): SceneNode['type'] {
    if (node instanceof AbstractMesh) return 'mesh'
    if (node instanceof Light) return 'light'
    if (node instanceof Camera) return 'camera'
    return 'group'
  }

  clear() {
    this.nodeMap.forEach(node => node.dispose())
    this.nodeMap.clear()
  }

  get allNodeIds(): string[] {
    return Array.from(this.nodeMap.keys())
  }
}
