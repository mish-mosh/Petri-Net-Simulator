<script setup lang="ts">
import {defineConfigs, Edge, EventHandlers, Layers, VNetworkGraph} from "v-network-graph";
import {ENS, Place, Transition} from "@/types";
import {reactive} from "vue";
import {useENS} from "@/repository"
import {ElNotification} from 'element-plus'
import {fireENS} from "@/sim";
import {cloneDeep} from "lodash"
import {ForceEdgeDatum, ForceLayout, ForceNodeDatum} from "v-network-graph/lib/force-layout"

const {
  nodes,
  places,
  transitions,
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
  loadENS,
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
        },
        layoutHandler: new ForceLayout({
          positionFixedByDrag: false,
          positionFixedByClickWithAltKey: true,
          // * The following are the default parameters for the simulation.
          // * You can customize it by uncommenting below.
          createSimulation: (d3, nodes, edges) => {
            const forceLink = d3.forceLink<ForceNodeDatum, ForceEdgeDatum>(edges).id(d => d.id)
            return d3
              .forceSimulation(nodes)
              .force("edge", forceLink.distance(1))
              .force("charge", d3.forceManyBody(1))
              .force("collide", d3.forceCollide(1).strength(0.2))
              .force("center", d3.forceCenter().strength(0.05))
              .alphaMin(0.001)
          }
        }),
      }
    }),
)


let backUpNet: ENS = cloneDeep(new ENS(
    places.value,
    transitions.value,
    flowRelations.value,
))

let simMode: boolean = false

function validate() {
  const pNet: ENS = new ENS(places.value, transitions.value, flowRelations.value);
  try {
    pNet.validate();
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

const eventHandlers: EventHandlers = {
      "node:click": ({node}) => {
        if (!simMode) {
          return
        }
        let currentNet: ENS = new ENS(places.value, transitions.value, flowRelations.value)
        if (nodes.value[node] instanceof Transition) {
          loadENS(fireENS(currentNet, nodes.value[node]))
        }

      }
    }

function toggleSimMode() {
  simMode = !simMode
  if (simMode) {
    configs.view.grid.visible = false
    configs.node.selectable = false
    backUpNet = cloneDeep(new ENS(
        places.value,
        transitions.value,
        flowRelations.value,
    ))
  } else {
    configs.view.grid.visible = true
    configs.node.selectable = true
    loadENS(backUpNet)
    delete eventHandlers["node:click"]
  }
}
</script>

<template>
  <el-card>
    <template #header>
      <el-row>
        <el-col :span="12">
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
        <el-col :span="6">
          <el-button type="primary" plain @click="validate">
            Validate
          </el-button>
          <el-button type="primary" plain @click="toggleSimMode">
            Simulate
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