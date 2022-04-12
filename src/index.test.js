"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
describe("populationsHaveChanged", () => {
    const unchangedPopulationOld = [
        {
            name: "Spain",
            population: 10000000,
        },
    ];
    const unchangedPopulationNew = [
        {
            name: "Spain",
            population: 10000000,
        },
    ];
    const changedPopulationOld = [
        {
            name: "Ukraine",
            population: 10000000,
        },
    ];
    const changedPopulationNew = [
        {
            name: "Ukraine",
            population: 100000,
        },
    ];
    test.each([
        [unchangedPopulationOld, unchangedPopulationNew, false],
        [changedPopulationOld, changedPopulationNew, true],
    ])(".check populationsHaveChanged results", (oldPopulation, newPopulation, result) => {
        expect((0, index_1.ifPopulationsHaveChanged)(oldPopulation, newPopulation)).toBe(result);
    });
});
describe("checkIfDataExpired", () => {
    const now = new Date();
    test.each([
        [100000000000000, now, true],
        [100, now, false],
    ])(".check checkIfDataExpired results", (timestamp, newDate, result) => {
        expect((0, index_1.checkIfDataExpired)(timestamp, newDate)).toBe(result);
    });
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const austria = {
    name: "Austria",
    population: 1,
    regionalBlocs: [{ acronym: "EU" }],
};
const poland = {
    name: "Poland",
    population: 100,
    regionalBlocs: [{ acronym: "EU" }],
};
const peru = {
    name: "Peru",
    population: 90000000000000,
    regionalBlocs: [{ acronym: "SAARC" }],
};
const countries = [austria, peru, poland];
describe("getCountriesEU", () => {
    it("returns right output with test data", () => {
        expect((0, index_1.getCountriesEU)(countries)).toEqual([austria, poland]);
    });
});
describe("getCountriesWithoutA", () => {
    it("returns right output with test data", () => {
        expect((0, index_1.getCountriesWithoutA)(countries)).toEqual([peru]);
    });
});
describe("sortCountriesByPopulation", () => {
    it("returns right output with test data", () => {
        console.log((0, index_1.sortCountriesByPopulation)(countries));
        expect((0, index_1.sortCountriesByPopulation)(countries)).toEqual([
            peru,
            poland,
            austria,
        ]);
    });
});
describe("sumTheBiggestCountries", () => {
    it("returns right output with test data", () => {
        console.log((0, index_1.sumTheBiggestCountries)(countries));
        expect((0, index_1.sumTheBiggestCountries)(countries)).toBe(true);
    });
});
