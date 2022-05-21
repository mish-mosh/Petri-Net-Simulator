import {Node} from "v-network-graph/lib/common/types";
import {Edge} from "v-network-graph";
import {ShapeType} from "v-network-graph/lib/common/configs";

type Class<T> = new (...args: any[]) => T;

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

class PetriNet {
    places: Places;
    transitions: Transitions;
    flowRelations: FlowRelations

    constructor(places: Places, transitions: Transitions, flowRelations: FlowRelations) {
        this.places = places
        this.transitions = transitions
        this.flowRelations = flowRelations
        this.validate()
    }

    protected validate(): void {
        Object.values(this.flowRelations).forEach((fl: FlowRelation) => {
            const sourceInPlaces: Boolean = this.places[fl.source] !== undefined
            const sourceInTransitions: Boolean = this.transitions[fl.source] !== undefined
            const targetInPlaces: Boolean = this.places[fl.target] !== undefined
            const targetInTransitions: Boolean = this.transitions[fl.target] !== undefined

            if (!sourceInPlaces && !sourceInTransitions) {
                console.log("Error: Source is neither in places nor in transitions")
            }
            if (!targetInPlaces && !targetInTransitions) {
                console.log("Error: Target is neither in places nor in transitions")
            }
            if (!sourceInPlaces && !targetInPlaces) {
                console.log(`Error: Source (${this.transitions[fl.source].name}) and target (${this.transitions[fl.target].name}) cannot be both places`)
                console.log(`${fl}`)
            }
            if (!sourceInTransitions && !targetInTransitions) {
                console.log(`Error: Source (${this.transitions[fl.source].name}) and target (${this.transitions[fl.target].name}) cannot be both transitions`)
                console.log(`${fl}`)
            }

        })
    }
}

export {
    Class,
    BaseNode,
    Place,
    Transition,
    Places,
    Transitions,
    BaseNodes,
    FlowRelation,
    FlowRelations,
    PetriNet
}
