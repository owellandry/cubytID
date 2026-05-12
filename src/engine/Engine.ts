import { Engine as BabylonEngine } from '@babylonjs/core/Engines/engine'
import { SceneManager } from './SceneManager'
import { CameraController } from './CameraController'
import { GridHelper } from './GridHelper'
import { EditorGizmoManager } from './GizmoManager'
import { PhysicsManager } from './PhysicsManager'
import { Selection } from '../core/Selection'
import { SceneGraph } from '../core/SceneGraph'
import { History } from '../core/History'
import { PrimitiveFactory } from '../core/PrimitiveFactory'
import { AssetManager } from '../core/AssetManager'

export class Engine {
  private babylonEngine: BabylonEngine
  private sceneManager: SceneManager
  private cameraController: CameraController
  private gridHelper: GridHelper

  public gizmoManager: EditorGizmoManager
  public physicsManager: PhysicsManager
  public selection: Selection
  public sceneGraph: SceneGraph
  public history: History
  public primitiveFactory: PrimitiveFactory
  public assetManager: AssetManager

  private _isPlaying = false

  constructor(canvas: HTMLCanvasElement) {
    this.babylonEngine = new BabylonEngine(canvas, true, {
      preserveDrawingBuffer: true,
      stencil: true,
      antialias: true,
    })

    this.sceneManager = new SceneManager(this.babylonEngine)
    this.cameraController = new CameraController(this.sceneManager.scene, canvas)
    this.gridHelper = new GridHelper(this.sceneManager.scene)
    this.gizmoManager = new EditorGizmoManager(this.sceneManager.scene)
    this.physicsManager = new PhysicsManager(this.sceneManager.scene)
    this.selection = new Selection(this.sceneManager.scene)
    this.sceneGraph = new SceneGraph(this.sceneManager.scene)
    this.history = new History()
    this.primitiveFactory = new PrimitiveFactory(this.sceneManager.scene)
    this.assetManager = new AssetManager(this.sceneManager.scene)

    this.babylonEngine.runRenderLoop(() => {
      this.sceneManager.scene.render()
    })
  }

  get scene() {
    return this.sceneManager.scene
  }

  get camera() {
    return this.cameraController
  }

  get isPlaying() {
    return this._isPlaying
  }

  startPlay() {
    this._isPlaying = true
  }

  stopPlay() {
    this._isPlaying = false
  }

  resize() {
    this.babylonEngine.resize()
  }

  dispose() {
    this.babylonEngine.stopRenderLoop()
    this.gizmoManager.dispose()
    this.selection.dispose()
    this.physicsManager.dispose()
    this.sceneManager.scene.dispose()
    this.babylonEngine.dispose()
  }
}
