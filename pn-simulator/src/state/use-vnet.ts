import {defineConfigs, Edge, EventHandlers, Layers, VNetworkGraphInstance} from "v-network-graph";
import {Place, Transition} from "@/domain";
import {ForceEdgeDatum, ForceLayout, ForceNodeDatum} from "v-network-graph/lib/force-layout";
import {useENS} from "@/state/use-ens";
import {computed, reactive, ref, watch} from "vue";
import {fireTransitionInENS, simMode} from "@/simulation";
import {FLOW_RELATION_TAB_NAME, PLACES_TAB_NAME, TRANSITIONS_TAB_NAME} from "@/consts";
import {activeTabName} from "@/state/use-controll-bar";

const {
    ens,
    nodes,
    selectedPlaces,
    selectedTransitions,
} = useENS()

export const configs =
    reactive(defineConfigs<Place | Transition, Edge>({
            node: {
                selectable: true,
                normal: {
                    type: (node: Place | Transition) => node.shape,
                    color: (node: Place | Transition) => {
                        if (!simMode.value) {
                            return "#ffffff"
                        }
                        if (node instanceof Transition) {
                            if (ens.value.transitionIsActive(node)) {
                                return "#07ff8f"
                            } else {
                                return "#f56c6c"
                            }
                        }
                        return "#ffffff"
                    },
                    strokeWidth: 2,
                    strokeColor: "#000000",
                },
                hover: {
                    color: "#2aadec"
                },
            },
            edge: {
                selectable: true,
                normal: {
                    color: "#000000",
                    width: 3,
                },
                hover: {
                    color: "#2aadec",
                    width: 5,
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
                    visible: false,
                },
                layoutHandler: new ForceLayout({
                    positionFixedByDrag: false,
                    positionFixedByClickWithAltKey: true,
                    createSimulation: (d3, nodes, edges) => {
                        const forceLink = d3.forceLink<ForceNodeDatum, ForceEdgeDatum>(edges).id((d: any) => d.id)
                        return d3
                            .forceSimulation(nodes)
                            .force("edge", forceLink.distance(1))
                            .force("charge", d3.forceManyBody())
                            .force("collide", d3.forceCollide(1).strength(0.2))
                            .force("center", d3.forceCenter().strength(0.05))
                            .alphaMin(0.001)
                    }
                }),
            }
        })
    )

const graph = ref<VNetworkGraphInstance>()
export const useGraph = () => graph

// Additional layers
export const layers: Layers = {
    // The token display layer
    token: "nodes",
}

/*
Event handlers
 */

export const eventHandlers: EventHandlers = {
    "node:click": ({node}) => {
        if (nodes.value[node] instanceof Transition) {
            fireTransitionInENS(ens.value, ens.value.transitions[node])
            activeTabName.value = TRANSITIONS_TAB_NAME
        }
        if (nodes.value[node] instanceof Place) {
            activeTabName.value = PLACES_TAB_NAME
        }
    },
// @ts-ignore
    "node:select": ({node}) => {
        if (selectedPlaces.value.length == 1 && selectedTransitions.value.length == 1) {
            activeTabName.value = FLOW_RELATION_TAB_NAME
            return
        }
        if (nodes.value[node] instanceof Transition) {
            activeTabName.value = TRANSITIONS_TAB_NAME
        }
        if (nodes.value[node] instanceof Place) {
            activeTabName.value = PLACES_TAB_NAME
        }
    },
    "edge:select": () => {
        activeTabName.value = FLOW_RELATION_TAB_NAME
    }
}

watch(simMode, value=> {
    // @ts-ignore
    configs.node.selectable = !value
    // @ts-ignore
    configs.edge.selectable = !value
})