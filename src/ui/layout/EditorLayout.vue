<script setup lang="ts">
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import Toolbar from './Toolbar.vue'
import StatusBar from './StatusBar.vue'
import ViewportPanel from '../panels/ViewportPanel.vue'
import HierarchyPanel from '../panels/HierarchyPanel.vue'
import InspectorPanel from '../panels/InspectorPanel.vue'
import BottomTabs from './BottomTabs.vue'
</script>

<template>
  <div class="flex flex-col w-full h-full bg-editor-bg">
    <Toolbar />

    <div class="flex-1 overflow-hidden p-3">
      <Splitpanes class="h-full !bg-transparent" :dbl-click-splitter="false">
        <Pane :size="18" :min-size="12" :max-size="28">
          <HierarchyPanel />
        </Pane>

        <Pane :size="64">
          <Splitpanes horizontal :dbl-click-splitter="false">
            <Pane :size="72" :min-size="50">
              <ViewportPanel />
            </Pane>
            <Pane :size="28" :min-size="16">
              <BottomTabs />
            </Pane>
          </Splitpanes>
        </Pane>

        <Pane :size="18" :min-size="12" :max-size="28">
          <InspectorPanel />
        </Pane>
      </Splitpanes>
    </div>

    <StatusBar />
  </div>
</template>
