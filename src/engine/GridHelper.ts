import { Scene } from '@babylonjs/core/scene'
import { Color3, Color4 } from '@babylonjs/core/Maths/math.color'
import { Vector3 } from '@babylonjs/core/Maths/math.vector'
import { CreateGround } from '@babylonjs/core/Meshes/Builders/groundBuilder'
import { CreateLines } from '@babylonjs/core/Meshes/Builders/linesBuilder'
import { GridMaterial } from '@babylonjs/materials/grid/gridMaterial'

export class GridHelper {
  constructor(scene: Scene) {
    const gridMaterial = new GridMaterial('gridMaterial', scene)
    gridMaterial.majorUnitFrequency = 5
    gridMaterial.minorUnitVisibility = 0.3
    gridMaterial.gridRatio = 1
    gridMaterial.backFaceCulling = false
    gridMaterial.mainColor = new Color3(0.15, 0.15, 0.22)
    gridMaterial.lineColor = new Color3(0.3, 0.3, 0.4)
    gridMaterial.opacity = 0.98

    const ground = CreateGround('editorGrid', { width: 100, height: 100, subdivisions: 1 }, scene)
    ground.material = gridMaterial
    ground.isPickable = false

    // Axis indicator lines
    this.createAxisLine(scene, new Vector3(50, 0.01, 0), new Color3(1, 0.3, 0.3))   // X - red
    this.createAxisLine(scene, new Vector3(0, 0.01, 50), new Color3(0.3, 0.5, 1))   // Z - blue
  }

  private createAxisLine(scene: Scene, end: Vector3, color: Color3) {
    const c4 = new Color4(color.r, color.g, color.b, 1)
    const line = CreateLines('axis', {
      points: [new Vector3(0, 0.01, 0), end],
      colors: [c4, c4],
    }, scene)
    line.isPickable = false
  }
}
