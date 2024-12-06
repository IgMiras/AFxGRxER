import React from 'react';
import { RegExp } from '../types/regex';

interface RegexInputProps {
  regex: RegExp;
  onChange: (regex: RegExp) => void;
}

export function RegexInput({ regex, onChange }: RegexInputProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Expressão Regular</h3>
        <div className="space-y-4">
          <div>
            <input
              type="text"
              value={regex.pattern}
              onChange={(e) => onChange({ pattern: e.target.value })}
              placeholder="Digite a expressão regular (ex: (a|b)*abb)"
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div className="text-sm text-gray-600">
            <h4 className="font-medium mb-1">Operadores disponíveis:</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>| (união)</li>
              <li>* (fechamento de Kleene)</li>
              <li>+ (uma ou mais ocorrências)</li>
              <li>? (opcional)</li>
              <li>() (agrupamento)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}