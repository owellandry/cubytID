import { Scene } from '@babylonjs/core/scene'
import { Engine } from '@babylonjs/core/Engines/engine'
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight'
import { DirectionalLight } from '@babylonjs/core/Lights/directionalLight'
import { Vector3 } from '@babylonjs/core/Maths/math.vector'
import { Color4 } from '@babylonjs/core/Maths/math.color'

export class SceneManager {
  public scene: Scene

  constructor(engine: Engine) {
    this.scene = new Scene(engine)
    this.scene.clearColor = new Color4(0.12, 0.12, 0.18, 1)
    this.scene.ambientColor = new Color4(0.1, 0.1, 0.1, 1).toLinearSpace()

    // Ambient light
    const hemiLight = new HemisphericLight('hemiLight', new Vector3(0, 1, 0), this.scene)
    hemiLight.intensity = 0.6
    hemiLight.groundColor.set(0.2, 0.2, 0.25)

    // Directional light (sun)
    const dirLight = new DirectionalLight('dirLight', new Vector3(-1, -2, -1), this.scene)
    dirLight.position = new Vector3(10, 20, 10)
    dirLight.intensity = 0.8
  }
}
