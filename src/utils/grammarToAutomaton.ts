import {
    FiniteAutomaton,
    RegularGrammar,
    State,
    Transition,
} from '../types/automata';

export function convertGrammarToAutomaton(
    grammar: RegularGrammar
): FiniteAutomaton {
    // Cria um estado para cada não-terminal
    const states: State[] = grammar.nonTerminals.map((nt) => ({
        id: nt,
        isInitial: nt === grammar.startSymbol,
        isAccepting: false,
    }));

    // Cria um estado final extra para produções que não apontam para outro não-terminal
    const finalStateId = '#';
    const acceptingState: State = {
        id: finalStateId,
        isInitial: false,
        isAccepting: true,
    };
    states.push(acceptingState);

    const transitions: Transition[] = [];

    // Para cada produção A -> xB ou A -> x, onde x é terminal e B é não-terminal
    // A -> ε torna A um estado aceitante
    for (const [from, prods] of Object.entries(grammar.productions)) {
        for (const prod of prods) {
            if (prod === 'ε') {
                // Marca o estado correspondente a `from` como aceitante
                const s = states.find((st) => st.id === from);
                if (s) s.isAccepting = true;
            } else {
                // Caso: A -> aB ou A -> a
                const symbol = prod[0]; // primeiro caractere é o terminal
                const remainder = prod.slice(1); // restante após o terminal

                let to = finalStateId;
                if (remainder) {
                    // Esperamos que remainder seja um único não-terminal (um único caracter maiúsculo)
                    to = remainder;
                }

                transitions.push({ from, to, symbol });
            }
        }
    }

    return {
        states,
        alphabet: grammar.terminals,
        transitions,
    };
}
