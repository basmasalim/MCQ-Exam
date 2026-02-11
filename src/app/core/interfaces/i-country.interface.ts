export interface ICountry {
  flags: Flags;
  name: Name;
  cca2: string;
  idd: Idd;
}

export interface Flags {
  png: string;
  svg: string;
  alt: string;
}

export interface Name {
  common: string;
  official: string;
  nativeName: NativeName;
}

export interface NativeName {
  ara: Ara;
}

export interface Ara {
  official: string;
  common: string;
}

export interface Idd {
  root: string;
  suffixes: string[];
}
