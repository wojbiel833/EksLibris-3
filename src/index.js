"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sumTheBiggestPopulations = exports.sortCountriesByKey = exports.getCountriesWithoutLetter = exports.getCountriesFrom = exports.ifPopulationsHaveChanged = exports.checkIfDataExpired = void 0;
const config_1 = require("../config");
const lodash_1 = require("lodash");
const now = new Date();
let TP = [];
// Adding an date expiry object to localSorage under "fetchData"
const setDateWithExpiry = function (key, value, ttl) {
    const dateExpiry = {
        value: value,
        expiry: value.getTime() + ttl,
    };
    // Check if object is already there, if not add
    if (!localStorage.getItem(key)) {
        localStorage.setItem(key, JSON.stringify(dateExpiry));
    }
    else
        "";
    // console.log(`The local storage already has key "${key}" in use.`);
};
// 4) Przy starcie aplikacji sprawdź ile czasu minęło od poprzedniego ściągnięcia danych państw. Jeśli od ostatniego razu minęło co najmniej 7 dni, ściągnij i zapisz je ponownie.
const getAndCheckDateWithExpiry = function (key) {
    const itemString = localStorage.getItem(key);
    if (itemString) {
        const dateExpiry = JSON.parse(itemString);
        return (0, exports.checkIfDataExpired)(dateExpiry.expiry, now);
    }
    return (0, exports.checkIfDataExpired)(0, now);
};
const checkIfDataExpired = function (storageDateExpiryTimestamp, newDate) {
    const todaysTimestamp = newDate.getTime();
    if (storageDateExpiryTimestamp >= todaysTimestamp) {
        // console.log("Data is expired!");
        return true;
    }
    else {
        // console.log("Data doesn't exist or hasn't expired.");
        return false;
    }
};
exports.checkIfDataExpired = checkIfDataExpired;
// 5) Stwórz metodę, która przy ponownym ściąganiu danych państw porówna populację między starym i nowym zestawem danych oraz wyświetli wszystkie nazwy państw, których populacja uległa zmianie.
const ifPopulationsHaveChanged = function (oldData, newData) {
    if (!oldData)
        oldData = [];
    if (!newData)
        newData = [];
    // Fake population change
    // oldData[1].population = 20;
    // newData[100].population = 20000;
    let populationIsChanged = false;
    for (let i = 0; i < oldData.length; i++) {
        if (oldData[i].population !== newData[i].population) {
            console.log(oldData[i].name);
            populationIsChanged = true;
        }
    }
    if (populationIsChanged)
        return true;
    return false;
};
exports.ifPopulationsHaveChanged = ifPopulationsHaveChanged;
const saveDataInLocalStorage = function (data) {
    if (!localStorage.TP) {
        localStorage.setItem("TP", JSON.stringify(data));
    }
};
const fetchData = function () {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield fetch(config_1.CONFIG.API_URL);
            TP = yield res.json();
            return TP;
        }
        catch (err) {
            console.log(err);
        }
    });
};
const checkLocalStorage = function (data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Set new expiry date
            setDateWithExpiry(config_1.CONFIG.LOCAL_STORAGE_KEY, now, config_1.CONFIG.WEEK_TIMESTAMP);
            const storageData = localStorage.getItem("TP");
            const oldData = JSON.parse(storageData);
            const newData = data;
            if (newData) {
                localStorage.setItem("TP", JSON.stringify(newData));
                (0, exports.ifPopulationsHaveChanged)(oldData, newData);
                JSON.parse(localStorage.getItem("TP"));
                return true;
            }
            else {
                // console.log("Fetch unsuccesful!");
                return false;
            }
        }
        catch (err) {
            console.log(err);
        }
    });
};
const init = function () {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Check if data expired
            const dataExpired = getAndCheckDateWithExpiry(config_1.CONFIG.LOCAL_STORAGE_KEY);
            // 3) Przy starcie aplikacji sprawdź, czy dane państw istnieją w pamięci przeglądarki. Jeśli nie, ściągnij je,
            if (dataExpired) {
                // 1) Ściągnij wszystkie możliwe dane państw z pomocą API: https://restcountries.com/v2/all. W dalszej części kursu będą one nazywane Tablicą Państw (TP).
                TP = yield fetchData();
            }
            checkLocalStorage(TP);
            // 2) Ściągnięte dane zapisz w sposób, który pozwoli na ich ponowne wykorzystanie po zamknięciu i ponownym otwarciu przeglądarki,
            saveDataInLocalStorage(TP);
        }
        catch (err) {
            console.log(err);
        }
    });
};
init();
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
// Z Tablicy Państw z zadania 1 przefiltruj wszystkie należące do Unii Europejskiej.
const countriesLS = JSON.parse(localStorage.getItem("TP"));
const getCountriesFrom = function (countries, from = "EU") {
    const countriesEU = [];
    if (countries) {
        countries.forEach((country) => {
            const blocs = country.regionalBlocs;
            if (blocs) {
                if (blocs.find((union) => union.acronym === from))
                    countriesEU.push(country);
            }
            return false;
        });
    }
    else {
        console.log("No data in local storage!");
    }
    return countriesEU;
};
exports.getCountriesFrom = getCountriesFrom;
const countriesEUOutput = (0, exports.getCountriesFrom)(countriesLS);
// Z uzyskanej w ten sposób tablicy usuń wszystkie państwa posiadające w swojej nazwie literę a.
const getCountriesWithoutLetter = (countries, letter = "a") => countries === null || countries === void 0 ? void 0 : countries.filter((country) => !country.name.includes(letter));
exports.getCountriesWithoutLetter = getCountriesWithoutLetter;
const countriesWitroutA = (0, exports.getCountriesWithoutLetter)(countriesEUOutput);
// Z uzyskanej w ten sposób tablicy posortuj państwa według populacji, tak by najgęściej zaludnione znajdowały się na górze listy.
const setKey = function (country, key) {
    return country[key];
};
const sortCountriesByKey = (countries, key = "population") => {
    const populations = [];
    countries === null || countries === void 0 ? void 0 : countries.forEach((country) => {
        const data = setKey(country, key);
        populations.push(data);
    });
    return populations.sort((a, b) => b - a);
};
exports.sortCountriesByKey = sortCountriesByKey;
const sortedCountries = (0, exports.sortCountriesByKey)(countriesWitroutA);
// Zsumuj populację pięciu najgęściej zaludnionych państw i oblicz, czy jest większa od 500 milionów
const sumTheBiggestPopulations = function (countries) {
    const fiveBiggestPopulations = countries.slice(0, 5);
    const populationsInSum = fiveBiggestPopulations.reduce((pop, el) => (pop += el), 0);
    if (populationsInSum > 500000000) {
        console.log(`Population sum ${populationsInSum} is bigger than 500000000`);
        return true;
    }
    else {
        console.log(`Population sum ${populationsInSum} is smaller than 500000000`);
        return false;
    }
};
exports.sumTheBiggestPopulations = sumTheBiggestPopulations;
(0, exports.sumTheBiggestPopulations)(sortedCountries);
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
// Dla każdej organizacji dane w tablicy currencies nie mogą się powtarzać.
// Dla każdej organizacji dane w tablicy countries powinny być posortowane alfabetycznie z do a.
// Wyświetl w konsoli:
// Nazwę organizacji o największej populacji,
// Nazwę organizacji o drugiej największej gęstości zaludnienia,
// Nazwę organizacji zajmującej trzeci największy obszar,
// Nazwy organizacji o największej i najmniejszej przypisanej do nich liczbie języków,
// Nazwę organizacji wykorzystującej największą liczbę walut,
// Nazwę organizacji posiadającej najmniejszą liczbę państw członkowskich,
// Natywną nazwę języka wykorzystywanego w największej liczbie krajów,
// Natywną nazwę języka wykorzystywanego przez najmniejszą liczbę ludzi,
// Natywne nazwy języków wykorzystywanych na największym i najmniejszym obszarze.
// W przypadku remisów wyświetl wszystkich zwycięzców.
// Stwórz nowy obiekt. Powinien on posiadać klucze EU, NAFTA, AU oraz other. Każdy z tych kluczy będzie zawierał obiekt o kluczach countries, population, languages oraz currencies. Wartościami countries oraz currencies są puste tablice, wartość population wynosi 0. Wartość languages to pusty obiekt.
const countriesInUnionsObj = {
    EU: {
        countries: [],
        population: 0,
        languages: [],
        currencies: [],
    },
    NAFTA: {
        countries: [],
        population: 0,
        languages: [],
        currencies: [],
    },
    AU: {
        countries: [],
        population: 0,
        languages: [],
        currencies: [],
    },
    others: {
        countries: [],
        population: 0,
        languages: [],
        currencies: [],
    },
};
// W TP znajdź kraje należące do EU, NAFTA albo AU. Jeśli państwo należy do którejś z tych grup, umieść jego dane w stosownym obiekcie:
const clonedTP = (0, lodash_1.cloneDeep)(countriesLS);
// console.log(clonedTP);
const EUCountries = (0, exports.getCountriesFrom)(countriesLS, "EU");
// console.log(EUCountries);
const NAFTACountries = (0, exports.getCountriesFrom)(countriesLS, "NAFTA");
// console.log(NAFTACountries);
const AUCountries = (0, exports.getCountriesFrom)(countriesLS, "AU");
// console.log(AUCountries);
const usedCountries = [];
// console.log(usedCountries);
class languageObj {
    constructor(name, population, area) {
        this.name = name;
        this.population = population;
        this.area = area;
    }
}
const assingValuesToObj = function (countries, countryKey, newObj, newObjKey) {
    const organization = setKey(newObj, newObjKey);
    const truthArr = []; // XD
    if (countries) {
        countries.forEach((country, i, countries) => {
            var _a, _b, _c;
            const newLanguageObj = new languageObj(countries[i].name, countries[i].population, countries[i].area);
            // natywną nazwę w tablicy countries,
            (_a = organization.countries) === null || _a === void 0 ? void 0 : _a.push(country.name);
            // zachowaj nazwy kazdego uzytego pañstwa
            usedCountries.push(country.name);
            // używane przez nią waluty w tablicy currencies
            (_b = country.currencies) === null || _b === void 0 ? void 0 : _b.forEach((currency) => {
                var _a;
                (_a = organization.currencies) === null || _a === void 0 ? void 0 : _a.push(currency);
            });
            // dodaj jej populację do wartości population.
            organization.population += country.population;
            // Sprawdź języki przypisane do kraju i użyj ich kodu iso639_1 jako klucza dla obiektu languages.
            country.languages.forEach((language) => {
                var _a;
                const lng = language.iso639_1;
                if (lng) {
                    const emptyObj = new languageObj("", 0, 0);
                    const keyValuePair = { [lng]: emptyObj };
                    (_a = organization.languages) === null || _a === void 0 ? void 0 : _a.push(keyValuePair);
                }
            });
            //  uwarunkuj scernariusz dla klucza others
            if (newObjKey !== "others") {
                for (let i = 0; i < clonedTP.length; i++) {
                    for (let j = 0; j < usedCountries.length; j++) {
                        if (clonedTP[i].name === usedCountries[j])
                            clonedTP.splice(i, 1);
                    }
                }
            }
            // Jeśli dany język znajduje się w obiekcie languages, dodaj do tablicy countries kod alpha3code kraju, w którym jest używany, populację tego kraju do wartości population, obszar kraju do wartości area, a do name przypisz natywną nazwę tego języka.
            (_c = organization.languages) === null || _c === void 0 ? void 0 : _c.map((language) => {
                const [value] = Object.values(language);
                if (value.name === "") {
                    for (let a = 0; a < countries.length; a++) {
                        for (let b = 0; b < usedCountries.length; b++) {
                            value.name = newLanguageObj.name;
                            value.population = newLanguageObj.population++;
                            value.area = newLanguageObj.area++;
                        }
                    }
                }
                // if (value.name === "") {
                //   for (let a = 0; a < countries.length; a++) {
                //     for (let b = 0; b < usedCountries.length; b++) {}
                //   }
                // }
            });
        });
    }
    // Jeśli kraj należy do więcej, niż jednej organizacji, umieść jego dane we wszystkich pasujących obiektach bloków. Blok other może się powtarzać.
    // const findCountryInOrganization = organization.countries?.some(
    //   (country, i, countries) => {
    //     // console.log(country);
    //     // console.log(countries[i]);
    //     console.log(countries);
    //     return countries[i] === "Peru";
    //   }
    // );
    // console.log(findCountryInOrganization);
    // if (findCountryInOrganization) {
    //   truthArr.push(findCountryInOrganization);
    // }
    // console.log(truthArr.length);
    // organization.currencies = uniqBy(organization.currencies, "code");
};
assingValuesToObj(EUCountries, "currencies", countriesInUnionsObj, "EU");
assingValuesToObj(NAFTACountries, "currencies", countriesInUnionsObj, "NAFTA");
assingValuesToObj(AUCountries, "currencies", countriesInUnionsObj, "AU");
// Jeśli kraj nie należy do żadnej z podanych wcześniej organizacji wykonaj kroki z poprzednich dwóch punktów, ale dane umieść w tablicy other. (LANGUAGES)
assingValuesToObj(clonedTP, "currencies", countriesInUnionsObj, "others");
console.log(countriesInUnionsObj);
