import { Scene } from '@babylonjs/core/scene'
import { Vector3 } from '@babylonjs/core/Maths/math.vector'

export class PhysicsManager {
  private scene: Scene
  private enabled = false

  constructor(scene: Scene) {
    this.scene = scene
  }

  async initialize(): Promise<boolean> {
    // Physics will be enabled when @babylonjs/havok is installed
    // For now, physics runs as a placeholder
    console.info('Physics: install @babylonjs/havok to enable full physics simulation')
    this.enabled = false
    return false
  }

  get isEnabled() { return this.enabled }

  dispose() {}
}
