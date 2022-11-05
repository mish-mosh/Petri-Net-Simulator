<script setup lang="ts">
import {EventHandlers, Layers, VNetworkGraph} from "v-network-graph";
import {Place, Transition} from "@/types";
import {useENS} from "@/repository"
import {ElNotification} from 'element-plus'
import {fireTransitionInENS, simMode, toggleSimMode} from "@/sim";
import {configs} from "@/vnet_configs";
import {ref} from "vue";

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

const activeTabName = ref('places')

function validate() {
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

function beforeLeaveHandler(): boolean {
  // When simMode is on, this will prevent Switching to the editor tabs when clicking on nodes/edges
  return !simMode.value
}

const eventHandlers: EventHandlers = {
  "node:click": ({node}) => {
    if (nodes.value[node] instanceof Transition) {
      fireTransitionInENS(ens.value, ens.value.transitions[node])
      activeTabName.value = "transitions"
    }
    if (nodes.value[node] instanceof Place) {
      activeTabName.value = "places"
    }
  },
  "node:select": ({node}) => {
    if (selectedPlaces.value.length == 1 && selectedTransitions.value.length == 1) {
      activeTabName.value = "flowRelations"
      return
    }
    if (nodes.value[node] instanceof Transition) {
      activeTabName.value = "transitions"
    }
    if (nodes.value[node] instanceof Place) {
      activeTabName.value = "places"
    }
  },
  "edge:select": () => {
    activeTabName.value = "flowRelations"
  }
}

</script>

<template>
  <el-card>
    <template #header>
      <el-tabs type="border-card" v-model="activeTabName" :before-leave="beforeLeaveHandler">
        <el-tab-pane label="Places" name="places" :disabled="simMode">
          <el-button type="primary" plain @click="addPlace">Add</el-button>
          <el-button type="primary" plain :disabled="selectedPlaces.length === 0"
                     @click="toggleTokenForSelectedPlaces">Toggle token
          </el-button>
          <el-button type="danger" plain :disabled="selectedPlaces.length === 0"
                     @click="removeSelectedNodes">Remove
          </el-button>
        </el-tab-pane>
        <el-tab-pane label="Transitions" name="transitions" :disabled="simMode">
          <el-button type="primary" plain @click="addTransition">Add</el-button>
          <el-button type="danger" plain :disabled="selectedTransitions.length === 0"
                     @click="removeSelectedNodes">Remove
          </el-button>
        </el-tab-pane>
        <el-tab-pane label="Flow Relations" name="flowRelations" :disabled="simMode">
          <el-button type="primary" plain :disabled="selectedNodes.value.length !== 2"
                     @click="addFlowRelation">
            Add
          </el-button>
          <el-button type="danger" plain :disabled="selectedFlowRelations.value.length === 0"
                     @click="removeSelectedFlowRelations">
            Remove
          </el-button>
        </el-tab-pane>
        <el-tab-pane label="Simulation" name="simulation">
          <el-button type="primary" plain @click="validate">
            Validate network
          </el-button>
          <el-button type="primary" plain @click="toggleSimMode">
            Toggle Simulation mode
          </el-button>
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