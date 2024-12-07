import { FiniteAutomaton, Transition } from '../types/automata';
import { RegExp } from '../types/regex';

function eliminateState(fa: FiniteAutomaton, stateId: string): FiniteAutomaton {
    const transitions: Transition[] = fa.transitions.filter(
        (t) => t.from !== stateId && t.to !== stateId
    );
    const loop = fa.transitions.find(
        (t) => t.from === stateId && t.to === stateId
    );
    const loopPattern = loop ? `(${loop.symbol})*` : '';

    const newTransitions: Transition[] = [];

    fa.transitions.forEach((t1) => {
        if (t1.to === stateId) {
            fa.transitions.forEach((t2) => {
                if (t2.from === stateId) {
                    newTransitions.push({
                        from: t1.from,
                        to: t2.to,
                        symbol: `${t1.symbol}${loopPattern}${t2.symbol}`,
                    });
                }
            });
        }
    });

    return {
        ...fa,
        transitions: [...transitions, ...newTransitions],
    };
}

export function convertAutomatonToRegex(automaton: FiniteAutomaton): RegExp {
    let fa = { ...automaton };

    while (fa.states.length > 2) {
        const removableState = fa.states.find(
            (s) => !s.isInitial && !s.isAccepting
        );
        if (!removableState) break;
        fa = eliminateState(fa, removableState.id);
    }

    const regexPattern = fa.transitions.map((t) => t.symbol).join('|');

    return { pattern: regexPattern };
}
