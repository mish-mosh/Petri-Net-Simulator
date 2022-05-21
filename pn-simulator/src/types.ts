import {Node} from "v-network-graph/lib/common/types";
import {Edge} from "v-network-graph";
import {ShapeType} from "v-network-graph/lib/common/configs";

abstract class BaseNode implements Node {
    name: string
    shape: ShapeType

    protected constructor(name: string, shape: ShapeType) {
        this.name = name
        this.shape = shape
    }
}

class Place extends BaseNode {
    hasToken: boolean

    constructor(name: string, hasToken: boolean = false) {
        super(name, "circle")
        this.hasToken = hasToken
    }
}

class Transition extends BaseNode {

    constructor(name: string) {
        super(name, "rect");
    }
}

type BaseNodes = Record<string, BaseNode>
type Places = Record<string, Place>;
type Transitions = Record<string, Transition>;


class FlowRelation<N1 extends Place | Transition, N2 extends Transition | Place> implements Edge {
    source: string;
    target: string;

    [x: string]: any;

    sourceNode: N1;
    targetNode: N2;

    constructor(source: N1, target: N2) {
        this.sourceNode = source
        this.targetNode = target
        this.source = source.name
        this.target = target.name
    }

}

type FlowRelations = Record<string, FlowRelation<BaseNode, BaseNode>>

// class PetriNet {
//     places: Set<string>;
//     transitions: Set<Transition>;
// }

export {
    BaseNode,
    Place,
    Transition,
    Places,
    Transitions,
    BaseNodes,
    FlowRelation,
    FlowRelations
}
