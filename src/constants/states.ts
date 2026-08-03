import { State } from "country-state-city";

export const getStates = (countryCode: string) =>
  State.getStatesOfCountry(countryCode);