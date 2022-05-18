import {BaseNodes, FlowRelation, FlowRelations, Place, Transition} from "@/types";
import {reactive, ref} from "vue";
import data from "@/data/ens-default";
import {NodePositions} from "v-network-graph/lib/common/types";

// Initial data
const nodes: BaseNodes = reactive({...data.nodes})
const flowRelations: FlowRelations = reactive({...data.flowRelations})
const layouts = reactive(data.layouts)

// Additional states
const nextNodeIndex = ref(Object.keys(nodes).length + 1)
const nextFlowRelationIndex = ref(Object.keys(flowRelations).length + 1)
const selectedNodes = ref<string[]>([])
const selectedFlowRelations = ref<string[]>([])

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

export default {
    nodes,
    flowRelations,
    layouts,
    nextNodeIndex,
    nextFlowRelationIndex,
    selectedNodes,
    selectedFlowRelations,
    addPlace,
    removeSelectedNodes,
    addTransition,
    addFlowRelation,
    removeSelectedFlowRelations,
    getMarkedPlacePositions,
}