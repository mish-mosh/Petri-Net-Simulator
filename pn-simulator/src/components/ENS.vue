<script setup lang="ts">
import {EventHandlers, Layers, VNetworkGraph, VNetworkGraphInstance} from "v-network-graph";
import {Place, Transition} from "@/types";
import {useENS} from "@/repository"
import {ElNotification} from 'element-plus'
import {fireTransitionInENS, simMode, toggleSimMode} from "@/sim";
import {configs} from "@/vnet_configs";
import {ref} from "vue";
import {
  FLOW_RELATION_TAB_NAME,
  IMPORT_EXPORT_TAB_NAME,
  PLACES_TAB_NAME,
  SIMULATION_TAB_NAME,
  TRANSITIONS_TAB_NAME
} from "@/consts";
import {exportENStoJSONBlob, loadENSFromJSONFile} from "@/JSONAdapter";

const {
  nodes,
  layouts,
  selectedNodes,
  selectedPlaces,
  selectedTransitions,
  selectedFlowRelations,
  markedPlacePositions,
  ens,
  addPlace,
  removeSelectedNodes,
  addTransition,
  addFlowRelation,
  removeSelectedFlowRelations,
  toggleTokenForSelectedPlaces,
} = useENS()


// Additional layers
const layers: Layers = {
  // The token display layer
  token: "nodes",
}

const activeTabName = ref(PLACES_TAB_NAME)

const fileInput = ref<HTMLInputElement>()

/*
Event handlers
 */

const eventHandlers: EventHandlers = {
  "node:click": ({node}) => {
    if (nodes.value[node] instanceof Transition) {
      fireTransitionInENS(ens.value, ens.value.transitions[node])
      activeTabName.value = TRANSITIONS_TAB_NAME
    }
    if (nodes.value[node] instanceof Place) {
      activeTabName.value = PLACES_TAB_NAME
    }
  },
  "node:select": ({node}) => {
    if (selectedPlaces.value.length == 1 && selectedTransitions.value.length == 1) {
      activeTabName.value = FLOW_RELATION_TAB_NAME
      return
    }
    if (nodes.value[node] instanceof Transition) {
      activeTabName.value = TRANSITIONS_TAB_NAME
    }
    if (nodes.value[node] instanceof Place) {
      activeTabName.value = PLACES_TAB_NAME
    }
  },
  "edge:select": () => {
    activeTabName.value = FLOW_RELATION_TAB_NAME
  }
}

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

function triggerFileUpload() {
  fileInput.value?.click()
}

function loadFromJSON(event: Event): void {
  const ensJSONFile = event.target?.files[0]
  loadENSFromJSONFile(ensJSONFile);
}

function exportJson() {
  const jsonBlob = exportENStoJSONBlob();
  const link = document.createElement('a')
  link.href = URL.createObjectURL(jsonBlob)
  link.download = "ens"
  link.click()
  URL.revokeObjectURL(link.href)
}

// Export as SVG
const graph = ref<VNetworkGraphInstance>()

function exportSvg() {
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

<template>
  <el-card>
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
        <el-tab-pane label="Import/Export" :name="IMPORT_EXPORT_TAB_NAME" :disabled="simMode">
          <el-button type="primary" plain @click="exportSvg">
            Export network as SVG
          </el-button>
          <el-button type="primary" plain @click="exportJson">
            Export network as JSON
          </el-button>
          <el-button type="primary" plain @click="triggerFileUpload">Load from JSON</el-button>
          <input
              type="file"
              style="display: none"
              ref="fileInput"
              accept="application/json"
              @change="loadFromJSON"/>
        </el-tab-pane>
      </el-tabs>
    </template>
    <el-alert v-if="simMode" title="Simulation mode"
              type="info" :closable="false">
      Click on any active (green) transition to make it fire.
    </el-alert>
    <el-alert v-if="!simMode" title="Edit mode"
              type="info" :closable="false">
      Edit the network or its places, transitions and flow relations.
    </el-alert>
    <v-network-graph
        ref="graph"
        v-model:selected-nodes="selectedNodes.value"
        v-model:selected-edges="selectedFlowRelations.value"
        :nodes="nodes"
        :edges="ens.flowRelations"
        :configs="configs"
        :layers="layers"
        :layouts="layouts"
        :event-handlers="eventHandlers"
    >
      <template #token="{scale}">
        <circle
            v-for="(pos, node) in markedPlacePositions"
            :key="node"
            :cx="pos.x"
            :cy="pos.y"
            :r="5 * scale"
            :fill="'#000000'"
            style="pointer-events: none"
        />
      </template>
    </v-network-graph>
  </el-card>
</template>

<style lang="css">
.v-canvas {
  width: 100%;
}
</style>