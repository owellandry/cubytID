import { Scene } from '@babylonjs/core/scene'
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder'
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial'
import { Color3 } from '@babylonjs/core/Maths/math.color'
import { AbstractMesh } from '@babylonjs/core/Meshes/abstractMesh'
import { FreeCamera } from '@babylonjs/core/Cameras/freeCamera'
import { Vector3 } from '@babylonjs/core/Maths/math.vector'
import { LightManager, type LightType } from '../engine/LightManager'

export type PrimitiveType = 'box' | 'sphere' | 'cylinder' | 'cone' | 'torus' | 'plane' | 'capsule'

let counter = 0
function nextId(prefix: string): string {
  return `${prefix}_${++counter}`
}

export class PrimitiveFactory {
  private scene: Scene
  private lightManager: LightManager

  constructor(scene: Scene) {
    this.scene = scene
    this.lightManager = new LightManager(scene)
  }

  createPrimitive(type: PrimitiveType, name?: string): AbstractMesh {
    const id = nextId(type)
    const meshName = name || `${type.charAt(0).toUpperCase() + type.slice(1)}`
    let mesh: AbstractMesh

    switch (type) {
      case 'box':
        mesh = MeshBuilder.CreateBox(id, { size: 1 }, this.scene)
        break
      case 'sphere':
        mesh = MeshBuilder.CreateSphere(id, { diameter: 1, segments: 24 }, this.scene)
        break
      case 'cylinder':
        mesh = MeshBuilder.CreateCylinder(id, { height: 2, diameter: 1, tessellation: 24 }, this.scene)
        break
      case 'cone':
        mesh = MeshBuilder.CreateCylinder(id, { height: 2, diameterTop: 0, diameterBottom: 1, tessellation: 24 }, this.scene)
        break
      case 'torus':
        mesh = MeshBuilder.CreateTorus(id, { diameter: 1, thickness: 0.3, tessellation: 24 }, this.scene)
        break
      case 'plane':
        mesh = MeshBuilder.CreateGround(id, { width: 2, height: 2 }, this.scene)
        break
      case 'capsule':
        mesh = MeshBuilder.CreateCapsule(id, { radius: 0.5, height: 2 }, this.scene)
        break
      default:
        mesh = MeshBuilder.CreateBox(id, { size: 1 }, this.scene)
    }

    mesh.name = meshName
    mesh.metadata = { primitiveType: type }

    // Default material
    const mat = new StandardMaterial(`${id}_mat`, this.scene)
    mat.diffuseColor = new Color3(0.7, 0.7, 0.7)
    mat.specularColor = new Color3(0.2, 0.2, 0.2)
    mesh.material = mat

    return mesh
  }

  createLight(type: LightType, name?: string) {
    const id = nextId(type)
    const lightName = name || `${type.charAt(0).toUpperCase() + type.slice(1)} Light`
    const light = this.lightManager.createLight(type, id)
    light.name = lightName
    return light
  }

  createGameCamera(name?: string): FreeCamera {
    const id = nextId('camera')
    const camName = name || 'Game Camera'
    const camera = new FreeCamera(id, new Vector3(0, 2, -5), this.scene)
    camera.name = camName
    camera.setTarget(Vector3.Zero())
    return camera
  }

  static getId() {
    return nextId('node')
  }
}
