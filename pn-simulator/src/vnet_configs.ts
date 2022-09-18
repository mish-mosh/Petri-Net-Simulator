import {defineConfigs, Edge} from "v-network-graph";
import {Place, Transition} from "@/types";
import {ForceEdgeDatum, ForceLayout, ForceNodeDatum} from "v-network-graph/lib/force-layout";
import {useENS} from "@/repository";
import {reactive, watch} from "vue";
import {simMode} from "@/sim";

const {ens} = useENS()

export const configs =
    reactive(defineConfigs<Place | Transition, Edge>({
            node: {
                selectable: true,
                normal: {
                    type: (node: Place | Transition) => node.shape,
                    color: (node: Place | Transition) => {
                        if (node instanceof Transition) {
                            if (ens.value.transitionIsActive(node)) {
                                return "#07ff8f"
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
                    visible: true,
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

watch(simMode, value => {
    // @ts-ignore
    configs.view.grid.visible = !simMode.value
    // @ts-ignore
    configs.node.selectable = !simMode.value
    // @ts-ignore
    configs.edge.selectable = !simMode.value
})