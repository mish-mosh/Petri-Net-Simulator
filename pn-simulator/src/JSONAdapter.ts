import {ENS, FlowRelation, FlowRelations, Place, Places, Transition, Transitions} from "@/types";
import {useENS} from "@/repository"

const {ens, loadENS} = useENS()

export function loadENSFromJSONFile(file: File): void {
    const reader = new FileReader()
    reader.addEventListener('load', (e) => {
        const ensJSON = JSON.parse(e.target?.result as string)
        const places: Places = Object.keys(ensJSON.places)
            .reduce((accumulator: Record<string, any>, pId: string) => {
                const place = ensJSON.places[pId]
                return Object.assign(
                    accumulator, {[pId]: (new Place(place.name, place.hasToken))})
            }, {})
        const transitions: Transitions = Object.keys(ensJSON.transitions)
            .reduce((accumulator: Record<string, any>, tId: string) => {
                const transition = ensJSON.transitions[tId]
                return Object.assign(
                    accumulator, {[tId]: (new Transition(transition.name))})
            }, {})
        const flowRelations: FlowRelations = Object.keys(ensJSON.flowRelations)
            .reduce((accumulator: Record<string, any>, fId: string) => {
                const flowRelation = ensJSON.flowRelations[fId]
                return Object.assign(
                    accumulator, {[fId]: (new FlowRelation(flowRelation.source, flowRelation.target))})
            }, {})

        loadENS(new ENS(places, transitions, flowRelations))
    })
    reader.readAsText(file)
}

export function exportENStoJSONBlob(): Blob {
    return new Blob(
        [JSON.stringify(ens.value, null, 4)],
        {type: "application/json"}
    );
}