import { FiniteAutomaton, State, Transition } from '../types/automata';
import { RegExp, RegExpToken } from '../types/regex';

function tokenize(pattern: string): RegExpToken[] {
    const tokens: RegExpToken[] = [];
    let i = 0;

    while (i < pattern.length) {
        const char = pattern[i];

        switch (char) {
            case '|':
                tokens.push({ type: 'UNION', value: '|' });
                break;
            case '*':
                tokens.push({ type: 'STAR', value: '*' });
                break;
            case '+':
                tokens.push({ type: 'PLUS', value: '+' });
                break;
            case '?':
                tokens.push({ type: 'OPTIONAL', value: '?' });
                break;
            case '(':
            case ')':
                tokens.push({ type: 'GROUP', value: char });
                break;
            default:
                if (/[a-z0-9]/.test(char)) {
                    tokens.push({ type: 'CHAR', value: char });
                }
                break;
        }
        i++;
    }

    return tokens;
}

function createState(
    id: string,
    isInitial: boolean = false,
    isAccepting: boolean = false
): State {
    return { id, isInitial, isAccepting };
}

export function convertRegexToAutomaton(regex: RegExp): FiniteAutomaton {
    const tokens = tokenize(regex.pattern);

    if (tokens.length === 0) {
        return {
            states: [createState('q0', true, true)],
            alphabet: [],
            transitions: [],
        };
    }

    const states: State[] = [];
    for (let i = 0; i <= tokens.length; i++) {
        states.push(createState(`q${i}`, i === 0, i === tokens.length));
    }

    const transitions: Transition[] = [];
    tokens.forEach((token, index) => {
        if (token.type === 'CHAR') {
            transitions.push({
                from: `q${index}`,
                to: `q${index + 1}`,
                symbol: token.value,
            });
        }
    });

    const alphabet = Array.from(
        new Set(
            tokens
                .filter((token) => token.type === 'CHAR')
                .map((token) => token.value)
        )
    );

    return {
        states,
        alphabet,
        transitions,
    };
}
