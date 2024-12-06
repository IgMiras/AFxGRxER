import React, { useState } from 'react';
import { ArrowRightLeft } from 'lucide-react';
import { AutomatonInput } from './components/AutomatonInput';
import { GrammarInput } from './components/GrammarInput';
import { RegexInput } from './components/RegexInput';
import { convertAutomatonToGrammar } from './utils/automatonToGrammar';
import { convertGrammarToAutomaton } from './utils/grammarToAutomaton';
import { convertRegexToAutomaton } from './utils/regexToAutomaton';
import { convertAutomatonToRegex } from './utils/automatonToRegex';
import { FiniteAutomaton, RegularGrammar, ConversionType } from './types/automata';
import { RegExp } from './types/regex';

function App() {
  const [inputType, setInputType] = useState<ConversionType>('AF');
  const [outputType, setOutputType] = useState<ConversionType>('GR');
  
  const [automaton, setAutomaton] = useState<FiniteAutomaton>({
    states: [],
    alphabet: [],
    transitions: []
  });

  const [grammar, setGrammar] = useState<RegularGrammar>({
    nonTerminals: [],
    terminals: [],
    productions: {},
    startSymbol: ''
  });

  const [regex, setRegex] = useState<RegExp>({
    pattern: ''
  });

  const handleConversion = () => {
    if (inputType === outputType) return;

    if (inputType === 'AF') {
      if (outputType === 'GR') {
        setGrammar(convertAutomatonToGrammar(automaton));
      } else {
        setRegex(convertAutomatonToRegex(automaton));
      }
    } else if (inputType === 'GR') {
      const convertedAutomaton = convertGrammarToAutomaton(grammar);
      if (outputType === 'AF') {
        setAutomaton(convertedAutomaton);
      } else {
        setRegex(convertAutomatonToRegex(convertedAutomaton));
      }
    } else {
      const convertedAutomaton = convertRegexToAutomaton(regex);
      if (outputType === 'AF') {
        setAutomaton(convertedAutomaton);
      } else {
        setGrammar(convertAutomatonToGrammar(convertedAutomaton));
      }
    }
  };

  const renderInput = () => {
    switch (inputType) {
      case 'AF':
        return <AutomatonInput automaton={automaton} onChange={setAutomaton} />;
      case 'GR':
        return <GrammarInput grammar={grammar} onChange={setGrammar} />;
      case 'ER':
        return <RegexInput regex={regex} onChange={setRegex} />;
    }
  };

  const renderOutput = () => {
    switch (outputType) {
      case 'AF':
        return <AutomatonInput automaton={automaton} onChange={setAutomaton} />;
      case 'GR':
        return <GrammarInput grammar={grammar} onChange={setGrammar} />;
      case 'ER':
        return <RegexInput regex={regex} onChange={setRegex} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Conversor de Linguagens Regulares
        </h1>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Entrada
              </label>
              <select
                value={inputType}
                onChange={(e) => setInputType(e.target.value as ConversionType)}
                className="w-full border rounded px-3 py-2"
              >
                <option value="AF">Autômato Finito</option>
                <option value="GR">Gramática Regular</option>
                <option value="ER">Expressão Regular</option>
              </select>
            </div>
            <div className="flex items-center justify-center">
              <ArrowRightLeft size={24} className="text-gray-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Saída
              </label>
              <select
                value={outputType}
                onChange={(e) => setOutputType(e.target.value as ConversionType)}
                className="w-full border rounded px-3 py-2"
              >
                <option value="AF">Autômato Finito</option>
                <option value="GR">Gramática Regular</option>
                <option value="ER">Expressão Regular</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Entrada</h2>
            {renderInput()}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Saída</h2>
            {renderOutput()}
            <button
              onClick={handleConversion}
              className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center justify-center gap-2"
            >
              <ArrowRightLeft size={20} />
              Converter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;