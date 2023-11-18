import {Layouts} from "v-network-graph";
import {BaseNodes, FlowRelation, FlowRelations, Place, Transition} from "@/domain";

const nodes: BaseNodes = {
    p1: new Place("p1", true),
    produce: new Transition("produce"),
    p2: new Place("p2", false),
    put: new Transition("put"),
    buffer: new Place("buffer", true),
    c1: new Place("c1", false),
    consume: new Transition("consume"),
    c2: new Place("c2", true),
    take: new Transition("take"),
}

const flowRelations: FlowRelations = {
    flowRelation1: new FlowRelation("p1", "produce",),
    flowRelation2: new FlowRelation("produce", "p2"),
    flowRelation3: new FlowRelation("p2", "put",),
    flowRelation4: new FlowRelation("put", "p1"),
    flowRelation5: new FlowRelation("c1", "consume"),
    flowRelation6: new FlowRelation("consume", "c2"),
    flowRelation7: new FlowRelation("c2", "take"),
    flowRelation8: new FlowRelation("take", "c1"),
    flowRelation9: new FlowRelation("put", "buffer"),
    flowRelation10: new FlowRelation("buffer", "take"),
}

const layouts: Layouts = {
    nodes: {},
}

export default {
    nodes,
    flowRelations,
    layouts
}