import {Node} from "v-network-graph/lib/common/types";

abstract class BaseNode implements Node {
    shape: string

    protected constructor(shape: string) {
        this.shape = shape
    }
}

class Place extends BaseNode {
    name: string
    hasToken: boolean

    constructor(name: string, hasToken: boolean = false) {
        super("circle")
        this.name = name
        this.hasToken = hasToken
    }
}

class Transition extends BaseNode {
    name: string

    constructor(name: string) {
        super("rec")
        this.name = name
    }
}

type Places = Record<string, Place>;
type Transitions = Record<string, Transition>;


class FlowRelation<Place, Transition> {
    place: Place;
    transition: Transition;

    constructor(place: Place, transition: Transition) {
        this.place = place;
        this.transition = transition
    }
}

// class PetriNet {
//     places: Set<string>;
//     transitions: Set<Transition>;
// }

export {
    BaseNode,
    Place,
    Transition,
    Places,
    Transitions
}
