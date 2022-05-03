<script setup lang="ts">
import {defineConfigs, Edge, Edges, VNetworkGraph} from "v-network-graph";
import {Place, Places, Transition} from "@/model/petri-net";
import {reactive} from "vue";

const configs = reactive(
    defineConfigs<Place | Transition, Edge>({
      node: {
        normal: {
          type: node => node.shape
        }
      }
    })
)

const nodes: Places = {
  node1: new Place("P1"),
  node2: new Transition("T1"),
  node3: new Place("P2"),
}

const edges: Edges = {
  edge1: {source: "node1", target: "node2"},
  edge2: {source: "node2", target: "node3"},
}
</script>

<template>
  <v-network-graph :nodes="nodes" :edges="edges" :configs="configs"/>
</template>