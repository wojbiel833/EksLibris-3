import {
  ifPopulationsHaveChanged,
  checkIfDataExpired,
  getCountriesEU,
  getCountriesWithoutA,
  sortCountriesByPopulation,
  sumTheBiggestCountries,
} from "./index";

import { Country } from "./interfaces";

describe("populationsHaveChanged", () => {
  const unchangedPopulationOld: Country[] = [
    {
      name: "Spain",
      population: 10000000,
    },
  ];
  const unchangedPopulationNew: Country[] = [
    {
      name: "Spain",
      population: 10000000,
    },
  ];

  const changedPopulationOld: Country[] = [
    {
      name: "Ukraine",
      population: 10000000,
    },
  ];
  const changedPopulationNew: Country[] = [
    {
      name: "Ukraine",
      population: 100000,
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

describe("getCountriesEU", () => {
  it("returns right output with test data", () => {
    expect(getCountriesEU(countries)).toEqual([austria, poland]);
  });
});

describe("getCountriesWithoutA", () => {
  it("returns right output with test data", () => {
    expect(getCountriesWithoutA(countries)).toEqual([peru]);
  });
});

describe("sortCountriesByPopulation", () => {
  it("returns right output with test data", () => {
    console.log(sortCountriesByPopulation(countries));
    expect(sortCountriesByPopulation(countries)).toEqual([
      peru,
      poland,
      austria,
    ]);
  });
});

describe("sumTheBiggestCountries", () => {
  it("returns right output with test data", () => {
    console.log(sumTheBiggestCountries(countries));
    expect(sumTheBiggestCountries(countries)).toBe(true);
  });
});
