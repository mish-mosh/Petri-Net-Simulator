interface Place {
    name: string;
}

interface Transition {
    name: string;
}

interface FlowRelation<Place, Transition> {
    place: Place;
    transition: Transition;
}

interface PetriNet {
    places: Set<string>;
    transitions: Set<Transition>;
}


const es: FlowRelation<Place, Transition> = {place: {name: "eshi"}, transition: {name: "eshu"}}