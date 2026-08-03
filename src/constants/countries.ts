import { Country } from "country-state-city";

export const COUNTRIES = Country.getAllCountries().map(
  (country) => country.name
);