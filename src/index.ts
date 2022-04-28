import { CONFIG } from "../config";
import {
  Country,
  CountriesInUnionsObj,
  RegionalBlocs,
  SetKey,
  Language,
  Currencies,
} from "./interfaces";

import { uniqBy, cloneDeep, orderBy } from "lodash";
import { stringify } from "ts-jest";
import { validateLocaleAndSetLanguage } from "typescript";

const now = new Date();
let TP: [] | undefined = [];

// Adding an date expiry object to localSorage under "fetchData"
const setDateWithExpiry = function (key: string, value: Date, ttl: number) {
  const dateExpiry = {
    value: value,
    expiry: value.getTime() + ttl,
  };

  // Check if object is already there, if not add
  if (!localStorage.getItem(key)) {
    localStorage.setItem(key, JSON.stringify(dateExpiry));
  } else "";
  // console.log(`The local storage already has key "${key}" in use.`);
};

// 4) Przy starcie aplikacji sprawdź ile czasu minęło od poprzedniego ściągnięcia danych państw. Jeśli od ostatniego razu minęło co najmniej 7 dni, ściągnij i zapisz je ponownie.
const getAndCheckDateWithExpiry = function (key: string) {
  const itemString = localStorage.getItem(key);
  if (itemString) {
    const dateExpiry = JSON.parse(itemString);

    return checkIfDataExpired(dateExpiry.expiry, now);
  }

  return checkIfDataExpired(0, now);
};

export const checkIfDataExpired = function (
  storageDateExpiryTimestamp: number,
  newDate: Date
) {
  const todaysTimestamp = newDate.getTime();

  if (storageDateExpiryTimestamp >= todaysTimestamp) {
    // console.log("Data is expired!");
    return true;
  } else {
    // console.log("Data doesn't exist or hasn't expired.");
    return false;
  }
};

// 5) Stwórz metodę, która przy ponownym ściąganiu danych państw porówna populację między starym i nowym zestawem danych oraz wyświetli wszystkie nazwy państw, których populacja uległa zmianie.
export const ifPopulationsHaveChanged = function (
  oldData: Country[],
  newData: Country[]
) {
  if (!oldData) oldData = [];
  if (!newData) newData = [];

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

  if (populationIsChanged) return true;
  return false;
};

const saveDataInLocalStorage = function (data: [] | undefined) {
  if (!localStorage.TP) {
    localStorage.setItem("TP", JSON.stringify(data));
  }
};

const fetchData = async function () {
  try {
    const res = await fetch(CONFIG.API_URL);
    TP = await res.json();

    return TP;
  } catch (err) {
    console.log(err);
  }
};

const checkLocalStorage = async function (data: Country[] | undefined) {
  try {
    // Set new expiry date
    setDateWithExpiry(CONFIG.LOCAL_STORAGE_KEY, now, CONFIG.WEEK_TIMESTAMP);

    const storageData = localStorage.getItem("TP")!;

    const oldData: Country[] = JSON.parse(storageData);
    const newData: Country[] | undefined = data;

    if (newData) {
      localStorage.setItem("TP", JSON.stringify(newData));

      ifPopulationsHaveChanged(oldData, newData);

      JSON.parse(localStorage.getItem("TP")!);
      return true;
    } else {
      // console.log("Fetch unsuccesful!");
      return false;
    }
  } catch (err) {
    console.log(err);
  }
};

const init = async function () {
  try {
    // Check if data expired
    const dataExpired = getAndCheckDateWithExpiry(CONFIG.LOCAL_STORAGE_KEY);

    // 3) Przy starcie aplikacji sprawdź, czy dane państw istnieją w pamięci przeglądarki. Jeśli nie, ściągnij je,
    if (dataExpired) {
      // 1) Ściągnij wszystkie możliwe dane państw z pomocą API: https://restcountries.com/v2/all. W dalszej części kursu będą one nazywane Tablicą Państw (TP).
      TP = await fetchData();
    }
    checkLocalStorage(TP);
    // 2) Ściągnięte dane zapisz w sposób, który pozwoli na ich ponowne wykorzystanie po zamknięciu i ponownym otwarciu przeglądarki,
    saveDataInLocalStorage(TP);
  } catch (err) {
    console.log(err);
  }
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
const countriesLS: Country[] = JSON.parse(localStorage.getItem("TP")!);

export const getCountriesFrom = function (
  countries: Country[],
  from: string = "EU"
) {
  const countriesEU = [] as Country[];

  if (countries) {
    countries.forEach((country) => {
      const blocs: RegionalBlocs[] | undefined = country.regionalBlocs;
      if (blocs) {
        if (blocs.find((union: RegionalBlocs) => union.acronym === from))
          countriesEU.push(country);
      }
      return false;
    });
  } else {
    console.log("No data in local storage!");
  }
  return countriesEU;
};
const countriesEUOutput: Country[] | undefined = getCountriesFrom(countriesLS);

// Z uzyskanej w ten sposób tablicy usuń wszystkie państwa posiadające w swojej nazwie literę a.
export const getCountriesWithoutLetter = (
  countries: Country[] | undefined,
  letter: string = "a"
) => countries?.filter((country) => !country.name.includes(letter));

const countriesWitroutA: Country[] | undefined =
  getCountriesWithoutLetter(countriesEUOutput);

// Z uzyskanej w ten sposób tablicy posortuj państwa według populacji, tak by najgęściej zaludnione znajdowały się na górze listy.
const setKey: typeof SetKey = function (country, key) {
  return country[key];
};

export const sortCountriesByKey = (
  countries: Country[] | undefined,
  key: keyof Country = "population"
) => {
  const populations: any[] = [];
  countries?.forEach((country) => {
    // if (country) {
    const data = setKey(country, key);
    populations.push(data);
    // }
  });

  return populations.sort((a: number, b: number) => b - a);
};

const sortedCountries = sortCountriesByKey(countriesWitroutA);

// Zsumuj populację pięciu najgęściej zaludnionych państw i oblicz, czy jest większa od 500 milionów
export const sumTheBiggestPopulations = function (countries: any[]) {
  const fiveBiggestPopulations = countries.slice(0, 5);

  const populationsInSum = fiveBiggestPopulations.reduce(
    (pop, el) => (pop += el),
    0
  );

  if (populationsInSum > 500000000) {
    console.log(`Population sum ${populationsInSum} is bigger than 500000000`);
    return true;
  } else {
    console.log(`Population sum ${populationsInSum} is smaller than 500000000`);
    return false;
  }
};

sumTheBiggestPopulations(sortedCountries);

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

const countriesInUnionsObj: CountriesInUnionsObj = {
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

const EUCountries = getCountriesFrom(countriesLS, "EU")!;
const NAFTACountries = getCountriesFrom(countriesLS, "NAFTA")!;
const AUCountries = getCountriesFrom(countriesLS, "AU")!;

const usedCountries: string[] = [];
const countriesNamesFromLanguages: string[] = [];
const countriesNames: string[] = [];
const organisationsCountries: number[] = [];
const organisationsPop: number[] = [];
const organisationsAreas: number[] = [];
const organisationsDensity: number[] = [];
const organisationsLanguages: Language[][] = [];
const organisationsCurrencies: Currencies[][] = [];
const organisationsNames = Object.keys(countriesInUnionsObj);

const organisationsDensityCopy = [...organisationsDensity];
const clonedTP = cloneDeep(countriesLS);

let biggestOrg = 0;
let biggestArea = 0;
let totalLanguagesArea = 0;
let currenciesCount = 0;
let minLanguages = 0;
let maxLanguages = countriesLS.length;
let maxCountries = countriesLS.length;

class languageObj implements Language {
  name: string;
  population: number;
  area: number;

  constructor(name: string, population: number, area: number) {
    this.name = name;
    this.population = population;
    this.area = area;
  }
}

const assingValuesToObj = function (
  countries: Country[],
  newObj: CountriesInUnionsObj,
  newObjKey: keyof CountriesInUnionsObj
) {
  const organization = setKey(newObj, newObjKey);
  let countriesCount = 0;
  if (countries) {
    countries.forEach((country, i, countries) => {
      const newLanguageObj = new languageObj(
        countries[i].name,
        countries[i].population,
        countries[i].area
      );

      // natywną nazwę w tablicy countries,
      organization.countries?.push(country.name);
      // zwiększ liczbe panstw
      countriesCount = countriesCount + 1;
      // zachowaj nazwy kazdego uzytego pañstwa
      usedCountries.push(country.name);

      // używane przez nią waluty w tablicy currencies
      country.currencies?.forEach((currency) => {
        organization.currencies?.push(currency);
      });

      // dodaj jej populację do wartości population.
      organization.population! += country.population;

      // Sprawdź języki przypisane do kraju i użyj ich kodu iso639_1 jako klucza dla obiektu languages.
      country.languages!.forEach((language) => {
        const lng = language.iso639_1 as keyof Language;
        if (lng) {
          const emptyObj = new languageObj("", 0, 0);
          const keyValuePair = { [lng]: emptyObj };

          organization.languages?.push(keyValuePair);
        }
      });

      //  uwarunkuj scernariusz dla klucza others
      if (newObjKey !== "others") {
        for (let i = 0; i < clonedTP.length; i++) {
          for (let j = 0; j < usedCountries.length; j++) {
            if (clonedTP[i].name === usedCountries[j]) clonedTP.splice(i, 1);
          }
        }
      }

      // Jeśli dany język znajduje się w obiekcie languages, dodaj do tablicy countries kod alpha3code kraju, w którym jest używany, populację tego kraju do wartości population, obszar kraju do wartości area, a do name przypisz natywną nazwę tego języka.
      organization.languages?.map((language) => {
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
      });

      // Jeśli kraj należy do więcej, niż jednej organizacji,
      if (country.regionalBlocs) {
        if (country.regionalBlocs.length >= 2) {
          // umieść jego dane we wszystkich pasujących obiektach bloków. Blok other może się powtarzać.
          country.regionalBlocs.forEach((block) => {
            block.country = country;
          });
        }
      }
    });
  }

  // Dla każdej organizacji dane w tablicy currencies nie mogą się powtarzać.
  organization.currencies = uniqBy(organization.currencies, "code");

  // Dla każdej organizacji dane w tablicy countries powinny być posortowane alfabetycznie z do a.
  organization.currencies = orderBy(organization.currencies, [
    "code",
  ]).reverse();

  // zwieksz licze total area w zaleznosci od uzywanych jezykow
  organization.languages?.forEach((language) => {
    const [value] = Object.values(language);
    totalLanguagesArea = value.area++;
  });

  if (organization.population) {
    organisationsDensity.push(organization.population / totalLanguagesArea);
    organisationsAreas.push(totalLanguagesArea);
  }

  organisationsCountries.push(countriesCount);

  if (organization.population) {
    organisationsPop.push(organization.population);
  }

  if (organization.languages) {
    organisationsLanguages.push(organization.languages);
  }

  if (organization.currencies) {
    organisationsCurrencies.push(organization.currencies);
  }
};
assingValuesToObj(EUCountries, countriesInUnionsObj, "EU");
assingValuesToObj(NAFTACountries, countriesInUnionsObj, "NAFTA");
assingValuesToObj(AUCountries, countriesInUnionsObj, "AU");

// Jeśli kraj nie należy do żadnej z podanych wcześniej organizacji wykonaj kroki z poprzednich dwóch punktów, ale dane umieść w tablicy other. (LANGUAGES)
assingValuesToObj(clonedTP, countriesInUnionsObj, "others");
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// WYŚWIETL:
organisationsPop.forEach((pop) => {
  if (pop >= biggestOrg) biggestOrg = pop;
});
const popIndex = organisationsPop.indexOf(biggestOrg);
// console.log('Nazwę organizacji o największej populacji',organisationsNames[popIndex]);

const sorted = organisationsDensityCopy.sort((a: number, b: number) => b - a);
const secondMostDensed = sorted[1];
const densityIndex = organisationsDensity.indexOf(secondMostDensed);
// console.log(
//   "Nazwę organizacji o drugiej największej gęstości zaludnienia",
//   organisationsNames[densityIndex]
// );

organisationsAreas.forEach((org) => {
  if (org >= biggestArea) {
    biggestArea = org;
  }
});
const areaIndex = organisationsAreas.indexOf(biggestArea);
// console.log(
//   "Nazwę organizacji zajmującej trzeci największy obszar",
//   organisationsNames[areaIndex]
// );

organisationsLanguages.forEach((language) => {
  if (maxLanguages >= language.length) {
    minLanguages = language.length;
    const index = organisationsLanguages.indexOf(language);
    // console.log(
    //   "Nazwy organizacji o najmniejszej przypisanej do nich liczbie języków",
    //   organisationsNames[index]
    // );
  }

  if (minLanguages <= language.length) {
    maxLanguages = language.length;
    const index = organisationsLanguages.indexOf(language);
    // console.log(
    //   "Nazwy organizacji o największej przypisanej do nich liczbie języków",
    //   organisationsNames[index]
    // );
  }
});

organisationsLanguages.find((language) => {
  if (language.length === minLanguages) {
    console.log(language);
    const index = organisationsLanguages.indexOf(language);
    // console.log(
    //   'Nazwy organizacji o najmniejszej przypisanej do nich liczbie języków"',
    //   organisationsNames[index]
    // );
  }

  if (language.length === maxLanguages) {
    const index = organisationsLanguages.indexOf(language);
    // console.log(
    //   "Nazwy organizacji o największej przypisanej do nich liczbie języków",
    //   organisationsNames[index]
    // );
  }

  // Natywną nazwę języka wykorzystywanego w największej liczbie krajów,
  console.log(language);
  // Znajdż język używany w największej liczbie krajow

  // Wyświetl jego natywną nazwę
});

organisationsCurrencies.forEach((currency) => {
  // console.log(currency.length);
  if (currency.length >= currenciesCount) currenciesCount = currency.length;
});

organisationsCurrencies.find((currency) => {
  if (currency.length === currenciesCount) {
    const index = organisationsCurrencies.indexOf(currency);
    // console.log(
    //   "Nazwę organizacji wykorzystującej największą liczbę walut,",
    //   organisationsNames[index]
    // );
  }
});

organisationsCountries.forEach((org) => {
  if (org <= maxCountries) maxCountries = org;
});
const maxCountriesIndex = organisationsCountries.indexOf(maxCountries);
// console.log(
//   "Nazwę organizacji posiadającej najmniejszą liczbę państw członkowskich",
//   organisationsNames[maxCountriesIndex]
// );

console.log(countriesInUnionsObj);
console.log(organisationsNames);
console.log(organisationsCountries);

// Natywną nazwę języka wykorzystywanego w największej liczbie krajów,
const flatOrganizationsLanguages = organisationsLanguages.flat();
console.log(flatOrganizationsLanguages);
flatOrganizationsLanguages.find((language) => {
  // console.log(language);
  const [value] = Object.values(language);
  // console.log(value);
  if (value.name) countriesNamesFromLanguages.push(value.name);
  for (let l = 0; l <= countriesNamesFromLanguages.length - 1; l++) {
    // console.log(countriesNamesFromLanguages[l]);
    for (let m = 0; m <= countriesNames.length - 1; m++) {
      if (countriesNamesFromLanguages[l] === countriesNames[m]) a++;
    }
  }
});

console.log("countriesNamesFromLanguages", countriesNamesFromLanguages);
// console.log("countriesNames", countriesNames);
// console.log("usedCountries", usedCountries);
// if()
const arr: any[] = [];
let a = 0;
countriesNamesFromLanguages.forEach((name) => {
  arr.push({ [name]: a });
});

// for (let l = 0; l <= countriesNamesFromLanguages.length - 1; l++) {
//   // console.log(countriesNamesFromLanguages[l]);
//   for (let m = 0; m <= countriesNames.length - 1; m++) {
//     if (countriesNamesFromLanguages[l] !== countriesNames[m])
//       console.log("aaaaa");
//   }
// }
// console.log(arr);
// Natywną nazwę języka wykorzystywanego przez najmniejszą liczbę ludzi,
// Natywne nazwy języków wykorzystywanych na największym i najmniejszym obszarze.
// W przypadku remisów wyświetl wszystkich zwycięzców.
