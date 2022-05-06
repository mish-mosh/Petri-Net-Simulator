import {Edges, Layouts} from "v-network-graph";
import {Place, Places, Transition, Transitions} from "@/model/petri-net";

const nodes: Places | Transitions = {
    node1: new Place("P1", true),
    node2: new Transition("T1"),
    node3: new Place("P2", false),
}

const edges: Edges = {
    edge1: {source: "node1", target: "node2"},
    edge2: {source: "node2", target: "node3"},
}

const layouts: Layouts = {
    nodes: {},
}

export default {
    nodes,
    edges,
    layouts
}