import {Layouts} from "v-network-graph";
import {BaseNodes, FlowRelation, FlowRelations, Place, Transition} from "@/types";

const nodes: BaseNodes = {
    place1: new Place("p1", true),
    transition1: new Transition("t1"),
    place2: new Place("p2", false),
}

const flowRelations: FlowRelations = {
    flowRelation1: new FlowRelation(nodes["place1"], nodes["transition1"],),
    // flowRelation2: new FlowRelation("transition1", "place2"),
}

const layouts: Layouts = {
    nodes: {},
}

export default {
    nodes,
    flowRelations,
    layouts
}