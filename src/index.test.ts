import {
  ifPopulationsHaveChanged,
  checkIfDataExpired,
  getCountriesFrom,
  getCountriesWithoutLetter,
  sortCountriesByKey,
  sumTheBiggestPopulations,
} from "./index";

import { Country } from "./interfaces";

describe("populationsHaveChanged", () => {
  const unchangedPopulationOld: Country[] = [
    {
      name: "Spain",
      population: 10000000,
      area: 0,
      regionalBlocs: [],
    },
  ];
  const unchangedPopulationNew: Country[] = [
    {
      name: "Spain",
      population: 10000000,
      area: 0,
      regionalBlocs: [],
    },
  ];

  const changedPopulationOld: Country[] = [
    {
      name: "Ukraine",
      population: 10000000,
      area: 0,
      regionalBlocs: [],
    },
  ];
  const changedPopulationNew: Country[] = [
    {
      name: "Ukraine",
      population: 100000,
      area: 0,
      regionalBlocs: [],
    },
  ];

  test.each([
    [unchangedPopulationOld, unchangedPopulationNew, false],
    [changedPopulationOld, changedPopulationNew, true],
  ])(
    ".check populationsHaveChanged results",
    (oldPopulation, newPopulation, result) => {
      expect(ifPopulationsHaveChanged(oldPopulation, newPopulation)).toBe(
        result
      );
    }
  );
});

describe("checkIfDataExpired", () => {
  const now = new Date();
  test.each([
    [100000000000000, now, true],
    [100, now, false],
  ])(".check checkIfDataExpired results", (timestamp, newDate, result) => {
    expect(checkIfDataExpired(timestamp, newDate)).toBe(result);
  });
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const austria = {
  name: "Austria",
  population: 1,
  regionalBlocs: [{ acronym: "EU" }],
} as Country;

const poland = {
  name: "Poland",
  population: 100,
  regionalBlocs: [{ acronym: "EU" }],
} as Country;

const peru = {
  name: "Peru",
  population: 90000000000000,
  regionalBlocs: [{ acronym: "SAARC" }],
} as Country;

const countries: Country[] = [austria, peru, poland];

describe("getCountriesFrom", () => {
  it("returns countries that are in EU", () => {
    expect(getCountriesFrom(countries)).toEqual([austria, poland]);
  });
});

describe("getCountriesWithoutLetter", () => {
  it("returns countries witout 'a' n the name", () => {
    expect(getCountriesWithoutLetter(countries)).toEqual([peru]);
  });
});

describe("sortCountriesByKey", () => {
  it("returns sorted data in descending order", () => {
    console.log(sortCountriesByKey(countries));
    expect(sortCountriesByKey(countries)).toEqual([90000000000000, 100, 1]);
  });
});

describe("sumTheBiggestPopulations", () => {
  it("returns true if population sum is bigger than 500000000", () => {
    expect(sumTheBiggestPopulations([90000000000000, 100, 1])).toBe(true);
  });
});
