<script setup lang="ts">
import { computed, provide, ref } from 'vue'
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import Toolbar from './Toolbar.vue'
import StatusBar from './StatusBar.vue'
import ViewportPanel from '../panels/ViewportPanel.vue'
import HierarchyPanel from '../panels/HierarchyPanel.vue'
import InspectorPanel from '../panels/InspectorPanel.vue'
import BottomTabs from './BottomTabs.vue'
import { layoutContextKey } from './layoutContext'

const leftCollapsed = ref(false)
const rightCollapsed = ref(false)
const bottomCollapsed = ref(false)

const leftSize = computed(() => (leftCollapsed.value ? 6 : 22))
const leftMin = computed(() => (leftCollapsed.value ? 6 : 14))
const leftMax = computed(() => (leftCollapsed.value ? 10 : 32))

const rightSize = computed(() => (rightCollapsed.value ? 6 : 14))
const rightMin = computed(() => (rightCollapsed.value ? 6 : 10))
const rightMax = computed(() => (rightCollapsed.value ? 10 : 22))

const centerSize = computed(() => Math.max(40, 100 - leftSize.value - rightSize.value))

const bottomSize = computed(() => (bottomCollapsed.value ? 12 : 22))
const viewportSize = computed(() => Math.max(55, 100 - bottomSize.value))

function toggleLeft() {
  leftCollapsed.value = !leftCollapsed.value
}

function toggleRight() {
  rightCollapsed.value = !rightCollapsed.value
}

function toggleBottom() {
  bottomCollapsed.value = !bottomCollapsed.value
}

provide(layoutContextKey, {
  leftCollapsed,
  rightCollapsed,
  bottomCollapsed,
  toggleLeft,
  toggleRight,
  toggleBottom,
})
</script>

<template>
  <div class="flex flex-col w-full h-full bg-editor-bg">
    <Toolbar />

    <div class="flex-1 overflow-hidden p-3">
      <Splitpanes
        :key="`${leftCollapsed}-${rightCollapsed}`"
        class="h-full !bg-transparent"
        :dbl-click-splitter="false"
      >
        <Pane :size="leftSize" :min-size="leftMin" :max-size="leftMax">
          <div class="h-full pr-2">
            <HierarchyPanel />
          </div>
        </Pane>

        <Pane :size="centerSize">
          <Splitpanes
            :key="`${bottomCollapsed}`"
            horizontal
            :dbl-click-splitter="false"
          >
            <Pane :size="viewportSize" :min-size="55">
              <div class="h-full pb-2">
                <ViewportPanel />
              </div>
            </Pane>
            <Pane :size="bottomSize" :min-size="12">
              <BottomTabs />
            </Pane>
          </Splitpanes>
        </Pane>

        <Pane :size="rightSize" :min-size="rightMin" :max-size="rightMax">
          <div class="h-full pl-2">
            <InspectorPanel />
          </div>
        </Pane>
      </Splitpanes>
    </div>

    <StatusBar />
  </div>
</template>
