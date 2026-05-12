import { Scene } from '@babylonjs/core/scene'
import { DirectionalLight } from '@babylonjs/core/Lights/directionalLight'
import { PointLight } from '@babylonjs/core/Lights/pointLight'
import { SpotLight } from '@babylonjs/core/Lights/spotLight'
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight'
import { Vector3 } from '@babylonjs/core/Maths/math.vector'
import { Light } from '@babylonjs/core/Lights/light'

export type LightType = 'directional' | 'point' | 'spot' | 'hemispheric'

export class LightManager {
  private scene: Scene

  constructor(scene: Scene) {
    this.scene = scene
  }

  createLight(type: LightType, name: string): Light {
    switch (type) {
      case 'directional': {
        const l = new DirectionalLight(name, new Vector3(-1, -2, -1), this.scene)
        l.position = new Vector3(5, 10, 5)
        l.intensity = 0.7
        return l
      }
      case 'point': {
        const l = new PointLight(name, new Vector3(0, 5, 0), this.scene)
        l.intensity = 0.8
        l.range = 20
        return l
      }
      case 'spot': {
        const l = new SpotLight(name, new Vector3(0, 8, 0), new Vector3(0, -1, 0), Math.PI / 4, 2, this.scene)
        l.intensity = 0.8
        return l
      }
      case 'hemispheric': {
        const l = new HemisphericLight(name, new Vector3(0, 1, 0), this.scene)
        l.intensity = 0.6
        return l
      }
    }
  }
}
