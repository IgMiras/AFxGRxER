import { FiniteAutomaton, State, Transition } from '../types/automata';
import { RegExp } from '../types/regex';

export function convertRegexToAutomaton(regex: RegExp): FiniteAutomaton {
    // Estado inicial q0 e estado final qf
    const states: State[] = [
        { id: 'q0', isInitial: true, isAccepting: false },
        { id: 'qf', isInitial: false, isAccepting: true },
    ];
    const transitions: Transition[] = [];

    // Supondo que a regex seja uma união de alternativas simples separadas por |
    // e que cada alternativa seja uma sequência de símbolos terminais sem operadores
    const alternatives = regex.pattern
        .split('|')
        .filter((alt) => alt.length > 0);

    const alphabetSet = new Set<string>();

    for (const alt of alternatives) {
        let current = 'q0';
        for (let i = 0; i < alt.length; i++) {
            const symbol = alt[i];
            alphabetSet.add(symbol);

            // Se é o último símbolo dessa alternativa, transição para 'qf'
            const to = i === alt.length - 1 ? 'qf' : `q${states.length}`;
            if (to !== 'qf' && !states.find((s) => s.id === to)) {
                states.push({ id: to, isInitial: false, isAccepting: false });
            }

            transitions.push({ from: current, to, symbol });
            current = to;
        }

        // Caso a alternativa seja vazia (o que significaria aceitar ε), ligar q0 -> qf com ε
        if (alt.length === 0) {
            // Produção vazia, adiciona transição epsilon (não especificado no tipo atual)
            // Como não temos epsilon representado, podemos usar '' como símbolo
            // porém isso não faz parte do tipo original. Ajustaremos apenas se aceito.
            // Se não houver símbolos, significa q0 = qf já aceita ε se for final.
            // Nesse caso, basta q0 ser final ou qf ser q0.
            // Como já temos q0 e qf distintos, vamos simplesmente adicionar
            // uma transição com um símbolo fictício se permitido ou ignorar.
            // Ignorar por não ter epsilon no tipo atual.
        }
    }

    return {
        states,
        alphabet: Array.from(alphabetSet),
        transitions,
    };
}
