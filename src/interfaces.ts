export type RegionalBlocs = {
  regionalBlocs: [] | { acronym: string };
  acronym: string;
};

export interface Country {
  name: string;
  population: number;
  regionalBlocs?: RegionalBlocs[];
  countries?: string[];
  languages?: {};
  currencies?: string[];
}

export interface CountriesObj {
  EU: Partial<Country>;
  NAFTA: Partial<Country>;
  AU: Partial<Country>;
  others: Partial<Country>;
}

export function SetKey<A extends Country>(object: A, key: keyof A): A[keyof A] {
  return object[key];
}
