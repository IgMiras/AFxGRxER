import { FiniteAutomaton, RegularGrammar } from '../types/automata';

export function convertAutomatonToGrammar(fa: FiniteAutomaton): RegularGrammar {
    const nonTerminals = fa.states.map((state) => state.id);
    const startSymbol =
        fa.states.find((state) => state.isInitial)?.id || nonTerminals[0];

    const productions: { [key: string]: string[] } = Object.fromEntries(
        nonTerminals.map((state) => [state, []])
    );

    fa.transitions.forEach((transition) => {
        const toState = fa.states.find((s) => s.id === transition.to);
        if (toState?.isAccepting) {
            productions[transition.from].push(transition.symbol);
        } else {
            productions[transition.from].push(
                transition.symbol + transition.to
            );
        }
    });

    fa.states.forEach((state) => {
        if (state.isAccepting) {
            productions[state.id].push('ε');
        }
    });

    return {
        nonTerminals,
        terminals: fa.alphabet,
        productions,
        startSymbol,
    };
}
