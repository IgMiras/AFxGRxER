export interface RegExp {
  pattern: string;
}

export interface RegExpToken {
  type: 'CHAR' | 'UNION' | 'CONCAT' | 'STAR' | 'PLUS' | 'OPTIONAL' | 'GROUP';
  value: string;
  left?: RegExpToken;
  right?: RegExpToken;
}