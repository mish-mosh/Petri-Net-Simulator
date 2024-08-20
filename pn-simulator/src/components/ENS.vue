<script setup lang="ts">
import {Configs, VNetworkGraph} from "v-network-graph";
import {useENS} from "@/state/use-ens"
import {configs, eventHandlers, layers, useGraph} from "@/state/use-vnet";
import ControlBar from "@/components/ControlBar.vue";
import ExplanationBar from "@/components/ExplanationBar.vue";

const {
  nodes,
  layouts,
  selectedNodes,
  selectedFlowRelations,
  markedPlacePositions,
  ens,
} = useENS()

const graph = useGraph();

</script>

<template>
  <el-card>
    <control-bar/>
    <explanation-bar/>
    <v-network-graph
        ref="graph"
        v-model:selected-nodes="selectedNodes.value"
        v-model:selected-edges="selectedFlowRelations.value"
        :nodes="nodes"
        :edges="ens.flowRelations"
        :configs="(configs as Configs)"
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