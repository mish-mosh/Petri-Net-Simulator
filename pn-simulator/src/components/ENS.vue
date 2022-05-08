<script setup lang="ts">
import {defineConfigs, Edge, Edges, Layers, VNetworkGraph} from "v-network-graph";
import {Place, Places, Transition, Transitions} from "@/types";
import {reactive, ref} from "vue";
import {NodePositions} from "v-network-graph/lib/common/types";
import data from "@/data/ens-default";

// Initial data

const nodes: Places | Transitions = reactive({...data.nodes})
const edges: Edges = reactive({...data.edges})
const nextNodeIndex = ref(Object.keys(nodes).length + 1)
const layouts = reactive(data.layouts)

// Additional layers
const layers: Layers = {
  // The token display layer
  token: "nodes",
}

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
      },
      view: {
        grid: {
          visible: true
        }
      }
    })
)

function addNode(nodeKey: string, node: Place | Transition): void {
  nodes[nodeKey] = node
  nextNodeIndex.value++
}

function addPlace() {
  const nodeKey = `place${nextNodeIndex.value}`
  const name = `p${nextNodeIndex.value}`
  addNode(nodeKey, new Place(name))
}

function addTransition() {
  const nodeKey = `transition${nextNodeIndex.value}`
  const name = `t${nextNodeIndex.value}`
  addNode(nodeKey, new Transition(name))
}

function getMarkedPlacePositions(): NodePositions {
  // Get the Positions of Places with token
  return Object.keys(layouts.nodes
  ).filter((nodeKey: string) => {
    return nodes[nodeKey] instanceof Place && nodes[nodeKey].hasToken
  }).reduce((pos: NodePositions, nodeKey: string) => {
    return Object.assign(pos, {[nodeKey]: layouts.nodes[nodeKey]})
  }, {})
}


</script>

<template>
  <div class="demo-control-panel">
    <div>
      <label>Place:</label>
      <button @click="addPlace">add</button>
      <label>Transition:</label>
      <button @click="addTransition">add</button>
    </div>
  </div>

  <v-network-graph
      :nodes="nodes"
      :edges="edges"
      :configs="configs"
      :layers="layers"
      :layouts="layouts"
  >
    <template #token="{scale}">
      <circle
          v-for="(pos, node) in getMarkedPlacePositions()"
          :key="node"
          :cx="pos.x"
          :cy="pos.y"
          :r="5 * scale"
          :fill="'#000000'"
          style="pointer-events: none"
      />
    </template>
  </v-network-graph>
</template>