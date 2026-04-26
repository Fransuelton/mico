import { parse } from "./mico.js";

const globalEnv = {
  "+": (a, b) => a + b,
  "-": (a, b) => a - b,
  "*": (a, b) => a * b,
  "/": (a, b) => a / b,
  ">": (a, b) => a > b,
  "<": (a, b) => a < b,
  "=": (a, b) => a === b,
};

function evaluate(ast, env) {
  if (typeof ast === "number") {
    return ast;
  }

  if (typeof ast === "string") {
    if (env[ast] === undefined) {
      throw new Error(`Symbol not defined: ${ast}`);
    }

    return env[ast];
  }

  if (Array.isArray(ast)) {
    const func = evaluate(ast[0], env);
    const args = ast.slice(1).map((arg) => evaluate(arg, env));
    return func(...args);
  }

  throw new Error("Invalid AST");
}

console.log(evaluate(parse("(+ 1 2)"), globalEnv));
// Esperado: 3

console.log(evaluate(parse("(+ 1 (* 2 3))"), globalEnv));
// Esperado: 7

console.log(evaluate(parse("(- 10 (/ 20 4))"), globalEnv));
// Esperado: 5

console.log(evaluate(parse("(> 5 3)"), globalEnv));
// Esperado: true