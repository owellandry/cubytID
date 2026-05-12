import type { SceneNode } from '../stores/sceneStore'
import { SceneGraph } from './SceneGraph'
import { AbstractMesh } from '@babylonjs/core/Meshes/abstractMesh'
import { Vector3 } from '@babylonjs/core/Maths/math.vector'
import { Light } from '@babylonjs/core/Lights/light'

export interface SerializedProject {
  version: 1
  name: string
  nodes: SerializedNode[]
}

export interface SerializedNode {
  id: string
  name: string
  type: SceneNode['type']
  parentId: string | null
  visible: boolean
  locked: boolean
  meshType?: string
  position?: [number, number, number]
  rotation?: [number, number, number]
  scaling?: [number, number, number]
  material?: {
    diffuseColor?: [number, number, number]
    emissiveColor?: [number, number, number]
    alpha?: number
    metallic?: number
    roughness?: number
  }
}

export class Serializer {
  static serialize(nodes: SceneNode[], sceneGraph: SceneGraph, projectName: string): SerializedProject {
    const serializedNodes: SerializedNode[] = nodes.map(node => {
      const sn: SerializedNode = {
        id: node.id,
        name: node.name,
        type: node.type,
        parentId: node.parentId,
        visible: node.visible,
        locked: node.locked,
      }

      const babylonNode = sceneGraph.getBabylonNode(node.id)
      if (babylonNode instanceof AbstractMesh) {
        sn.position = [babylonNode.position.x, babylonNode.position.y, babylonNode.position.z]
        sn.rotation = [babylonNode.rotation.x, babylonNode.rotation.y, babylonNode.rotation.z]
        sn.scaling = [babylonNode.scaling.x, babylonNode.scaling.y, babylonNode.scaling.z]
        sn.meshType = (babylonNode.metadata as any)?.primitiveType || 'custom'

        const mat = babylonNode.material as any
        if (mat) {
          sn.material = {}
          if (mat.diffuseColor) sn.material.diffuseColor = [mat.diffuseColor.r, mat.diffuseColor.g, mat.diffuseColor.b]
          if (mat.albedoColor) sn.material.diffuseColor = [mat.albedoColor.r, mat.albedoColor.g, mat.albedoColor.b]
          if (mat.alpha !== undefined) sn.material.alpha = mat.alpha
          if (mat.metallic !== undefined) sn.material.metallic = mat.metallic
          if (mat.roughness !== undefined) sn.material.roughness = mat.roughness
        }
      } else if (babylonNode instanceof Light) {
        const dir = (babylonNode as any).direction
        if (dir) sn.rotation = [dir.x, dir.y, dir.z]
        const pos = (babylonNode as any).position
        if (pos) sn.position = [pos.x, pos.y, pos.z]
      }

      return sn
    })

    return { version: 1, name: projectName, nodes: serializedNodes }
  }

  static toJSON(project: SerializedProject): string {
    return JSON.stringify(project, null, 2)
  }

  static fromJSON(json: string): SerializedProject {
    return JSON.parse(json) as SerializedProject
  }

  static download(project: SerializedProject) {
    const json = Serializer.toJSON(project)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${project.name}.cubytid`
    a.click()
    URL.revokeObjectURL(url)
  }
}
