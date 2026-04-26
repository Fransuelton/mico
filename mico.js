import { tokenize } from "./tokenizer.js";

console.log(tokenize("(+ 1 2)"));
console.log(tokenize("(+ 1 (* 2 3))"));
console.log(tokenize("(define x 10)"));
console.log(tokenize("  (  + 1   2  )  "));
