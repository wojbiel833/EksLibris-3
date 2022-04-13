import { CONFIG } from "../config";
import { Country, CountriesObj, RegionalBlocs, SetKey } from "./interfaces";

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
  const itemString = localStorage.getItem(key)!;
  const dateExpiry = JSON.parse(itemString);

  return checkIfDataExpired(dateExpiry.expiry, now);
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
    });
  } else {
    console.log("No data in local storage!");
  }
  return countriesEU;
};
const countriesEUOutput: Country[] = getCountriesFrom(countriesLS);

// Z uzyskanej w ten sposób tablicy usuń wszystkie państwa posiadające w swojej nazwie literę a.
export const getCountriesWithoutLetter = (
  countries: Country[],
  letter: string = "a"
) => countries.filter((country) => !country.name.includes(letter));

const countriesWitroutA: Country[] =
  getCountriesWithoutLetter(countriesEUOutput);

// Z uzyskanej w ten sposób tablicy posortuj państwa według populacji, tak by najgęściej zaludnione znajdowały się na górze listy.
const setKey: typeof SetKey = function (country, key) {
  return country[key];
};

export const sortCountriesByParameter = (
  countries: Country[],
  parameter: keyof Country = "population"
) => {
  const populations: any[] = [];
  countries.forEach((country) => {
    const param = setKey(country, parameter);
    populations.push(param);
  });

  return populations.sort((a: number, b: number) => b - a);
};

const sortedCountries = sortCountriesByParameter(countriesWitroutA);

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

// Sprawdź języki przypisane do kraju. Użyj ich kodu iso639_1 jako klucza dla obiektu languages. Jeśli danego języka nie ma w obiekcie languages, przypisz do niego nowy obiekt o kluczach countries (wartość początkowa: pusta arajka), population (0), area (0) oraz name (pusty string). Jeśli dany język znajduje się w obiekcie languages, dodaj do tablicy countries kod alpha3code kraju, w którym jest używany, populację tego kraju do wartości population, obszar kraju do wartości area, a do name przypisz natywną nazwę tego języka.
// Jeśli kraj nie należy do żadnej z podanych wcześniej organizacji wykonaj kroki z poprzednich dwóch punktów, ale dane umieść w tablicy other.
// Jeśli kraj należy do więcej, niż jednej organizacji, umieść jego dane we wszystkich pasujących obiektach bloków. Blok other może się powtarzać.
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

const countriesObj: CountriesObj = {
  EU: {
    countries: [],
    population: 0,
    languages: {},
    currencies: [],
  },
  NAFTA: {
    countries: [],
    population: 0,
    languages: {},
    currencies: [],
  },
  AU: {
    countries: [],
    population: 0,
    languages: {},
    currencies: [],
  },
  others: {
    countries: [],
    population: 0,
    languages: {},
    currencies: [],
  },
};

// W TP znajdź kraje należące do EU, NAFTA albo AU. Jeśli państwo należy do którejś z tych grup, umieść jego dane w stosownym obiekcie:

const EUCountries = getCountriesFrom(countriesLS, "EU")!;

EUCountries.forEach((country) => {
  // natywną nazwę w tablicy countries,
  countriesObj.EU.countries?.push(country.name);
  // używane przez nią waluty w tablicy currencies

  country.currencies?.forEach((currency) =>
    countriesObj.EU.currencies?.push(currency)
  );
  // dodaj jej populację do wartości population.
  countriesObj.EU.population! += country.population;
});

console.log(countriesObj);
