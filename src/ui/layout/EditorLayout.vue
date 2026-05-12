<script setup lang="ts">
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import Toolbar from './Toolbar.vue'
import StatusBar from './StatusBar.vue'
import ViewportPanel from '../panels/ViewportPanel.vue'
import HierarchyPanel from '../panels/HierarchyPanel.vue'
import InspectorPanel from '../panels/InspectorPanel.vue'
import AssetsPanel from '../panels/AssetsPanel.vue'
import ConsolePanel from '../panels/ConsolePanel.vue'
</script>

<template>
  <div class="flex flex-col w-full h-full bg-editor-bg">
    <!-- Toolbar -->
    <Toolbar />

    <!-- Main Content -->
    <div class="flex-1 overflow-hidden">
      <Splitpanes class="h-full">
        <!-- Left Panel: Hierarchy -->
        <Pane :size="13" :min-size="8" :max-size="20">
          <HierarchyPanel />
        </Pane>

        <!-- Center: Viewport + Bottom panels -->
        <Pane :size="75">
          <Splitpanes horizontal>
            <Pane :size="78" :min-size="50">
              <ViewportPanel />
            </Pane>
            <Pane :size="22" :min-size="10">
              <Splitpanes>
                <Pane :size="50">
                  <AssetsPanel />
                </Pane>
                <Pane :size="50">
                  <ConsolePanel />
                </Pane>
              </Splitpanes>
            </Pane>
          </Splitpanes>
        </Pane>

        <!-- Right Panel: Inspector -->
        <Pane :size="12" :min-size="8" :max-size="20">
          <InspectorPanel />
        </Pane>
      </Splitpanes>
    </div>

    <!-- Status Bar -->
    <StatusBar />
  </div>
</template>
