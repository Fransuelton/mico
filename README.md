# Mico

> A tiny Lisp-flavored interpreter built from scratch in JavaScript.

Mico is a minimal programming language with first-class functions, closures, and Lisp-style syntax, implemented in under 100 lines of JavaScript. It was built in a single Sunday as a learning project to understand how interpreters work under the hood.

## ✨ Features

- **Arithmetic**: `+`, `-`, `*`, `/`
- **Comparisons**: `>`, `<`, `=`
- **Variables** with `define`
- **Conditionals** with `if`
- **First-class functions** with `lambda`
- **Lexical closures** (free of charge, courtesy of JavaScript's own closures)

## 📦 Project structure

```
mico/
├── tokenizer.js   # turns source code into a flat list of tokens
├── mico.js        # parser — turns tokens into an AST
├── evaluator.js   # evaluator + global environment (entry point)
├── README.md
├── LICENSE
└── .gitignore
```

## 🚀 Quick start

```bash
git clone https://github.com/fransuelton/mico.git
cd mico
node evaluator.js
```

## 📖 Syntax overview

Mico uses Lisp-style S-expressions: every operation is a parenthesized list where the first element is the operator.

### Arithmetic

```scheme
(+ 1 2)              ; => 3
(+ 1 (* 2 3))        ; => 7
(- 10 (/ 20 4))      ; => 5
```

### Variables

```scheme
(define x 10)
(+ x 5)              ; => 15
```

### Conditionals

```scheme
(if (> 5 3) 100 200) ; => 100
(if (< 5 3) 100 200) ; => 200
```

### Functions

```scheme
(define square (lambda (n) (* n n)))
(square 5)           ; => 25

(define add (lambda (a b) (+ a b)))
(add 3 4)            ; => 7
```

### Putting it all together

```scheme
(define x 10)
(define square (lambda (n) (* n n)))
(if (> x 5) (square x) 0)  ; => 100
```

## 🧠 How it works

Mico follows the canonical three-stage pipeline of dynamic language interpreters:

```
source code → TOKENIZER → tokens → PARSER → AST → EVALUATOR → value
```

### 1. Tokenizer

Splits the raw source string into a flat list of tokens. Lisp's parenthesis-only syntax makes this surprisingly simple — just pad the parens with spaces and split on whitespace.

```js
"(+ 1 (* 2 3))"  →  ["(", "+", "1", "(", "*", "2", "3", ")", ")"]
```

### 2. Parser

Recursively transforms the flat token list into a nested array — the Abstract Syntax Tree (AST). Numbers are converted; symbols stay as strings.

```js
["(", "+", "1", "(", "*", "2", "3", ")", ")"]
                     ↓
["+", 1, ["*", 2, 3]]
```

### 3. Evaluator

A recursive `evaluate(ast, env)` function that walks the tree:

- **Numbers** evaluate to themselves
- **Symbols** are looked up in the environment
- **Arrays** are function calls — evaluate the head as a function, evaluate the args, apply

Three constructs are **special forms** (their arguments are not eagerly evaluated):

- `define` — would fail if the new name were resolved before binding
- `if` — must only evaluate the chosen branch
- `lambda` — body and parameters must remain unevaluated until the function is called

## 💡 Closures, for free

Lambda implementation is essentially:

```js
return (...args) => {
  const newEnv = { ...env };
  params.forEach((p, i) => { newEnv[p] = args[i]; });
  return evaluate(body, newEnv);
};
```

The returned arrow function **captures** `env` from the enclosing scope. JavaScript's own closure mechanism gives Mico lexical scoping for free — no extra code needed.

This is a beautiful pattern in interpreter design: the host language donates capabilities to the hosted one.

## 🛣️ Roadmap

Possible future directions, if I revisit this:

- [ ] Interactive REPL
- [ ] String literals
- [ ] List primitives (`list`, `car`, `cdr`)
- [ ] `begin` for sequencing
- [ ] `let` for local scope
- [ ] Recursion examples (factorial, Fibonacci)
- [ ] Tail call optimization

## 📚 References

- [Crafting Interpreters](https://craftinginterpreters.com) by Bob Nystrom
- [SICP, Chapter 4](https://mitp-content-server.mit.edu/books/content/sectbyfn/books_pres_0/6515/sicp.zip/full-text/book/book-Z-H-26.html)
- Peter Norvig's [(How to Write a (Lisp) Interpreter (in Python))](https://norvig.com/lispy.html) — the structural inspiration

## 📝 License

MIT — feel free to fork, learn, and break things.
