export interface Command {
  execute(): void
  undo(): void
  description: string
}

export class History {
  private undoStack: Command[] = []
  private redoStack: Command[] = []
  private maxSize = 100
  private onChangeCallbacks: Array<() => void> = []

  execute(command: Command) {
    command.execute()
    this.undoStack.push(command)
    this.redoStack = []
    if (this.undoStack.length > this.maxSize) {
      this.undoStack.shift()
    }
    this.notifyChange()
  }

  undo(): Command | null {
    const command = this.undoStack.pop()
    if (command) {
      command.undo()
      this.redoStack.push(command)
      this.notifyChange()
      return command
    }
    return null
  }

  redo(): Command | null {
    const command = this.redoStack.pop()
    if (command) {
      command.execute()
      this.undoStack.push(command)
      this.notifyChange()
      return command
    }
    return null
  }

  get canUndo(): boolean { return this.undoStack.length > 0 }
  get canRedo(): boolean { return this.redoStack.length > 0 }
  get undoCount(): number { return this.undoStack.length }
  get redoCount(): number { return this.redoStack.length }

  onChange(callback: () => void) {
    this.onChangeCallbacks.push(callback)
  }

  private notifyChange() {
    this.onChangeCallbacks.forEach(cb => cb())
  }

  clear() {
    this.undoStack = []
    this.redoStack = []
    this.notifyChange()
  }
}

// Common commands

export class TransformCommand implements Command {
  description: string
  private target: any
  private property: string
  private oldValue: any
  private newValue: any
  constructor(
    target: any,
    property: string,
    oldValue: any,
    newValue: any,
  ) {
    this.target = target
    this.property = property
    this.oldValue = oldValue
    this.newValue = newValue
    this.description = `Change ${property}`
  }

  execute() {
    this.target[this.property] = this.newValue.clone ? this.newValue.clone() : this.newValue
  }

  undo() {
    this.target[this.property] = this.oldValue.clone ? this.oldValue.clone() : this.oldValue
  }
}

export class AddNodeCommand implements Command {
  description: string
  private addFn: () => void
  private removeFn: () => void
  constructor(
    addFn: () => void,
    removeFn: () => void,
    nodeName: string,
  ) {
    this.addFn = addFn
    this.removeFn = removeFn
    this.description = `Add ${nodeName}`
  }

  execute() { this.addFn() }
  undo() { this.removeFn() }
}

export class RemoveNodeCommand implements Command {
  description: string
  private addFn: () => void
  private removeFn: () => void
  constructor(
    addFn: () => void,
    removeFn: () => void,
    nodeName: string,
  ) {
    this.addFn = addFn
    this.removeFn = removeFn
    this.description = `Remove ${nodeName}`
  }

  execute() { this.removeFn() }
  undo() { this.addFn() }
}
