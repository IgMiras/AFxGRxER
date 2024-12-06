import React from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';
import { RegularGrammar } from '../types/automata';

interface GrammarInputProps {
  grammar: RegularGrammar;
  onChange: (grammar: RegularGrammar) => void;
}

export function GrammarInput({ grammar, onChange }: GrammarInputProps) {
  const addProduction = (nonTerminal: string) => {
    onChange({
      ...grammar,
      productions: {
        ...grammar.productions,
        [nonTerminal]: [...(grammar.productions[nonTerminal] || []), '']
      }
    });
  };

  const addNonTerminal = () => {
    const newNonTerminal = String.fromCharCode(
      65 + grammar.nonTerminals.length
    );
    onChange({
      ...grammar,
      nonTerminals: [...grammar.nonTerminals, newNonTerminal],
      productions: {
        ...grammar.productions,
        [newNonTerminal]: []
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Não-terminais</h3>
        <div className="flex flex-wrap gap-2">
          {grammar.nonTerminals.map((nt, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={nt}
                onChange={(e) => {
                  const newNonTerminals = [...grammar.nonTerminals];
                  const oldNt = newNonTerminals[index];
                  newNonTerminals[index] = e.target.value;
                  
                  const newProductions = { ...grammar.productions };
                  if (oldNt in newProductions) {
                    newProductions[e.target.value] = newProductions[oldNt];
                    delete newProductions[oldNt];
                  }
                  
                  onChange({
                    ...grammar,
                    nonTerminals: newNonTerminals,
                    productions: newProductions,
                    startSymbol: grammar.startSymbol === oldNt ? e.target.value : grammar.startSymbol
                  });
                }}
                className="border rounded px-2 py-1 w-16"
              />
              <button
                onClick={() => {
                  const newNonTerminals = grammar.nonTerminals.filter((_, i) => i !== index);
                  const newProductions = { ...grammar.productions };
                  delete newProductions[nt];
                  onChange({
                    ...grammar,
                    nonTerminals: newNonTerminals,
                    productions: newProductions,
                    startSymbol: grammar.startSymbol === nt ? newNonTerminals[0] : grammar.startSymbol
                  });
                }}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
          <button
            onClick={addNonTerminal}
            className="flex items-center gap-2 text-blue-500 hover:text-blue-700"
          >
            <PlusCircle size={20} /> Adicionar
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Terminais</h3>
        <input
          type="text"
          value={grammar.terminals.join(',')}
          onChange={(e) => {
            const newTerminals = e.target.value.split(',').map(s => s.trim());
            onChange({ ...grammar, terminals: newTerminals });
          }}
          placeholder="Digite os terminais separados por vírgula"
          className="border rounded px-2 py-1 w-full"
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Símbolo Inicial</h3>
        <select
          value={grammar.startSymbol}
          onChange={(e) => onChange({ ...grammar, startSymbol: e.target.value })}
          className="border rounded px-2 py-1"
        >
          {grammar.nonTerminals.map(nt => (
            <option key={nt} value={nt}>
              {nt}
            </option>
          ))}
        </select>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Produções</h3>
        {grammar.nonTerminals.map(nt => (
          <div key={nt} className="mb-4">
            <h4 className="font-medium mb-2">{nt} →</h4>
            <div className="space-y-2 ml-4">
              {(grammar.productions[nt] || []).map((production, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={production}
                    onChange={(e) => {
                      const newProductions = { ...grammar.productions };
                      newProductions[nt][index] = e.target.value;
                      onChange({ ...grammar, productions: newProductions });
                    }}
                    className="border rounded px-2 py-1"
                    placeholder="Digite a produção"
                  />
                  <button
                    onClick={() => {
                      const newProductions = { ...grammar.productions };
                      newProductions[nt] = newProductions[nt].filter(
                        (_, i) => i !== index
                      );
                      onChange({ ...grammar, productions: newProductions });
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
              <button
                onClick={() => addProduction(nt)}
                className="flex items-center gap-2 text-blue-500 hover:text-blue-700"
              >
                <PlusCircle size={20} /> Adicionar Produção
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}