<script setup lang="ts">
import {defineConfigs, Edge, Layers, VNetworkGraph} from "v-network-graph";
import {Place, Transition} from "@/types";
import {reactive} from "vue";
import {useENS} from "@/repository"

const {
  nodes,
  flowRelations,
  layouts,
  selectedNodes,
  selectedPlaces,
  selectedFlowRelations,
  markedPlacePositions,
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


// Configs
const configs = reactive(
    defineConfigs<Place | Transition, Edge>({
      node: {
        selectable: true,
        normal: {
          type: (node: Place | Transition) => node.shape,
          color: "#ffffff",
          strokeWidth: 2,
          strokeColor: "#000000"
        },
        hover: {
          color: "#2aadec"
        },
      },
      edge: {
        selectable: true,
        normal: {
          color: "#000000"
        },
        hover: {
          color: "#2aadec"
        },
        marker: {
          target: {
            type: "arrow"
          }
        }
      },
      view: {
        autoPanAndZoomOnLoad: "fit-content",
        grid: {
          visible: true
        }
      }
    })
)

</script>

<template>
  <el-card>
    <template #header>
      <el-row>
        <el-col :span="11">
          <label>
            Places & Transitions:
          </label>
          <el-button type="primary" plain @click="addPlace">Add place</el-button>
          <el-button type="primary" plain @click="addTransition">Add transition</el-button>
          <el-button type="primary" plain :disabled="selectedPlaces.length === 0"
                     @click="toggleTokenForSelectedPlaces">Toggle token
          </el-button>
          <el-button type="danger" plain :disabled="selectedNodes.value.length === 0"
                     @click="removeSelectedNodes">Remove
          </el-button>
        </el-col>
        <el-col :span="6">
          <label>
            Flow Relations:
          </label>
          <el-button type="primary" plain :disabled="selectedNodes.value.length !== 2"
                     @click="addFlowRelation">
            Add
          </el-button>
          <el-button type="danger" plain :disabled="selectedFlowRelations.value.length === 0"
                     @click="removeSelectedFlowRelations">
            Remove
          </el-button>
        </el-col>
      </el-row>
    </template>

    <v-network-graph
        v-model:selected-nodes="selectedNodes.value"
        v-model:selected-edges="selectedFlowRelations.value"
        :nodes="nodes"
        :edges="flowRelations"
        :configs="configs"
        :layers="layers"
        :layouts="layouts"
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