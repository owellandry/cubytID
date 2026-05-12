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
        <Pane :size="22" :min-size="14" :max-size="32">
          <div class="h-full pr-2">
            <HierarchyPanel />
          </div>
        </Pane>

        <Pane :size="64">
          <Splitpanes horizontal :dbl-click-splitter="false">
            <Pane :size="78" :min-size="55">
              <div class="h-full pb-2">
                <ViewportPanel />
              </div>
            </Pane>
            <Pane :size="22" :min-size="14">
              <BottomTabs />
            </Pane>
          </Splitpanes>
        </Pane>

        <Pane :size="14" :min-size="10" :max-size="22">
          <div class="h-full pl-2">
            <InspectorPanel />
          </div>
        </Pane>
      </Splitpanes>
    </div>

    <StatusBar />
  </div>
</template>
