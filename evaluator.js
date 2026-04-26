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
    const op = ast[0];

    if (op === "define") {
      const name = ast[1];
      const value = evaluate(ast[2], env);
      env[name] = value;
      return undefined;
    }

    if (op === "if") {
      const value = evaluate(ast[1], env);
      return value ? evaluate(ast[2], env) : evaluate(ast[3], env);
    }
    if (op === "lambda") {
      const params = ast[1]; // ["n"]
      const body = ast[2]; // ["*", "n", "n"]

      return (...args) => {
        const newEnv = { ...env };

        for (let i = 0; i < params.length; i++) {
          newEnv[params[i]] = args[i];
        }

        return evaluate(body, newEnv);
      };
    }

    const func = evaluate(ast[0], env);
    const args = ast.slice(1).map((arg) => evaluate(arg, env));
    return func(...args);
  }

  throw new Error("Invalid AST");
}

// console.log(evaluate(parse("(+ 1 2)"), globalEnv));
// // Esperado: 3

// console.log(evaluate(parse("(+ 1 (* 2 3))"), globalEnv));
// // Esperado: 7

// console.log(evaluate(parse("(- 10 (/ 20 4))"), globalEnv));
// // Esperado: 5

// console.log(evaluate(parse("(> 5 3)"), globalEnv));
// // Esperado: true

console.log(evaluate(parse("(if (> 5 3) 100 200)"), globalEnv)); // 100
console.log(evaluate(parse("(if (< 5 3) 100 200)"), globalEnv)); // 200
evaluate(parse("(define x 10)"), globalEnv);
console.log(evaluate(parse("(if (> x 5) (+ x 1) 0)"), globalEnv)); // 11 (x ainda vale 10)

evaluate(parse("(define square (lambda (n) (* n n)))"), globalEnv);
console.log(evaluate(parse("(square 5)"), globalEnv)); // 25

evaluate(parse("(define add (lambda (a b) (+ a b)))"), globalEnv);
console.log(evaluate(parse("(add 3 4)"), globalEnv)); // 7

// O teste que mata a charada (junta tudo):
evaluate(parse("(define x 10)"), globalEnv);
console.log(evaluate(parse("(if (> x 5) (square x) 0)"), globalEnv)); // 100
