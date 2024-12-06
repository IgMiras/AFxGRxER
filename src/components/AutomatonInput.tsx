import React from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';
import { FiniteAutomaton, State, Transition } from '../types/automata';

interface AutomatonInputProps {
  automaton: FiniteAutomaton;
  onChange: (automaton: FiniteAutomaton) => void;
}

export function AutomatonInput({ automaton, onChange }: AutomatonInputProps) {
  const addState = () => {
    const newState: State = {
      id: `q${automaton.states.length}`,
      isInitial: automaton.states.length === 0,
      isAccepting: false
    };
    onChange({
      ...automaton,
      states: [...automaton.states, newState]
    });
  };

  const addTransition = () => {
    if (automaton.states.length < 2) return;
    const newTransition: Transition = {
      from: automaton.states[0].id,
      to: automaton.states[1].id,
      symbol: automaton.alphabet[0] || 'a'
    };
    onChange({
      ...automaton,
      transitions: [...automaton.transitions, newTransition]
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Estados</h3>
        <div className="space-y-2">
          {automaton.states.map((state, index) => (
            <div key={state.id} className="flex items-center gap-4">
              <input
                type="text"
                value={state.id}
                onChange={(e) => {
                  const newStates = [...automaton.states];
                  newStates[index] = { ...state, id: e.target.value };
                  onChange({ ...automaton, states: newStates });
                }}
                className="border rounded px-2 py-1 w-24"
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={state.isInitial}
                  onChange={(e) => {
                    const newStates = automaton.states.map(s => ({
                      ...s,
                      isInitial: s.id === state.id ? e.target.checked : false
                    }));
                    onChange({ ...automaton, states: newStates });
                  }}
                />
                Inicial
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={state.isAccepting}
                  onChange={(e) => {
                    const newStates = [...automaton.states];
                    newStates[index] = { ...state, isAccepting: e.target.checked };
                    onChange({ ...automaton, states: newStates });
                  }}
                />
                Final
              </label>
              <button
                onClick={() => {
                  onChange({
                    ...automaton,
                    states: automaton.states.filter(s => s.id !== state.id),
                    transitions: automaton.transitions.filter(
                      t => t.from !== state.id && t.to !== state.id
                    )
                  });
                }}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={addState}
          className="mt-2 flex items-center gap-2 text-blue-500 hover:text-blue-700"
        >
          <PlusCircle size={20} /> Adicionar Estado
        </button>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Alfabeto</h3>
        <input
          type="text"
          value={automaton.alphabet.join(',')}
          onChange={(e) => {
            const newAlphabet = e.target.value.split(',').map(s => s.trim());
            onChange({ ...automaton, alphabet: newAlphabet });
          }}
          placeholder="Digite os símbolos separados por vírgula"
          className="border rounded px-2 py-1 w-full"
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Transições</h3>
        <div className="space-y-2">
          {automaton.transitions.map((transition, index) => (
            <div key={index} className="flex items-center gap-4">
              <select
                value={transition.from}
                onChange={(e) => {
                  const newTransitions = [...automaton.transitions];
                  newTransitions[index] = { ...transition, from: e.target.value };
                  onChange({ ...automaton, transitions: newTransitions });
                }}
                className="border rounded px-2 py-1"
              >
                {automaton.states.map(state => (
                  <option key={state.id} value={state.id}>
                    {state.id}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={transition.symbol}
                onChange={(e) => {
                  const newTransitions = [...automaton.transitions];
                  newTransitions[index] = { ...transition, symbol: e.target.value };
                  onChange({ ...automaton, transitions: newTransitions });
                }}
                className="border rounded px-2 py-1 w-20"
              />
              <select
                value={transition.to}
                onChange={(e) => {
                  const newTransitions = [...automaton.transitions];
                  newTransitions[index] = { ...transition, to: e.target.value };
                  onChange({ ...automaton, transitions: newTransitions });
                }}
                className="border rounded px-2 py-1"
              >
                {automaton.states.map(state => (
                  <option key={state.id} value={state.id}>
                    {state.id}
                  </option>
                ))}
              </select>
              <button
                onClick={() => {
                  onChange({
                    ...automaton,
                    transitions: automaton.transitions.filter((_, i) => i !== index)
                  });
                }}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={addTransition}
          className="mt-2 flex items-center gap-2 text-blue-500 hover:text-blue-700"
        >
          <PlusCircle size={20} /> Adicionar Transição
        </button>
      </div>
    </div>
  );
}