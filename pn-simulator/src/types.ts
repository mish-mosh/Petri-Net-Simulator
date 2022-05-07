import {Node} from "v-network-graph/lib/common/types";

interface BaseNode extends Node {
    shape: string
}

class Place implements BaseNode {
    name: string
    shape: string
    hasToken: boolean

    constructor(name: string, hasToken: boolean = false) {
        this.name = name
        this.hasToken = hasToken
        this.shape = "circle"
    }
}

class Transition implements BaseNode {
    name: string
    shape: string

    constructor(name: string) {
        this.name = name
        this.shape = "rec"
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
