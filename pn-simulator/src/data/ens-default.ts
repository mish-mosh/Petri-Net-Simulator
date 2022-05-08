import {Edges, Layouts} from "v-network-graph";
import {Place, Places, Transition, Transitions} from "@/types";

const nodes: Places | Transitions = {
    place1: new Place("p1", true),
    transition1: new Transition("t1"),
    place2: new Place("p2", false),
}

const edges: Edges = {
    edge1: {source: "place1", target: "transition1"},
    edge2: {source: "transition1", target: "place2"},
}

const layouts: Layouts = {
    nodes: {},
}

export default {
    nodes,
    edges,
    layouts
}