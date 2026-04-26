import { tokenize } from "./tokenizer.js";

export function parse(source) {
  const tokens = tokenize(source);
  return readFromTokens(tokens);
}

function readFromTokens(tokens) {
  const token = tokens.shift();

  if (token === "(") {
    let tokensList = [];

    while (tokens[0] !== ")") {
      tokensList.push(readFromTokens(tokens));
    }

    tokens.shift();
    return tokensList;
  }

  if (token === ")") {
    throw new Error("Error!");
  } else {
    const num = Number(token);
    if (!isNaN(num)) return num;
    return token;
  }
}

console.log(JSON.stringify(parse("(+ 1 2)")));
// Esperado: ["+",1,2]

console.log(JSON.stringify(parse("(+ 1 (* 2 3))")));
// Esperado: ["+",1,["*",2,3]]

console.log(JSON.stringify(parse("(define x 10)")));
// Esperado: ["define","x",10]

console.log(JSON.stringify(parse("(if (> x 5) grande pequeno)")));
// Esperado: ["if",[">","x",5],"grande","pequeno"]
