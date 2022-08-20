import {ENS, Places, Transition} from "@/types";

function canFireENS(ens: ENS, transition: Transition): boolean {
    return true;
}

export function fireENS(ens: ENS, transition: Transition): ENS {
    if (!canFireENS(ens, transition)) {
        // Todo
        throw new Error("Cannot ")
    }
    const newPlaces = ens.places
    const markings: Places = ens.getMarkings()
    Object.keys(markings).forEach((placeId: string) => {
        if (Object.keys(ens.preTransition(transition)).includes(placeId)) {
            newPlaces[placeId].hasToken = false
        }
    })
    Object.keys(ens.postTransition(transition)).forEach((placeId: string) => {
        newPlaces[placeId].hasToken = true
    })

    return new ENS(
        newPlaces,
        ens.transitions,
        ens.flowRelations
    )
}