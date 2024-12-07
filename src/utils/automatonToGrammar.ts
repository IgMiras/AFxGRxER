import { FiniteAutomaton, RegularGrammar } from '../types/automata';

export function convertAutomatonToGrammar(fa: FiniteAutomaton): RegularGrammar {
    const nonTerminals = fa.states.map((s) => s.id);
    const startSymbol =
        fa.states.find((s) => s.isInitial)?.id || nonTerminals[0];

    // Inicializa produções vazias
    const productions: { [key: string]: string[] } = {};
    nonTerminals.forEach((nt) => {
        productions[nt] = [];
    });

    // Cada transição q -a-> p gera uma produção q -> a p
    fa.transitions.forEach((t) => {
        // Se o estado de destino é um estado válido, adiciona a produção
        // A produção é terminal + não-terminal (ou só terminal caso o estado seja final?)
        const toState = fa.states.find((s) => s.id === t.to);
        const production = toState ? t.symbol + toState.id : t.symbol;
        productions[t.from].push(production);
    });

    // Para cada estado de aceitação adiciona ε
    fa.states
        .filter((s) => s.isAccepting)
        .forEach((acceptingState) => {
            productions[acceptingState.id].push('ε');
        });

    return {
        nonTerminals,
        terminals: fa.alphabet,
        productions,
        startSymbol,
    };
}
