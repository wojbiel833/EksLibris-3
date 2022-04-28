export type RegionalBlocs = {
  regionalBlocs: [] | { acronym: string };
  acronym: string;
  country: {};
};

export interface Currencies {
  code: string;
}

export interface Language {
  name?: string;
  population?: number;
  area?: number;
  languages?: string;
  iso639_1?: string;
}

export interface Country {
  name: string;
  population: number;
  area: number;
  regionalBlocs: RegionalBlocs[];
  countries?: string[];
  languages?: Language[];
  currencies?: Currencies[];
}

export interface CountriesInUnionsObj {
  EU: Partial<Country>;
  NAFTA: Partial<Country>;
  AU: Partial<Country>;
  others: Partial<Country>;
}

export function SetKey<
  A extends Country | Partial<CountriesInUnionsObj> | Language[] | Currencies
>(object: A, key: keyof A): A[keyof A] {
  return object[key];
}
