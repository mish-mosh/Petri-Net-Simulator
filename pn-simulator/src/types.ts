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


class FlowRelation implements Edge {
    source: string;
    target: string;

    [x: string]: any;

    constructor(source: string, target: string) {
        this.source = source
        this.target = target
    }

}

type FlowRelations = Record<string, FlowRelation>

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
