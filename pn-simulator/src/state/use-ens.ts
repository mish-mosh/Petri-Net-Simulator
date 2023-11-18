import {
    BaseNode,
    BaseNodes,
    Class,
    ENS,
    FlowRelation,
    FlowRelations,
    Place,
    Places,
    Transition,
    Transitions
} from "@/domain";
import {computed, reactive, ref} from "vue";
import data from "@/state/ens-default";
import {NodePositions} from "v-network-graph/lib/common/types";
import {filterRecordOnKeys} from "@/utils";

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
    selectedNodes.value.forEach((nodeId: string) => {
        delete nodes[nodeId]
        const flowRelationsToBeDeleted: FlowRelations = filterRecordOnKeys(
            flowRelations,
            (flId: string) => flowRelations[flId].source == nodeId || flowRelations[flId].target == nodeId
        )
        Object.keys(flowRelationsToBeDeleted).forEach((flId: string) => {
            delete flowRelations[flId]
        })
    })
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

function addFlowRelation(): void {
    if (selectedNodes.value.length !== 2) return
    const [source, target] = selectedNodes.value
    const relationId = `flowRelation${nextFlowRelationIndex.value}`
    flowRelations[relationId] = new FlowRelation(source, target)
    nextFlowRelationIndex.value++
}

function removeSelectedFlowRelations(): void {
    selectedFlowRelations.value.forEach((flId: string) => {
        delete flowRelations[flId]
    })
}

function getMarkedPlacePositions(): NodePositions {
    // Get the Positions of Places with token
    return filterRecordOnKeys(layouts.nodes, ((nodeId: string) => {
        return nodes[nodeId] instanceof Place && (nodes[nodeId] as Place).hasToken
    }))
}

function getSelectedPlaces(): string[] {
    return selectedNodes.value.filter((nodeId: string) => {
        return nodes[nodeId] instanceof Place
    })
}

function getSelectedTransitions(): string[] {
    return selectedNodes.value.filter((nodeId: string) => {
        return nodes[nodeId] instanceof Transition
    })
}

function toggleTokenForSelectedPlaces(): void {
    getSelectedPlaces().forEach((placeId: string) => {
        (nodes[placeId] as Place).hasToken = !(nodes[placeId] as Place).hasToken
    })
}

function filterNodesByClass<N extends BaseNode>(
    nodes: BaseNodes, TheClass: Class<N>
): Record<string, N> {
    return filterRecordOnKeys(nodes,
        (nodeId: string) => nodes[nodeId] instanceof TheClass
    )
}

const getPlaces: () => Places = () => filterNodesByClass(nodes, Place)
const getTransitions: () => Transitions = () => filterNodesByClass(nodes, Transition)

function loadENS(ens: ENS): void {
    const newNodes = Object.assign({}, ens.places, ens.transitions)
    const newFlowRelations = Object.assign({}, ens.flowRelations)
    Object.keys(nodes).forEach((nodeId: string) => {
        delete nodes[nodeId]
    })
    Object.keys(flowRelations).forEach((flId: string) => {
        delete flowRelations[flId]
    })
    Object.keys(newNodes).forEach((nodeID: string) => {
        addNode(nodeID, newNodes[nodeID])
    })
    Object.keys(newFlowRelations).forEach((flID: string) => {
        flowRelations[flID] = newFlowRelations[flID]
    })
}

export function useENS() {
    return {
        nodes: computed(() => nodes),
        layouts: computed(() => layouts),
        selectedNodes: computed(() => selectedNodes),
        selectedPlaces: computed(() => getSelectedPlaces()),
        selectedTransitions: computed(() => getSelectedTransitions()),
        selectedFlowRelations: computed(() => selectedFlowRelations),
        markedPlacePositions: computed(() => getMarkedPlacePositions()),
        ens: computed(() => {
            return new ENS(
                getPlaces(),
                getTransitions(),
                flowRelations,
            )
        }),
        addPlace,
        addTransition,
        removeSelectedNodes,
        addFlowRelation,
        removeSelectedFlowRelations,
        toggleTokenForSelectedPlaces,
        loadENS,
    }
}