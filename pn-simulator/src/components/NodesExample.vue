<script setup lang="ts">
import {defineConfigs, Edge, Edges, Layers, Layouts, Nodes, VNetworkGraph} from "v-network-graph";
import {Place, Transition} from "@/model/petri-net";
import {reactive, ref} from "vue";
import {NodePositions} from "v-network-graph/lib/common/types";

const configs = reactive(
    defineConfigs<Place | Transition, Edge>({
      node: {
        normal: {
          type: node => node.shape
        }
      }
    })
)

const nodes: Nodes = {
  node1: new Place("P1", true),
  node2: new Transition("T1"),
  node3: new Place("P2", false),
}

const edges: Edges = {
  edge1: {source: "node1", target: "node2"},
  edge2: {source: "node2", target: "node3"},
}

const layers: Layers = {
  // {layername}: {position}
  badge: "nodes",
}
const layouts: Layouts = ref({
  nodes: {
    node1: {x: 0, y: 0},
    node2: {x: 80, y: 80},
    node3: {x: 160, y: 0},
  },
})

function getPlacePositions(): NodePositions {
  return Object.keys(layouts.value.nodes
  ).filter((nodeID) => {
    return nodes[nodeID] instanceof Place && nodes[nodeID].hasToken
  }).reduce((pos, nodeID) => {
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
    <template #badge="{scale}">
      <circle
          v-for="(pos, node) in getPlacePositions()"
          :key="node"
          :cx="pos.x + scale"
          :cy="pos.y - scale"
          :r="5 * scale"
          :fill="'#00cc00'"
          style="pointer-events: none"
      />
    </template>
  </v-network-graph>
</template>