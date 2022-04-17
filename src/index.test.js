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
describe("getCountriesFrom", () => {
    it("returns countries that are in EU", () => {
        expect((0, index_1.getCountriesFrom)(countries)).toEqual([austria, poland]);
    });
});
describe("getCountriesWithoutLetter", () => {
    it("returns countries witout 'a' n the name", () => {
        expect((0, index_1.getCountriesWithoutLetter)(countries)).toEqual([peru]);
    });
});
describe("sortCountriesByKey", () => {
    it("returns sorted data in descending order", () => {
        console.log((0, index_1.sortCountriesByKey)(countries));
        expect((0, index_1.sortCountriesByKey)(countries)).toEqual([90000000000000, 100, 1]);
    });
});
describe("sumTheBiggestPopulations", () => {
    it("returns true if population sum is bigger than 500000000", () => {
        expect((0, index_1.sumTheBiggestPopulations)([90000000000000, 100, 1])).toBe(true);
    });
});
