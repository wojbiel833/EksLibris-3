export type RegionalBlocs = {
  regionalBlocs: [] | { acronym: string };
  acronym: string;
};

interface Currencies {
  code: string;
}

export interface Country {
  name: string;
  population: number;
  regionalBlocs?: RegionalBlocs[];
  countries?: string[];
  languages?: [];
  currencies?: Currencies[];
}

export interface CountriesInUnionsObj {
  EU: Partial<Country>;
  NAFTA: Partial<Country>;
  AU: Partial<Country>;
  others: Partial<Country>;
}

export function SetKey<A extends Country | Partial<CountriesInUnionsObj>>(
  object: A,
  key: keyof A
): A[keyof A] {
  return object[key];
}
