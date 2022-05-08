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
// wrap with ref() for immediate response to value changes
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

function addNode() {
  const nodeId = `node${nextNodeIndex.value}`
  const name = `P${nextNodeIndex.value}`
  nodes[nodeId] = new Place(name)
  nextNodeIndex.value++
}

function getMarkedPlacePositions(): NodePositions {
  // Get the Positions of Places with token
  return Object.keys(layouts.nodes
  ).filter((nodeId: string) => {
    return nodes[nodeId] instanceof Place && nodes[nodeId].hasToken
  }).reduce((pos: NodePositions, nodeId: string) => {
    return Object.assign(pos, {[nodeId]: layouts.nodes[nodeId]})
  }, {})
}


</script>

<template>
  <div class="demo-control-panel">
    <div>
      <label>Node:</label>
      <button @click="addNode">add</button>
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