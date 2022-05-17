<script setup lang="ts">
import {defineConfigs, Edge, Layers, VNetworkGraph} from "v-network-graph";
import {BaseNodes, FlowRelation, FlowRelations, Place, Transition} from "@/types";
import {reactive, ref} from "vue";
import {NodePositions} from "v-network-graph/lib/common/types";
import data from "@/data/ens-default";

// Initial data

const nodes: BaseNodes = reactive({...data.nodes})
const flowRelations: FlowRelations = reactive({...data.flowRelations})
const layouts = reactive(data.layouts)

// Additional states
const nextNodeIndex = ref(Object.keys(nodes).length + 1)
const nextFlowRelationIndex = ref(Object.keys(flowRelations).length + 1)
const selectedNodes = ref<string[]>([])
const selectedFlowRelations = ref<string[]>([])

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

function addNode(nodeId: string, node: Place | Transition): void {
  nodes[nodeId] = node
  nextNodeIndex.value++
}

function removeSelectedNodes(): void {
  for (const nodeID of selectedNodes.value) {
    delete nodes[nodeID]
  }
}

function addPlace(): void {
  const nodeId = `place${nextNodeIndex.value}`
  const name = `p${nextNodeIndex.value}`
  addNode(nodeId, new Place(name))
}

function addTransition(): void {
  const nodeId = `transition${nextNodeIndex.value}`
  const name = `t${nextNodeIndex.value}`
  addNode(nodeId, new Transition(name))
}

function addFlowRelation() {
  if (selectedNodes.value.length !== 2) return
  const [source, target] = selectedNodes.value
  const relationId = `flowRelation${nextFlowRelationIndex.value}`
  flowRelations[relationId] = new FlowRelation(source, target)
  nextFlowRelationIndex.value++
}

function removeSelectedFlowRelations() {
  for (const flowRelationId of selectedFlowRelations.value) {
    delete flowRelations[flowRelationId]
  }
}

function getMarkedPlacePositions(): NodePositions {
  // Get the Positions of Places with token
  return Object.keys(layouts.nodes
  ).filter((nodeId: string) => {
    return nodes[nodeId] instanceof Place && (nodes[nodeId] as Place).hasToken
  }).reduce((pos: NodePositions, nodeId: string) => {
    return Object.assign(pos, {[nodeId]: layouts.nodes[nodeId]})
  }, {})
}


</script>

<template>
  <div class="demo-control-panel">
    <div>
      <label>Places & Transitions:</label>
      <button @click="addPlace">add place</button>
      <button @click="addTransition">add transition</button>
      <button @click="removeSelectedNodes">remove selected</button>
    </div>
    <div>
      <label>Flow Relation:</label>
      <button :disabled="selectedNodes.length !== 2" @click="addFlowRelation">add</button>
      <button @click="removeSelectedFlowRelations">remove selected</button>
    </div>
  </div>

  <v-network-graph
      v-model:selected-nodes="selectedNodes"
      v-model:selected-edges="selectedFlowRelations"
      :nodes="nodes"
      :edges="flowRelations"
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