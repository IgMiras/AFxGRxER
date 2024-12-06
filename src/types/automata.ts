import { RegExp } from './regex';

export interface State {
  id: string;
  isInitial: boolean;
  isAccepting: boolean;
}

export interface Transition {
  from: string;
  to: string;
  symbol: string;
}

export interface FiniteAutomaton {
  states: State[];
  alphabet: string[];
  transitions: Transition[];
}

export interface RegularGrammar {
  nonTerminals: string[];
  terminals: string[];
  productions: { [key: string]: string[] };
  startSymbol: string;
}

export type ConversionType = 'AF' | 'GR' | 'ER';