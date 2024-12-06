import { FiniteAutomaton } from '../types/automata';
import { RegExp } from '../types/regex';

export function convertAutomatonToRegex(automaton: FiniteAutomaton): RegExp {
    if (automaton.transitions.length === 0) {
        return { pattern: 'ε' };
    }

    const patterns = automaton.transitions.map((transition) => {
        const fromState = automaton.states.find(
            (s) => s.id === transition.from
        );
        const toState = automaton.states.find((s) => s.id === transition.to);

        if (fromState?.isInitial && toState?.isAccepting) {
            return transition.symbol;
        } else if (fromState?.isInitial) {
            return `${transition.symbol}${toState?.id}`;
        } else if (toState?.isAccepting) {
            return `${fromState?.id}${transition.symbol}`;
        } else {
            return `${fromState?.id}${transition.symbol}${toState?.id}`;
        }
    });

    return {
        pattern: patterns.join('|'),
    };
}
