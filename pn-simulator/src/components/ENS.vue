<script setup lang="ts">
import {defineConfigs, Edge, Layers, VNetworkGraph} from "v-network-graph";
import {Place, Transition} from "@/types";
import {reactive} from "vue";
import * as repo from "@/repository"


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
        <el-col :span="4">
          <label>
            Places & Transitions:
          </label>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" plain @click="repo.addPlace">Add place</el-button>
          <el-button type="primary" plain @click="repo.addTransition">Add transition</el-button>
          <el-button type="danger" plain :disabled="repo.selectedNodes.value.length === 0"
                     @click="repo.removeSelectedNodes">Remove
          </el-button>
        </el-col>
        <el-col :span="4">
          <label>Flow Relations:</label>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" plain :disabled="repo.selectedNodes.value.length !== 2"
                     @click="repo.addFlowRelation">
            Add
          </el-button>
          <el-button type="danger" plain :disabled="repo.selectedFlowRelations.value.length === 0"
                     @click="repo.removeSelectedFlowRelations">
            Remove
          </el-button>
        </el-col>
      </el-row>
    </template>

    <v-network-graph
        v-model:selected-nodes="repo.selectedNodes.value"
        v-model:selected-edges="repo.selectedFlowRelations.value"
        :nodes="repo.nodes"
        :edges="repo.flowRelations"
        :configs="configs"
        :layers="layers"
        :layouts="repo.layouts"
    >
      <template #token="{scale}">
        <circle
            v-for="(pos, node) in repo.getMarkedPlacePositions()"
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