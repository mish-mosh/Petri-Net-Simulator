<script setup lang="ts">
import {useENS} from "@/state/use-ens"
import {ElNotification} from 'element-plus'
import {useGraph} from "@/state/use-vnet";
import {ref} from "vue";
import {
  CANVAS_TAB_NAME,
  DATA_TAB_NAME,
  FLOW_RELATION_TAB_NAME,
  PLACES_TAB_NAME,
  SIMULATION_TAB_NAME,
  TRANSITIONS_TAB_NAME
} from "@/consts";
import {exportENStoJSONBlob, loadENSFromJSONFile} from "@/json-adapter";
import {simMode, toggleSimMode} from "@/simulation";
import {activeTabName} from "@/state/use-control-bar";

const {
  selectedNodes,
  selectedPlaces,
  selectedTransitions,
  selectedFlowRelations,
  ens,
  addPlace,
  removeSelectedNodes,
  addTransition,
  addFlowRelation,
  removeSelectedFlowRelations,
  toggleTokenForSelectedPlaces,
} = useENS()


function beforeLeaveHandler(): boolean {
  // When simMode is on, this will prevent Switching to any other tab when clicking on nodes/edges
  return !simMode.value
}

function validateENS() {
  try {
    ens.value.validate();
    return ElNotification({
      title: 'Network Valid',
      message: 'The network is valid!',
      type: 'success',
    })
  } catch (e: any) {
    return ElNotification({
      title: 'Network not Valid',
      message: e,
      type: 'error',
    })
  }
}

/*
Import & export
 */
const fileInput = ref<HTMLInputElement>()
function triggerFileUpload() {
  fileInput.value?.click()
}

function loadFromJSON(event: Event): void {
  const ensJSONFile = (event.target as HTMLInputElement)?.files?.[0];
  if (ensJSONFile) {
    loadENSFromJSONFile(ensJSONFile);
  }
}

function exportJson() {
  const jsonBlob = exportENStoJSONBlob();
  const link = document.createElement('a')
  link.href = URL.createObjectURL(jsonBlob)
  link.download = "ens"
  link.click()
  URL.revokeObjectURL(link.href)
}

function exportSvg() {
  const graph = useGraph();
  if (!graph.value) return
  const text = graph.value?.getAsSvg()
  const url = URL.createObjectURL(new Blob([text], {type: "octet/stream"}))
  const a = document.createElement("a")
  a.href = url
  a.download = "network-graph.svg" // filename to download
  a.click()
  window.URL.revokeObjectURL(url)
}
</script>
<template #header>
  <el-tabs type="border-card" v-model="activeTabName" :before-leave="beforeLeaveHandler">
    <el-tab-pane label="Places" :name="PLACES_TAB_NAME" :disabled="simMode">
      <el-button type="primary" plain @click="addPlace">Add</el-button>
      <el-button type="primary" plain :disabled="selectedPlaces.length === 0"
                 @click="toggleTokenForSelectedPlaces">Toggle token
      </el-button>
      <el-button type="danger" plain :disabled="selectedPlaces.length === 0"
                 @click="removeSelectedNodes">Remove
      </el-button>
    </el-tab-pane>
    <el-tab-pane label="Transitions" :name="TRANSITIONS_TAB_NAME" :disabled="simMode">
      <el-button type="primary" plain @click="addTransition">Add</el-button>
      <el-button type="danger" plain :disabled="selectedTransitions.length === 0"
                 @click="removeSelectedNodes">Remove
      </el-button>
    </el-tab-pane>
    <el-tab-pane label="Flow Relations" :name="FLOW_RELATION_TAB_NAME" :disabled="simMode">
      <el-button type="primary" plain :disabled="selectedNodes.value.length !== 2"
                 @click="addFlowRelation">
        Add
      </el-button>
      <el-button type="danger" plain :disabled="selectedFlowRelations.value.length === 0"
                 @click="removeSelectedFlowRelations">
        Remove
      </el-button>
    </el-tab-pane>
    <el-tab-pane label="Simulation" :name="SIMULATION_TAB_NAME">
      <el-button type="primary" plain @click="validateENS">
        Validate network
      </el-button>
      <el-button type="primary" plain @click="toggleSimMode">
        Toggle Simulation mode
      </el-button>
    </el-tab-pane>
    <el-tab-pane label="Data" :name="DATA_TAB_NAME" :disabled="simMode">
      <el-button type="primary" plain @click="exportJson">
        Export as JSON
      </el-button>
      <el-button type="primary" plain @click="triggerFileUpload">Load from JSON</el-button>
      <input
          type="file"
          style="display: none"
          ref="fileInput"
          accept="application/json"
          @change="loadFromJSON"/>
    </el-tab-pane>
    <el-tab-pane label="Canvas" :name="CANVAS_TAB_NAME" :disabled="simMode">
      <el-button type="primary" plain @click="exportSvg">
        Export as SVG
      </el-button>
    </el-tab-pane>
  </el-tabs>
</template>
