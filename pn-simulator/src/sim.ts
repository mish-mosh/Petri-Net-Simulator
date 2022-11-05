import {ENS, Places, Transition} from "@/types";
import {cloneDeep} from "lodash";
import {useENS} from "@/repository";
import {ElNotification} from "element-plus/es";
import {Ref, ref, UnwrapRef, watch} from "vue";

const {
    ens,
    loadENS,
} = useENS()

let initialNet: ENS = cloneDeep(new ENS(
    ens.value.places,
    ens.value.transitions,
    ens.value.flowRelations,
))

export const simMode: Ref<UnwrapRef<boolean>> = ref(false)

function onSimModeChange(simMode: boolean) {
    ens.value.validate()
    if (simMode) {
        initialNet = cloneDeep(new ENS(
            ens.value.places,
            ens.value.transitions,
            ens.value.flowRelations,
        ))
    } else {
        loadENS(initialNet)
    }
}

export function toggleSimMode(): void {
    simMode.value = !simMode.value
}

export function fireTransitionInENS(ens: ENS, transition: Transition): void {
    if (!simMode.value) {
        return
    }
    loadENS(fireENS(ens, transition))
}

function fireENS(ens: ENS, transition: Transition): ENS {
    if (!ens.transitionIsActive(transition)) {
        return ens
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

watch(simMode, (value: boolean) => {
    try {
        onSimModeChange(value);
    } catch (e: any) {
        simMode.value = false
        return ElNotification({
            title: 'Network not Valid',
            message: e,
            type: 'error',
        })
    }
})

