import {Node} from "v-network-graph/lib/common/types";

abstract class VNetSerializable {
    public abstract toVNetGraph(): string
}

interface VNetGraphDisplayable extends Node {
    shape: string
}

class Place implements VNetGraphDisplayable {
    name: string
    shape: string

    constructor(name: string) {
        this.name = name
        this.shape = "circle"
    }
}

class Transition implements VNetGraphDisplayable {
    name: string
    shape: string
    hasToken: boolean;

    constructor(name: string, hasToken: boolean) {
        this.name = name
        this.hasToken = hasToken
        this.shape = "rec"
    }
}

export declare type Places = Record<string, Place>;
export declare type Transitions = Record<string, Transition>;


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
    Place,
    Transition,
}
// const es: FlowRelation<Place, Transition> = {place: {name: "eshi"}, transition: {name: "eshu"}}