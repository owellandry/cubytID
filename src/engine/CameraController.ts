import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera'
import { Vector3 } from '@babylonjs/core/Maths/math.vector'
import { Scene } from '@babylonjs/core/scene'

export class CameraController {
  public camera: ArcRotateCamera

  constructor(scene: Scene, canvas: HTMLCanvasElement) {
    this.camera = new ArcRotateCamera(
      'editorCamera',
      -Math.PI / 4,    // alpha
      Math.PI / 3,     // beta
      20,              // radius
      Vector3.Zero(),  // target
      scene
    )

    this.camera.lowerRadiusLimit = 1
    this.camera.upperRadiusLimit = 200
    this.camera.wheelDeltaPercentage = 0.01
    this.camera.panningSensibility = 50
    this.camera.minZ = 0.1
    this.camera.maxZ = 1000

    this.camera.attachControl(canvas, true)
  }

  focusOn(position: Vector3) {
    this.camera.setTarget(position)
  }

  reset() {
    this.camera.alpha = -Math.PI / 4
    this.camera.beta = Math.PI / 3
    this.camera.radius = 20
    this.camera.setTarget(Vector3.Zero())
  }
}
