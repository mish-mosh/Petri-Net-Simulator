import { ref } from "vue";

export const dialogIsOpen = ref(false);

export const openDialog = () => {
    dialogIsOpen.value = true;
}

export const closeDialog = () => {
    dialogIsOpen.value = false;
}