<script setup lang="ts">
import {defineConfigs, Edge, Edges, Layers, Nodes, VNetworkGraph} from "v-network-graph";
import {Place, Transition} from "@/model/petri-net";
import {reactive, ref} from "vue";
import {NodePositions} from "v-network-graph/lib/common/types";
import data from "@/data/ENS";

// Initial data

const nodes: Nodes = reactive({...data.nodes})
const edges: Edges = reactive({...data.edges})
// wrap with ref() for immediate response to value changes
const layouts = ref(data.layouts)

// Additional layers
const layers: Layers = {
  // The token display layer
  token: "nodes",
}

const configs = reactive(
    defineConfigs<Place | Transition, Edge>({
      node: {
        normal: {
          type: node => node.shape
        }
      }
    })
)


function getMarkedPlacePositions(): NodePositions {
  // Get the Positions of Places with token
  return Object.keys(layouts.value.nodes
  ).filter((nodeID: string) => {
    return nodes[nodeID] instanceof Place && nodes[nodeID].hasToken
  }).reduce((pos: NodePositions, nodeID: string) => {
    return Object.assign(pos, {[nodeID]: layouts.value.nodes[nodeID]})
  }, {})
}
</script>

<template>

  <v-network-graph
      :nodes="nodes"
      :edges="edges"
      :configs="configs"
      :layers="layers"
      :layouts="layouts"
  >
    <template #token>
      <circle
          v-for="(pos, node) in getMarkedPlacePositions()"
          :key="node"
          :cx="pos.x"
          :cy="pos.y"
          :r="5"
          :fill="'#00cc00'"
          style="pointer-events: none"
      />
    </template>
  </v-network-graph>
</template>