import { createCharacter } from "./domain/character";

const c = createCharacter({ name: "Uriann" });

console.log({ c }, c.abilityScores.strength);
