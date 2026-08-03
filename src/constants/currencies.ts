import { Country } from "country-state-city";

export const CURRENCIES = [
  ...new Set(Country.getAllCountries().map(country => country.currency))
];

export default CURRENCIES;
