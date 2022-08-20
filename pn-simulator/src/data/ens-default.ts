import {Layouts} from "v-network-graph";
import {BaseNodes, FlowRelation, FlowRelations, Place, Transition} from "@/types";

const nodes: BaseNodes = {
    place1: new Place("p1", true),
    place2: new Place("p2", false),
    transition1: new Transition("t1"),
    transition2: new Transition("t2"),
}

const flowRelations: FlowRelations = {
    flowRelation1: new FlowRelation("place1", "transition1",),
    flowRelation2: new FlowRelation("transition1", "place2"),
    flowRelation3: new FlowRelation("place2", "transition2",),
    flowRelation4: new FlowRelation("transition2", "place1"),
}

const layouts: Layouts = {
    nodes: {},
}

export default {
    nodes,
    flowRelations,
    layouts
}