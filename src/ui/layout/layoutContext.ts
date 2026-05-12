import type { InjectionKey, Ref } from 'vue'

export type LayoutContext = {
  leftCollapsed: Ref<boolean>
  rightCollapsed: Ref<boolean>
  bottomCollapsed: Ref<boolean>
  toggleLeft: () => void
  toggleRight: () => void
  toggleBottom: () => void
}

export const layoutContextKey: InjectionKey<LayoutContext> = Symbol('layoutContext')

