export type RegionalBlocs = {
  regionalBlocs: [] | { acronym: string };
  acronym: string;
};

export interface Country {
  name: string;
  population: number;
  regionalBlocs?: RegionalBlocs[];
}

export function SetKey<A extends Country>(object: A, key: keyof A): A[keyof A] {
  return object[key];
}
