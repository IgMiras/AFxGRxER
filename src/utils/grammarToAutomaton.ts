import {
    FiniteAutomaton,
    RegularGrammar,
    State,
    Transition,
} from '../types/automata';

export function convertGrammarToAutomaton(
    grammar: RegularGrammar
): FiniteAutomaton {
    const states: State[] = [
        ...grammar.nonTerminals.map((nt) => ({
            id: nt,
            isInitial: nt === grammar.startSymbol,
            isAccepting: false,
        })),
        { id: 'qf', isInitial: false, isAccepting: true },
    ];

    const transitions: Transition[] = [];

    Object.entries(grammar.productions).forEach(([from, prods]) => {
        prods.forEach((production) => {
            if (production === 'ε') {
                const state = states.find((s) => s.id === from);
                if (state) {
                    state.isAccepting = true;
                }
            } else if (production.length === 1) {
                transitions.push({
                    from,
                    to: 'qf',
                    symbol: production,
                });
            } else {
                const symbol = production[0];
                const toState = production.slice(1);

                transitions.push({
                    from,
                    to: toState,
                    symbol,
                });
            }
        });
    });

    return {
        states,
        alphabet: grammar.terminals,
        transitions,
    };
}
