import {Node} from "v-network-graph/lib/common/types";
import {Edge} from "v-network-graph";
import {ShapeType} from "v-network-graph/lib/common/configs";
import {filterRecordOnKeys} from "@/utils";

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

class FlowRelation implements Edge {
    source: string;
    target: string;

    [x: string]: any;

    constructor(source: string, target: string) {
        this.source = source
        this.target = target
    }

}


type BaseNodes = Record<string, BaseNode>
type Places = Record<string, Place>;
type Transitions = Record<string, Transition>;
type FlowRelations = Record<string, FlowRelation>

class ENS {
    places: Places;
    transitions: Transitions;
    flowRelations: FlowRelations

    constructor(places: Places, transitions: Transitions, flowRelations: FlowRelations) {
        this.places = places
        this.transitions = transitions
        this.flowRelations = flowRelations
    }

    getMarkings(): Places {
        return filterRecordOnKeys(this.places, (k: string) => this.places[k].hasToken)
    }

    prePlace(place: Place): Transitions {
        const prePlaceIds: string[] = Object.values(this.flowRelations)
            .filter((fl: FlowRelation) => {
                return Object.keys(this.places).includes(fl.target)
                    && this.places[fl.target].name == place.name
            })
            .map((fl: FlowRelation) => fl.source)
        return filterRecordOnKeys(this.transitions,
            (nodeId: string) => prePlaceIds.includes(nodeId)
        )
    }

    postPlace(place: Place): Transitions {
        const postPlaceIds: string[] = Object.values(this.flowRelations)
            .filter((fl: FlowRelation) => {
                return Object.keys(this.places).includes(fl.source)
                    && this.places[fl.source].name == place.name
            })
            .map((fl: FlowRelation) => fl.target)
        return filterRecordOnKeys(this.transitions,
            (nodeId: string) => postPlaceIds.includes(nodeId)
        )
    }

    preTransition(transition: Transition): Places {
        const preTransitionIds: string[] = Object.values(this.flowRelations)
            .filter((fl: FlowRelation) => {
                return Object.keys(this.transitions).includes(fl.target)
                    && this.transitions[fl.target].name == transition.name
            })
            .map((fl: FlowRelation) => fl.source)
        return filterRecordOnKeys(this.places,
            (nodeId: string) => preTransitionIds.includes(nodeId)
        )
    }

    postTransition(transition: Transition): Places {
        const postTransitionIds: string[] = Object.values(this.flowRelations)
            .filter((fl: FlowRelation) => {
                return Object.keys(this.transitions).includes(fl.source)
                    && this.transitions[fl.source].name == transition.name
            })
            .map((fl: FlowRelation) => fl.target)
        return filterRecordOnKeys(this.places,
            (nodeId: string) => postTransitionIds.includes(nodeId)
        )
    }

    validate(): void {
        Object.values(this.flowRelations).forEach((fl: FlowRelation) => {
            const sourceInPlaces: Boolean = this.places[fl.source] !== undefined
            const sourceInTransitions: Boolean = this.transitions[fl.source] !== undefined
            const targetInPlaces: Boolean = this.places[fl.target] !== undefined
            const targetInTransitions: Boolean = this.transitions[fl.target] !== undefined

            // Standard compatibility checks
            if (!sourceInPlaces && !sourceInTransitions) {
                throw new Error("Source is neither in places nor in transitions.")
            }
            if (!targetInPlaces && !targetInTransitions) {
                throw new Error("Target is neither in places nor in transitions.")
            }

            // Flow relation cannot have its source and its target both of same type (places/transitions)
            if (!sourceInPlaces && !targetInPlaces) {
                throw new Error(`Source and target of flow relation (${this.transitions[fl.source].name}, ${this.transitions[fl.target].name}) cannot be both transitions.`)
            }
            if (!sourceInTransitions && !targetInTransitions) {
                throw new Error(`Source and target of flow relation (${this.places[fl.source].name}, ${this.places[fl.target].name}) cannot be both places.`)
            }
        })

        Object.values(this.transitions).forEach((transition: Transition) => {
            const preTransition: Places = this.preTransition(transition)
            const postTransition: Places = this.postTransition(transition)

            // Transitions must have at least one pre- and one post-place
            if (Object.keys(preTransition).length == 0) {
                throw new Error(`Transition "${transition.name}" must have at least one pre-place.`)
            }
            if (Object.keys(postTransition).length == 0) {
                throw new Error(`Transition "${transition.name}" must have at least one post-place.`)
            }

            // Transitions cannot have a place as a member of its pre- and post-place in the same time
            Object.keys(preTransition).forEach((placeId: string) => {
                if (Object.keys(postTransition).includes(placeId)) {
                    throw new Error(`Place "${this.places[placeId].name}" cannot be in be a pre-place as well as a post-place for transition "${transition.name}".`)
                }
            })
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
    ENS
}
