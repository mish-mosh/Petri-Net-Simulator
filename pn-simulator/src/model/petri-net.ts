export interface Place {
    name: string;
}

export interface Transition {
    name: string;
}

export interface FlowRelation<Place, Transition> {
    place: Place;
    transition: Transition;
}

export interface PetriNet {
    places: Set<string>;
    transitions: Set<Transition>;
}


const es: FlowRelation<Place, Transition> = {place: {name: "eshi"}, transition: {name: "eshu"}}