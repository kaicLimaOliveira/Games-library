import type { Game } from "../interfaces/Game"

function validateEmptyFields(kwargs: Game): boolean {
    const { title, genre } = kwargs;

    if (!title) return false
    if (!genre) return false

    return true
}

export {
    validateEmptyFields
}