<script setup lang="ts">
import { ref } from 'vue'
import { Upload, Trash2 } from 'lucide-vue-next'
import UiPanel from '../primitives/UiPanel.vue'
import UiTabs, { type UiTabItem } from '../primitives/UiTabs.vue'
import UiIconButton from '../primitives/UiIconButton.vue'
import AssetsPanel from '../panels/AssetsPanel.vue'
import ConsolePanel from '../panels/ConsolePanel.vue'
import { useEditorStore } from '../../stores/editorStore'

type BottomTab = 'assets' | 'console'

const tabs: UiTabItem<BottomTab>[] = [
  { id: 'assets', label: 'Assets' },
  { id: 'console', label: 'Console' },
]

const active = ref<BottomTab>('assets')
const assetsRef = ref<any>(null)
const editor = useEditorStore()
</script>

<template>
  <UiPanel>
    <template #header>
      <div class="flex items-center bg-editor-surface border-b border-editor-border/70">
        <div class="flex-1">
          <UiTabs v-model="active" :items="tabs" />
        </div>
        <div class="pr-2 flex items-center gap-1">
          <UiIconButton
            v-if="active === 'assets'"
            title="Import"
            @click="assetsRef?.openFileDialog?.()"
          >
            <Upload :size="16" />
          </UiIconButton>
          <UiIconButton
            v-else
            title="Clear"
            @click="editor.consoleMessages = []"
          >
            <Trash2 :size="16" />
          </UiIconButton>
        </div>
      </div>
    </template>

    <div class="h-full">
      <AssetsPanel v-if="active === 'assets'" ref="assetsRef" />
      <ConsolePanel v-else />
    </div>
  </UiPanel>
</template>

