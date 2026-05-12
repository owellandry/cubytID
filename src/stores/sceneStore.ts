import { defineStore } from 'pinia'
import { ref, shallowRef, computed } from 'vue'
import type { Engine } from '../engine/Engine'
import type { PrimitiveType } from '../core/PrimitiveFactory'
import type { LightType } from '../engine/LightManager'
import { AbstractMesh } from '@babylonjs/core/Meshes/abstractMesh'
import { Light } from '@babylonjs/core/Lights/light'
import { Camera } from '@babylonjs/core/Cameras/camera'
import { Vector3 } from '@babylonjs/core/Maths/math.vector'
import { Serializer } from '../core/Serializer'
import { Project } from '../core/Project'

export interface SceneNode {
  id: string
  name: string
  type: 'mesh' | 'light' | 'camera' | 'group'
  parentId: string | null
  visible: boolean
  locked: boolean
}

export const useSceneStore = defineStore('scene', () => {
  const nodes = ref<SceneNode[]>([])
  const selectedNodeId = ref<string | null>(null)
  const engineInstance = shallowRef<Engine | null>(null)

  const selectedNode = computed(() => nodes.value.find(n => n.id === selectedNodeId.value))

  function addNode(node: SceneNode) {
    nodes.value.push(node)
  }

  function removeNode(id: string) {
    const engine = engineInstance.value
    if (engine) {
      engine.sceneGraph.removeFromScene(id)
    }
    nodes.value = nodes.value.filter(n => n.id !== id && n.parentId !== id)
    if (selectedNodeId.value === id) selectedNodeId.value = null
  }

  function selectNode(id: string | null) {
    selectedNodeId.value = id
    const engine = engineInstance.value
    if (!engine) return

    if (id) {
      const mesh = engine.sceneGraph.getMesh(id)
      if (mesh) {
        engine.selection.select(mesh)
        engine.gizmoManager.attachToMesh(mesh)
      } else {
        engine.gizmoManager.attachToMesh(null)
      }
    } else {
      engine.selection.deselect()
      engine.gizmoManager.attachToMesh(null)
    }
  }

  function getSelectedNode(): SceneNode | undefined {
    return nodes.value.find(n => n.id === selectedNodeId.value)
  }

  function getChildren(parentId: string | null): SceneNode[] {
    return nodes.value.filter(n => n.parentId === parentId)
  }

  function getRootNodes(): SceneNode[] {
    return nodes.value.filter(n => n.parentId === null)
  }

  // Primitives creation
  function createPrimitive(type: PrimitiveType) {
    const engine = engineInstance.value
    if (!engine) return

    const mesh = engine.primitiveFactory.createPrimitive(type)
    const id = mesh.uniqueId.toString()

    engine.sceneGraph.registerNode(id, mesh)
    addNode({
      id,
      name: mesh.name,
      type: 'mesh',
      parentId: null,
      visible: true,
      locked: false,
    })

    selectNode(id)
  }

  function createLight(type: LightType) {
    const engine = engineInstance.value
    if (!engine) return

    const light = engine.primitiveFactory.createLight(type)
    const id = light.uniqueId.toString()

    engine.sceneGraph.registerNode(id, light)
    addNode({
      id,
      name: light.name,
      type: 'light',
      parentId: null,
      visible: true,
      locked: false,
    })
  }

  function createCamera() {
    const engine = engineInstance.value
    if (!engine) return

    const camera = engine.primitiveFactory.createGameCamera()
    const id = camera.uniqueId.toString()

    engine.sceneGraph.registerNode(id, camera)
    addNode({
      id,
      name: camera.name,
      type: 'camera',
      parentId: null,
      visible: true,
      locked: false,
    })
  }

  function duplicateSelected() {
    const engine = engineInstance.value
    if (!engine || !selectedNodeId.value) return

    const original = getSelectedNode()
    if (!original) return

    const newId = `dup_${Date.now()}`
    const cloned = engine.sceneGraph.duplicateNode(selectedNodeId.value, newId, `${original.name} (Copy)`)
    if (cloned) {
      addNode({
        id: newId,
        name: cloned.name,
        type: original.type,
        parentId: original.parentId,
        visible: true,
        locked: false,
      })
      selectNode(newId)
    }
  }

  function deleteSelected() {
    if (!selectedNodeId.value) return
    removeNode(selectedNodeId.value)
  }

  function renameNode(id: string, newName: string) {
    const node = nodes.value.find(n => n.id === id)
    if (node) {
      node.name = newName
      const engine = engineInstance.value
      const bn = engine?.sceneGraph.getBabylonNode(id)
      if (bn) bn.name = newName
    }
  }

  function reparentNode(childId: string, newParentId: string | null) {
    const node = nodes.value.find(n => n.id === childId)
    if (node) {
      node.parentId = newParentId
      engineInstance.value?.sceneGraph.setParent(childId, newParentId)
    }
  }

  // Serialization
  function saveProject(projectName: string) {
    const engine = engineInstance.value
    if (!engine) return
    const data = Serializer.serialize(nodes.value, engine.sceneGraph, projectName)
    Serializer.download(data)
  }

  function getSerializedData(projectName: string) {
    const engine = engineInstance.value
    if (!engine) return null
    return Serializer.serialize(nodes.value, engine.sceneGraph, projectName)
  }

  // Get transform of selected mesh
  function getSelectedTransform() {
    const engine = engineInstance.value
    if (!engine || !selectedNodeId.value) return null
    const mesh = engine.sceneGraph.getMesh(selectedNodeId.value)
    if (!mesh) return null
    return {
      position: { x: mesh.position.x, y: mesh.position.y, z: mesh.position.z },
      rotation: {
        x: (mesh.rotation.x * 180) / Math.PI,
        y: (mesh.rotation.y * 180) / Math.PI,
        z: (mesh.rotation.z * 180) / Math.PI,
      },
      scaling: { x: mesh.scaling.x, y: mesh.scaling.y, z: mesh.scaling.z },
    }
  }

  function setSelectedPosition(axis: 'x' | 'y' | 'z', value: number) {
    const engine = engineInstance.value
    if (!engine || !selectedNodeId.value) return
    const mesh = engine.sceneGraph.getMesh(selectedNodeId.value)
    if (mesh) mesh.position[axis] = value
  }

  function setSelectedRotation(axis: 'x' | 'y' | 'z', valueDeg: number) {
    const engine = engineInstance.value
    if (!engine || !selectedNodeId.value) return
    const mesh = engine.sceneGraph.getMesh(selectedNodeId.value)
    if (mesh) mesh.rotation[axis] = (valueDeg * Math.PI) / 180
  }

  function setSelectedScaling(axis: 'x' | 'y' | 'z', value: number) {
    const engine = engineInstance.value
    if (!engine || !selectedNodeId.value) return
    const mesh = engine.sceneGraph.getMesh(selectedNodeId.value)
    if (mesh) mesh.scaling[axis] = value
  }

  // Clear scene
  function clearScene() {
    const engine = engineInstance.value
    if (engine) engine.sceneGraph.clear()
    nodes.value = []
    selectedNodeId.value = null
  }

  return {
    nodes, selectedNodeId, engineInstance, selectedNode,
    addNode, removeNode, selectNode, getSelectedNode, getChildren, getRootNodes,
    createPrimitive, createLight, createCamera,
    duplicateSelected, deleteSelected, renameNode, reparentNode,
    saveProject, getSerializedData, clearScene,
    getSelectedTransform, setSelectedPosition, setSelectedRotation, setSelectedScaling,
  }
})
