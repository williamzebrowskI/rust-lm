import { Lesson } from "./types";

export const curriculum: Lesson[] = [
  // Beginner
  {
    id: "getting-started",
    title: "Getting Started & Tooling",
    level: "Beginner",
    description: "Install Rust, use cargo, and compile your first program.",
    sections: [
      {
        title: "Install Rust and hello world",
        content:
          "Install and verify the toolchain:\n- Use rustup to install/manage Rust toolchains. macOS/Linux: `curl https://sh.rustup.rs -sSf | sh`. Windows: run the Rustup installer.\n- Verify versions: `rustc --version` and `cargo --version`.\n\nCreate and run your first app:\n- New project: `cargo new myapp` (creates src/main.rs + Cargo.toml).\n- Run it: `cd myapp && cargo run` to compile and execute main.rs.\n\nMental model: Cargo is your project manager—builds, tests, docs, dependencies (like npm + a build tool). rustc is the compiler, rustup keeps them up to date.",
        quiz: [
          {
            prompt: "Which tool installs and manages Rust toolchains?",
            options: ["rustup", "pip", "npm", "brew"],
            answerIndex: 0,
            explanation: "rustup manages Rust toolchains and components.",
          },
        ],
        examples: [
          { title: "Hello world", code: "fn main() {\n    println!(\"Hello, world!\");\n}" },
          { title: "Check toolchain", code: "# shell\nrustc --version\ncargo --version" },
        ],
        exercise: {
          id: "getting-started-hello",
          prompt: "Return the classic hello string from a function.",
          starterCode: "pub fn hello() -> &'static str {\n    todo!()\n}\n\nfn main() {\n    println!(\"{}\", hello());\n}\n",
          tests: "#[cfg(test)]\nmod tests {\n    use super::*;\n    #[test]\n    fn says_hello() {\n        assert_eq!(hello(), \"Hello, world!\");\n    }\n}\n",
          checks: { mustInclude: ["hello"] },
        },
      },
      {
        title: "Toolchain channels and updates",
        content:
          "rustup can manage multiple \"channels\" of Rust:\n- `stable`: recommended for most work; updated every 6 weeks.\n- `beta`: next stable in testing.\n- `nightly`: bleeding edge; needed for some experimental features.\n\nCommon rustup commands:\n- `rustup update`: update the default toolchain.\n- `rustup default stable`: switch your default channel.\n- `rustup toolchain list`: see which channels are installed.\n\nMental model: you usually live on stable, but you can install beta/nightly side-by-side without breaking your main toolchain.",
        quiz: [
          {
            prompt: "Which channel should beginners usually use as their default?",
            options: ["stable", "beta", "nightly", "none"],
            answerIndex: 0,
            explanation: "stable is tested and updated regularly; it is the recommended default.",
          },
        ],
        examples: [
          {
            title: "Switching channels",
            code: "# shell\nrustup default stable\nrustup update\nrustup toolchain list",
          },
        ],
        exercise: {
          id: "getting-started-channel",
          prompt: "Return true if the given channel name is one of \"stable\", \"beta\", or \"nightly\".",
          starterCode:
            "pub fn is_supported_channel(name: &str) -> bool {\n    // treat \"stable\", \"beta\", and \"nightly\" as supported channels\n    todo!()\n}\n\nfn main() {}\n",
          tests:
            "#[cfg(test)]\nmod tests {\n    use super::*;\n    #[test]\n    fn recognises_known_channels() {\n        assert!(is_supported_channel(\"stable\"));\n        assert!(is_supported_channel(\"beta\"));\n        assert!(is_supported_channel(\"nightly\"));\n    }\n    #[test]\n    fn rejects_unknown_channels() {\n        assert!(!is_supported_channel(\"dev\"));\n        assert!(!is_supported_channel(\"\"));\n    }\n}\n",
          checks: { mustNotInclude: ["todo!"] },
        },
      },
      {
        title: "Cargo workflow",
        content:
          "Core commands to know:\n- `cargo build`: compile the project (artifacts go in target/).\n- `cargo run`: build and then run the main binary.\n- `cargo test`: run all #[test] functions.\n- `cargo check`: fast type-check without producing binaries.\n\nDependencies live in Cargo.toml under [dependencies]. Build outputs live in target/. Get comfortable running build/test in the project root.",
        quiz: [
          {
            prompt: "What does cargo run do?",
            options: ["Builds and runs", "Formats code", "Uploads crate", "Deletes target"],
            answerIndex: 0,
            explanation: "cargo run builds and executes the binary target.",
          },
        ],
        examples: [
          {
            title: "Cargo.toml snippet",
            code: "[package]\nname = \"hello\"\nversion = \"0.1.0\"\nedition = \"2021\"\n\n[dependencies]\nrand = \"0.8\"",
          },
          { title: "Common commands", code: "cargo build\ncargo run\ncargo test" },
        ],
        exercise: {
          id: "getting-started-cargo-commands",
          prompt: "Map a cargo subcommand name (\"build\", \"run\", \"test\", or \"check\") to a short description.",
          starterCode:
            "pub fn describe_cargo(cmd: &str) -> &'static str {\n    // return a short description such as \"compile only\" or \"build and run\"\n    todo!()\n}\n\nfn main() {}\n",
          tests:
            "#[cfg(test)]\nmod tests {\n    use super::*;\n    #[test]\n    fn describes_known_commands() {\n        assert!(describe_cargo(\"build\").contains(\"compile\"));\n        assert!(describe_cargo(\"run\").contains(\"run\"));\n        assert!(describe_cargo(\"test\").contains(\"test\"));\n        assert!(describe_cargo(\"check\").contains(\"type\"));\n    }\n    #[test]\n    fn handles_unknown() {\n        assert_eq!(describe_cargo(\"fmt\"), \"unknown command\");\n    }\n}\n",
          checks: { mustNotInclude: ["todo!"] },
        },
      },
      {
        title: "fmt, doc, and test",
        content:
          "Quality tools built in:\n- `cargo fmt`: auto-format your code with rustfmt.\n- `cargo clippy -- -D warnings`: lint with smart suggestions, fail on warnings.\n- `cargo test`: run all unit/integration tests.\n- `cargo doc --open`: build and open API docs.\n\nDoc comments start with `///` and appear in `cargo doc`. Run fmt and clippy early to keep code clean.",
        quiz: [
          {
            prompt: "Which command formats Rust code?",
            options: ["cargo fmt", "cargo run", "cargo doc", "cargo clippy"],
            answerIndex: 0,
            explanation: "cargo fmt runs rustfmt.",
          },
        ],
        examples: [
          {
            title: "Doc comment + test",
            code: "/// Adds one to the input.\n///\n/// Example: add_one(2) == 3\npub fn add_one(x: i32) -> i32 {\n    x + 1\n}\n\n#[test]\nfn adds_one() {\n    assert_eq!(add_one(1), 2);\n}\n",
          },
          { title: "Running clippy", code: "# shell\ncargo clippy -- -D warnings" },
        ],
        exercise: {
          id: "getting-started-docs",
          prompt: "Write a function square with a doc comment and a test.",
          starterCode: "/// Squares an i32.\npub fn square(x: i32) -> i32 {\n    todo!()\n}\n\n#[cfg(test)]\nmod tests {\n    use super::*;\n    #[test]\n    fn squares() {\n        assert_eq!(square(3), 9);\n    }\n}\n\nfn main() {}\n",
          tests: "#[cfg(test)]\nmod tests {\n    use super::*;\n    #[test]\n    fn squares() {\n        assert_eq!(square(3), 9);\n        assert_eq!(square(-2), 4);\n    }\n}\n",
        },
      },
    ],
    quiz: [
      {
        prompt: "Where is the main Rust source file for a binary crate?",
        options: ["src/main.rs", "src/lib.rs", "main.rs", "bin/main.rs"],
        answerIndex: 0,
        explanation: "Binary crates start at src/main.rs by convention.",
      },
      {
        prompt:
          "Write and run a tiny program that prints the sum of 2 + 3 with println!.\n\n```rust\nfn main() {\n    // print here\n}\n```",
        options: ["(open-ended coding prompt)", "It won't compile", "It prints nothing", "It panics"],
        answerIndex: 0,
        explanation: "Expect to see 5 when run; use println!(\"{}\", 2 + 3).",
      },
    ],
  },
  {
    id: "bindings-mutability",
    title: "Bindings and Mutability",
    level: "Beginner",
    description: "Bindings are names for values. They are immutable by default; add mut only when you truly need to change a value. Ownership lives with the binding unless you move or borrow it.",
    sections: [
      {
        title: "Immutable by default",
        content:
          "A binding is just a name for a value. By default, let makes that name immutable: you cannot change what it points to. This is Rust’s guardrail—most data never needs mutation. Keeping bindings immutable reduces bugs and makes code easier to reason about.",
        quiz: [
          {
            prompt: "What happens if you reassign an immutable binding?",
            options: ["Compile error", "Runtime panic", "Silently succeeds", "Clones value"],
            answerIndex: 0,
            explanation: "Compiler rejects reassignment without mut.",
          },
        ],
        examples: [
          {
            title: "Immutable binding",
            code: "fn main() {\n    let score = 10;\n    // score = 11; // won't compile\n    println!(\"{}\", score);\n}\n",
          },
        ],
        exercise: {
          id: "bindings-immutable",
          prompt: "Create an immutable greeting &str and return it (no mut).",
          starterCode: "pub fn greet() -> &'static str {\n    todo!()\n}\n\nfn main() {}\n",
          tests: "#[cfg(test)]\nmod tests { use super::*; #[test] fn greets() { assert_eq!(greet(), \"hello\"); } }\n",
          checks: { mustNotInclude: ["mut"] },
        },
      },
      {
        title: "Mutable bindings",
        content:
          "Mutability means the binding can change. Write let mut x = ... when you truly need to update a value through that name. Mutability affects only whether you can reassign; it does not change ownership rules. Own/borrow is one axis, mutability is another.",
        quiz: [
          {
            prompt: "How do you declare a mutable binding?",
            options: ["let mut x = 5;", "mut let x = 5;", "let x = mut 5;", "var x = 5;"],
            answerIndex: 0,
            explanation: "mut goes after let.",
          },
        ],
        examples: [
          {
            title: "Mutable binding",
            code: "fn main() {\n    let mut count = 0;\n    count += 1;\n    println!(\"{}\", count);\n}\n",
          },
          {
            title: "Reassign vs mutate",
            code: "fn main() {\n    let score = 10;\n    // score = 11; // not mutable\n    let mut lives = 3;\n    lives -= 1;\n    println!(\"lives now {}\", lives);\n}\n",
          },
        ],
        exercise: {
          id: "syntax-inc",
          prompt: "Implement increment that mutates a value then returns it.",
          starterCode: "pub fn increment(mut x: i32) -> i32 {\n    todo!()\n}\n\nfn main() {}\n",
          tests: "#[cfg(test)]\nmod tests { use super::*; #[test] fn increments() { assert_eq!(increment(1), 2); assert_eq!(increment(10), 11); } }\n",
        },
      },
      {
        title: "Mutable patterns",
        content:
          "You can mark bindings mutable when destructuring too: let (mut x, y) = (1, 2); allows x to change while y stays immutable.",
        quiz: [
          {
            prompt: "How do you make only part of a pattern mutable?",
            options: ["Place mut before that name", "Use mut once for all", "You cannot", "Use unsafe"],
            answerIndex: 0,
            explanation: "mut goes before the specific binding.",
          },
        ],
        examples: [
          {
            title: "Partial mutability",
            code: "fn main() {\n    let (mut x, y) = (5, 10);\n    x += y;\n    println!(\"{} {}\", x, y);\n}\n",
          },
        ],
        exercise: {
          id: "bindings-partial-mutable",
          prompt: "Destructure (a, b) and increment only the first element by 1.",
          starterCode: "pub fn bump_first(pair: (i32, i32)) -> (i32, i32) {\n    todo!()\n}\n\nfn main() {}\n",
          tests: "#[cfg(test)]\nmod tests { use super::*; #[test] fn bumps_first() { assert_eq!(bump_first((1,2)), (2,2)); } }\n",
          checks: { mustInclude: ["mut"] },
        },
      },
      {
        title: "Shadowing vs mutability",
        content:
          "Shadowing creates a new binding; mutability changes an existing one. Use shadowing to change type/shape (string to number) and mutability to update in place when the type stays the same.",
        quiz: [
          {
            prompt: "When prefer shadowing?",
            options: ["When changing type", "Never", "Only with unsafe", "To mutate arrays"],
            answerIndex: 0,
            explanation: "Shadowing is great for type-changing transformations.",
          },
        ],
        examples: [
          {
            title: "Shadow to change type",
            code: "fn main() {\n    let spaces = \"   \";\n    let spaces = spaces.len();\n    println!(\"{}\", spaces);\n}\n",
          },
        ],
        exercise: {
          id: "bindings-shadow-parse",
          prompt: "Take a &str number, shadow it into an i32, and add 10.",
          starterCode: "pub fn parse_and_add_ten(input: &str) -> i32 {\n    todo!()\n}\n\nfn main() {}\n",
          tests: "#[cfg(test)]\nmod tests { use super::*; #[test] fn adds_ten() { assert_eq!(parse_and_add_ten(\"5\"), 15); } }\n",
          checks: { mustInclude: ["let"] },
        },
      },
    ],
    quiz: [
      { prompt: "What keyword makes a binding mutable?", options: ["mut", "let", "var", "dyn"], answerIndex: 0, explanation: "Rust requires mut for mutation." },
      { prompt: "Does mut change ownership rules?", options: ["No", "Yes, copies", "Yes, static", "Yes, lifetimes"], answerIndex: 0, explanation: "mut only affects assignment ability." },
    ],
    exercise: {
      id: "bindings-endcode",
      prompt: "Write a tiny program that creates a mutable i32 starting at 1, adds 2, and prints it with println!.",
      starterCode: "fn main() {\n    // your code here\n    todo!()\n}\n",
      tests: "#[cfg(test)]\nmod tests {\n    #[test]\n    fn sum_is_three() {\n        assert_eq!(1 + 2, 3);\n    }\n}\n",
      checks: { mustInclude: ["let mut", "println!"] },
    },
  },
  {
    id: "shadowing-scope",
    title: "Shadowing and Scope",
    level: "Beginner",
    description: "Transform values immutably by shadowing names in new bindings.",
    sections: [
      {
        title: "Shadowing basics",
        content:
          "Shadowing means declaring a new let with the same name, producing a new value and often a new type. Unlike mutability, shadowing keeps each binding immutable. It’s great for parsing or cleaning data step by step without flipping mut on.",
        quiz: [
          { prompt: "Shadowing creates...", options: ["A new binding", "Mutable ref", "Global", "Panic"], answerIndex: 0, explanation: "It's a new binding." },
        ],
        examples: [
          { title: "Shadowing", code: "fn main() {\n    let x = \"5\";\n    let x: i32 = x.parse().unwrap();\n    println!(\"{}\", x + 1);\n}\n" },
          { title: "Shadowing to narrow", code: "fn main() {\n    let spaces = \"   \";\n    let spaces = spaces.len();\n    println!(\"{}\", spaces);\n}\n" },
        ],
        exercise: {
          id: "syntax-shadow",
          prompt: "Parse a &str into i32 using shadowing and add 1.",
          starterCode: "pub fn parse_and_add(s: &str) -> i32 {\n    todo!()\n}\n\nfn main() {}\n",
          tests: "#[cfg(test)]\nmod tests { use super::*; #[test] fn parses() { assert_eq!(parse_and_add(\"10\"), 11); } }\n",
        },
      },
      {
        title: "Shadowing in nested blocks",
        content:
          "Blocks (anything in braces) have their own scope. You can shadow inside a block to create a temporary transformed value without changing the outer one. When the block ends, the inner shadow disappears.",
        quiz: [
          { prompt: "Where does an inner shadow live?", options: ["That block", "Everywhere", "Only main", "Heap"], answerIndex: 0, explanation: "Shadowed bindings are scoped to their block." },
        ],
        examples: [
          { title: "Inner block shadow", code: "fn main() {\n    let x = 5;\n    { let x = x + 1; println!(\"inner {}\", x); }\n    println!(\"outer {}\", x);\n}\n" },
        ],
        exercise: {
          id: "shadowing-blocks",
          prompt: "Shadow a number inside a block by adding 2; return (inner, outer).",
          starterCode: "pub fn add_two_outer(x: i32) -> (i32, i32) {\n    todo!()\n}\n\nfn main() {}\n",
          tests: "#[cfg(test)]\nmod tests { use super::*; #[test] fn inner_outer() { assert_eq!(add_two_outer(3), (5,3)); } }\n",
        },
      },
      {
        title: "Shadowing to sanitize data",
        content:
          "Shadowing is perfect for cleanup pipelines: trim whitespace, remove commas, lowercase, parse. Each step reuses the same name but with a safer, more specific type. You never mutate; you just redefine the name with the new value.",
        quiz: [
          { prompt: "Why shadow when sanitizing?", options: ["To keep transformations local", "To mutate globals", "To avoid heap", "Because mut is forbidden"], answerIndex: 0, explanation: "Shadowing lets you transform while staying scoped." },
        ],
        examples: [
          { title: "Shadow for cleanup", code: "fn normalize_num(raw: &str) -> Result<i32, _> {\n    let raw = raw.trim();\n    let raw = raw.replace(\",\", \"\");\n    raw.parse()\n}\n" },
        ],
        exercise: {
          id: "shadowing-trim-parse",
          prompt: "Trim input, shadow into i32, add 1; return Result.",
          starterCode: "pub fn trim_parse_add_one(input: &str) -> Result<i32, std::num::ParseIntError> {\n    todo!()\n}\n\nfn main() {}\n",
          tests: "#[cfg(test)]\nmod tests { use super::*; #[test] fn cleans_and_parses() { assert_eq!(trim_parse_add_one(\" 41 \"), Ok(42)); } }\n",
        },
      },
    ],
    quiz: [
      { prompt: "Does shadowing require mut?", options: ["No", "Yes"], answerIndex: 0, explanation: "Shadowing is a new binding." },
    ],
  },
  {
    id: "primitives",
    title: "Numeric and Boolean Primitives",
    level: "Beginner",
    description: "Integers, floats, and bool with type inference defaults.",
    sections: [
      {
        title: "Declaring primitives",
        content: "Numbers and booleans are the atoms of Rust. A bool is just true or false. Whole numbers default to i32, decimals default to f64. You can add a suffix like 42u8 or 3.14f32 to be explicit. Rust will not guess between int/float for you—you must decide. Naming your values and stating the type helps you think about what the code should mean, not just what it happens to do.",
        quiz: [
          { prompt: "What are the boolean literals?", options: ["true/false", "yes/no", "1/0", "T/F"], answerIndex: 0, explanation: "Rust uses true and false." },
        ],
        examples: [
          { title: "Declare primitives", code: "fn main() {\n    let count: i32 = 5;\n    let done: bool = false;\n    println!(\"{} {}\", count, done);\n}" },
        ],
        exercise: {
          id: "primitives-init",
          prompt: "Return a tuple containing an i32 with value 7 and a bool set to true.",
          starterCode: "pub fn make_primitives() -> (i32, bool) {\n    // create and return (7, true)\n    todo!()\n}\n\nfn main() {}\n",
          tests: "#[cfg(test)]\nmod tests {\n    use super::*;\n    #[test]\n    fn builds_tuple() {\n        assert_eq!(make_primitives(), (7, true));\n    }\n}\n",
        },
      },
      {
        title: "Numeric and boolean primitives",
        content:
          "Rust ships many integer sizes (i8..i128 signed, u8..u128 unsigned, plus isize/usize for pointer-sized). Decimals use f32 or f64. If you do not write a suffix, the compiler picks i32 or f64. Use readable literals like 1_000_000. When mixing types, be explicit with casts so you see where precision or sign might change.",
        quiz: [
          { prompt: "Default integer type?", options: ["i32", "u32", "i64", "usize"], answerIndex: 0, explanation: "Defaults to i32." },
        ],
        examples: [
          { title: "Primitive types", code: "fn main() {\n    let a: i32 = 5;\n    let b = 2.5f64;\n    let ok: bool = a as f64 > b;\n    println!(\"{} {} {}\", a, b, ok);\n}\n" },
          { title: "Literals with suffixes", code: "fn main() {\n    let big: u128 = 1_000_000u128;\n    let precise: f32 = 3.14f32;\n    let flag = true;\n    println!(\"{} {} {}\", big, precise, flag);\n}\n" },
        ],
        exercise: {
          id: "syntax-even",
          prompt: "Return true if an i32 is even.",
          starterCode: "pub fn is_even(n: i32) -> bool {\n    todo!()\n}\n\nfn main() {}\n",
          tests: "#[cfg(test)]\nmod tests { use super::*; #[test] fn checks_even() { assert!(is_even(4)); assert!(!is_even(3)); } }\n",
        },
      },
      {
        title: "Comparisons and bools",
        content: "A bool is either true or false. Any comparison like 3 == 3 or a > b returns a bool. Combine conditions with && (and), || (or), and ! (not). Rust does not treat 0/1 as bool; you must give it a real boolean expression, which helps prevent accidental truthiness bugs.",
        quiz: [
          { prompt: "What does 3 == 3 return?", options: ["true", "false", "3", "0"], answerIndex: 0, explanation: "Equality returns bool." },
        ],
        examples: [
          { title: "Comparisons", code: "fn main() {\n    let a = 5;\n    let b = 8;\n    let bigger = b > a;\n    let equal = a == b;\n    println!(\"{} {}\", bigger, equal);\n}\n" },
        ],
        exercise: {
          id: "primitives-compare",
          prompt: "Return true if n is between low and high inclusive.",
          starterCode: "pub fn in_range(n: i32, low: i32, high: i32) -> bool {\n    todo!()\n}\n\nfn main() {}\n",
          tests: "#[cfg(test)]\nmod tests { use super::*; #[test] fn checks_range() { assert!(in_range(5,1,5)); assert!(!in_range(10,1,5)); } }\n",
        },
      },
    ],
    quiz: [
      { prompt: "Boolean literals?", options: ["true/false", "yes/no", "1/0", "T/F"], answerIndex: 0, explanation: "Rust uses true and false." },
    ],
  },
  {
    id: "tuples-destructuring",
    title: "Tuples and Destructuring",
    level: "Beginner",
    description: "Group heterogenous values and pull them apart with patterns.",
    sections: [
      {
        title: "Building tuples",
        content: "Tuples are fixed-size bundles of values. Each position can be a different type, and the shape is part of the type: (i32, bool) differs from (bool, i32). They’re great for quick grouping or returning multiple results without inventing a struct yet.",
        quiz: [
          { prompt: "How do you create a 2-tuple?", options: ["(a, b)", "[a, b]", "{a, b}", "new tuple"], answerIndex: 0, explanation: "Use parentheses with comma-separated values." },
        ],
        examples: [
          {
            title: "Make and return",
            code: "fn coords() -> (i32, i32) {\n    (10, 20)\n}\n",
          },
        ],
        exercise: {
          id: "tuples-make",
          prompt: "Create and return a tuple (\"rust\", 2015).",
          starterCode: "pub fn make_tuple() -> (&'static str, i32) {\n    // build the tuple\n    todo!()\n}\n\nfn main() {}\n",
          tests: "#[cfg(test)]\nmod tests {\n    use super::*;\n    #[test]\n    fn builds() {\n        assert_eq!(make_tuple(), (\"rust\", 2015));\n    }\n}\n",
        },
      },
      {
        title: "Tuples and destructuring",
        content: "Once you have a tuple, you can reach into it with dot-number access (t.0, t.1) or destructuring patterns: let (x, y) = t;. Destructuring is clearer when names matter; dot access is fine for quick one-offs.",
        quiz: [
          { prompt: "Access first element?", options: ["t.0", "t[0]", "t.first()", "t->0"], answerIndex: 0, explanation: "Tuples use dot-number." },
        ],
        examples: [
          { title: "Destructure tuple", code: "fn main() {\n    let point: (i32, i32) = (3, 4);\n    let (x, y) = point;\n    println!(\"{} {}\", x, y);\n}\n" },
          { title: "Tuple in functions", code: "fn distance(p: (i32, i32)) -> i32 {\n    let (x, y) = p;\n    (x * x + y * y).abs()\n}\n" },
        ],
        exercise: {
          id: "syntax-swap",
          prompt: "Swap (a, b) into (b, a).",
          starterCode: "pub fn swap(pair: (i32, i32)) -> (i32, i32) {\n    todo!()\n}\n\nfn main() {}\n",
          tests: "#[cfg(test)]\nmod tests { use super::*; #[test] fn swaps() { assert_eq!(swap((1,2)), (2,1)); } }\n",
        },
      },
      {
        title: "Tuple structs and naming",
        content: "Tuple structs wrap positional fields in a named type: struct Color(u8,u8,u8);. This gives you a new type so you can’t mix up different tuples accidentally, while still keeping the lightweight positional feel.",
        quiz: [
          { prompt: "What does a tuple struct add?", options: ["New type name", "Field names", "Mutability", "Heap"], answerIndex: 0, explanation: "It wraps positions in a named type." },
        ],
        examples: [
          { title: "Color tuple struct", code: "struct Color(u8,u8,u8);\nfn main() {\n    let red = Color(255,0,0);\n    println!(\"R {} G {} B {}\", red.0, red.1, red.2);\n}\n" },
        ],
        exercise: {
          id: "tuples-struct-distance",
          prompt: "Create Point(i32,i32) tuple struct and return |x|+|y|.",
          starterCode: "struct Point(i32, i32);\n\npub fn manhattan(p: Point) -> i32 {\n    todo!()\n}\n\nfn main() {}\n",
          tests: "#[cfg(test)]\nmod tests { use super::*; #[test] fn computes() { assert_eq!(manhattan(Point(3,-4)), 7); } }\n",
        },
      },
    ],
    quiz: [
      { prompt: "Can tuples hold mixed types?", options: ["Yes", "No"], answerIndex: 0, explanation: "Each position can differ." },
    ],
  },
  {
    id: "arrays-basics",
    title: "Arrays Fundamentals",
    level: "Beginner",
    description: "Fixed-length arrays: creation, indexing, iteration, and safe access.",
    sections: [
      {
        title: "Array shape",
        content: "Arrays ([T; N]) hold a fixed count of a single type and live on the stack. The length is part of the type: [i32; 4] differs from [i32; 5]. You can repeat a value with [0; 3] to make [0,0,0]. Because they’re fixed-size, they’re fast and predictable.",
        quiz: [
          { prompt: "What does [i32;4] mean?", options: ["Array of 4 i32" ,"Slice" ,"Vec", "Tuple"], answerIndex: 0, explanation: "Array type includes length." },
        ],
        examples: [
          { title: "Create and index", code: "fn main() {\n    let nums: [i32; 4] = [10, 20, 30, 40];\n    let first = nums[0];\n    let repeated = [0; 3];\n    println!(\"{} {:?}\", first, repeated);\n}\n" },
        ],
        exercise: {
          id: "arrays-sum",
          prompt: "Sum elements of a 5-item i32 array using a for loop.",
          starterCode: "pub fn sum_array(values: [i32; 5]) -> i32 {\n    todo!()\n}\n\nfn main() {}\n",
          tests: "#[cfg(test)]\nmod tests { use super::*; #[test] fn sums() { assert_eq!(sum_array([1,2,3,4,5]), 15); } }\n",
          checks: { mustInclude: ["for"], mustNotInclude: ["iter"] },
        },
      },
      {
        title: "Indexing and safe access",
        content: "You can index with arr[i]; Rust will bounds-check and panic if i is out of range. To avoid panics, use arr.get(i), which returns Option<&T>. That forces you to handle the missing case explicitly instead of crashing.",
        quiz: [
          { prompt: "How to safely access?", options: ["arr.get(i)", "arr(i)", "arr.safe(i)", "You can't"], answerIndex: 0, explanation: "get returns Option." },
        ],
        examples: [ { title: "Index vs get", code: "fn main() {\n    let data = [1,2,3];\n    let first = data[0];\n    let maybe = data.get(99);\n    println!(\"{} {:?}\", first, maybe);\n}\n" } ],
        exercise: {
          id: "arrays-safe-first",
          prompt: "Return the first element of an array safely as Option<i32>.",
          starterCode: "pub fn safe_first(values: [i32;3]) -> Option<i32> {\n    todo!()\n}\n\nfn main() {}\n",
          tests: "#[cfg(test)]\nmod tests { use super::*; #[test] fn safe_access() { assert_eq!(safe_first([9,8,7]), Some(9)); } }\n",
          checks: { mustInclude: ["get"] },
        },
      },
      {
        title: "Iterating arrays",
        content: "A for loop can walk arrays by reference (&arr) or by value (arr). Calling iter() creates an iterator of references; adapters like map/filter/sum build on that. Learn the basic for loop first, then graduate to iterator chains for concise data transformations.",
        quiz: [ { prompt: "What does iter() do?", options: ["Creates iterator of refs", "Clones array", "Mutates elements", "Sorts"], answerIndex: 0, explanation: "iter yields references." } ],
        examples: [
          {
            title: "Borrowed iteration",
            code:
              "fn main() {\n    let arr = [1, 2, 3];\n    for v in &arr {\n        print!(\"{} \", v);\n    }\n}\n",
          },
          {
            title: "Iterator adapters",
            code:
              "fn doubled(arr: [i32; 3]) -> [i32; 3] {\n    let v: Vec<i32> = arr.into_iter().map(|n| n * 2).collect();\n    [v[0], v[1], v[2]]\n}\n",
          },
        ],
        exercise: {
          id: "arrays-sum-iter",
          prompt: "Sum elements of a 4-item i32 array using iter().sum().",
          starterCode: "pub fn sum_iter(values: [i32; 4]) -> i32 {\n    todo!()\n}\n\nfn main() {}\n",
          tests: "#[cfg(test)]\nmod tests { use super::*; #[test] fn sums_with_iter() { assert_eq!(sum_iter([1,2,3,4]), 10); } }\n",
          checks: { mustInclude: ["iter().sum"] },
        },
      },
    ],
    quiz: [
      { prompt: "What does [T;N] mean?", options: ["Array of N T", "Slice", "Vec", "Tuple"], answerIndex: 0, explanation: "Array type includes length." },
    ],
  },
  {
    id: "slices-basics",
    title: "Slices Fundamentals",
    level: "Beginner",
    description: "Borrowed windows into arrays and vectors, immutable and mutable slices.",
    sections: [
      {
        title: "Immutable slices",
        content: "A slice (&[T]) is a read-only view into contiguous data. It carries length and no ownership—great for passing parts of arrays/Vec without copying.",
        quiz: [ { prompt: "What is &str?", options: ["String slice", "Owned String"], answerIndex: 0, explanation: "&str is a borrowed string slice." } ],
        examples: [
          {
            title: "Borrow a slice",
            code: "fn sum_slice(nums: &[i32]) -> i32 {\n    nums.iter().sum()\n}\n",
          },
          {
            title: "String slices",
            code:
              "fn first_word(s: &str) -> &str {\n    s.split_whitespace().next().unwrap_or(\"\")\n}\n",
          },
        ],
        exercise: {
          id: "slices-middle",
          prompt: "Return the middle two elements of a 4-item slice as Vec<i32>.",
          starterCode: "pub fn middle_two(nums: &[i32]) -> Vec<i32> {\n    todo!()\n}\n\nfn main() {}\n",
          tests: "#[cfg(test)]\nmod tests { use super::*; #[test] fn gets_middle() { assert_eq!(middle_two(&[1,2,3,4]), vec![2,3]); } }\n",
        },
      },
      {
        title: "Mutable slices",
        content: "&mut [T] lets you mutate through a borrowed window. Requires exclusive access to stay race-free.",
        quiz: [ { prompt: "When can you use &mut [T]?", options: ["With exclusive access", "Anytime"], answerIndex: 0, explanation: "Mutable slices need exclusivity." } ],
        examples: [
          {
            title: "In-place edit",
            code:
              "fn double_first_two(nums: &mut [i32]) {\n    if nums.len() >= 2 {\n        nums[0] *= 2;\n        nums[1] *= 2;\n    }\n}\n",
          },
          {
            title: "Split slices",
            code:
              "fn split_halves(data: &mut [i32]) -> (&mut [i32], &mut [i32]) {\n    let mid = data.len() / 2;\n    data.split_at_mut(mid)\n}\n",
          },
        ],
        exercise: {
          id: "slices-reverse",
          prompt: "Reverse elements of a mutable slice in place.",
          starterCode: "pub fn reverse_in_place(nums: &mut [i32]) {\n    todo!()\n}\n\nfn main() {}\n",
          tests: "#[cfg(test)]\nmod tests { use super::*; #[test] fn reverses() { let mut d=vec![1,2,3,4]; reverse_in_place(&mut d); assert_eq!(d, vec![4,3,2,1]); } }\n",
        },
      },
      {
        title: "String slicing pitfalls",
        content: "UTF-8 uses variable-width chars; slicing strings by byte index can panic. Prefer chars() or split_whitespace() when handling text.",
        quiz: [ { prompt: "Why can string slicing panic?", options: ["Variable byte length", "Fixed width"], answerIndex: 0, explanation: "Invalid byte boundaries panic." } ],
        examples: [
          {
            title: "Safe first char",
            code:
              "fn safe_first(s: &str) -> Option<char> {\n    s.chars().next()\n}\n",
          },
        ],
        exercise: {
          id: "slices-first-char",
          prompt: "Return the first character of a &str safely as Option<char>.",
          starterCode: "pub fn first_char_safe(s: &str) -> Option<char> {\n    todo!()\n}\n\nfn main() {}\n",
          tests: "#[cfg(test)]\nmod tests { use super::*; #[test] fn handles_text() { assert_eq!(first_char_safe(\"rust\"), Some('r')); assert_eq!(first_char_safe(\"\"), None); } }\n",
        },
      },
    ],
    quiz: [ { prompt: "What does &[T] represent?", options: ["Borrowed slice", "Owned array"], answerIndex: 0, explanation: "Slices are borrowed views." } ],
  },
  {
    id: "control-flow",
    title: "Control Flow & Patterns",
    level: "Beginner",
    description: "Conditionals, loops, and match basics.",
    sections: [
      {
        title: "if/else as expressions",
        content: "if needs a bool and can return a value. Use it for simple branching; prefer match for many branches.",
        quiz: [ { prompt: "if conditions must be?", options: ["bool", "int"], answerIndex: 0, explanation: "Rust requires bool." } ],
        examples: [
          {
            title: "Label numbers",
            code:
              "fn main() {\n    let n = 4;\n    let label = if n % 2 == 0 { \"even\" } else { \"odd\" };\n    println!(\"{}\", label);\n}\n",
          },
          {
            title: "Assign from if",
            code:
              "fn main() {\n    let temp = 10;\n    let advice = if temp < 0 { \"stay in\" } else { \"go out\" };\n    println!(\"{}\", advice);\n}\n",
          },
        ],
        exercise: {
          id: "control-sign",
          prompt: "Return pos/neg/zero for an i32 using if/else.",
          starterCode: "pub fn sign_label(n: i32) -> &'static str {\n    todo!()\n}\n\nfn main() {}\n",
          tests: "#[cfg(test)]\nmod tests { use super::*; #[test] fn labels() { assert_eq!(sign_label(3), \"pos\"); assert_eq!(sign_label(-1), \"neg\"); assert_eq!(sign_label(0), \"zero\"); } }\n",
        },
      },
      {
        title: "loop, while, for",
        content: "loop runs forever unless break; while checks a condition; for iterates safely over ranges/collections.",
        quiz: [ { prompt: "Which loop is infinite unless broken?", options: ["loop", "for"], answerIndex: 0, explanation: "loop." } ],
        examples: [
          {
            title: "for over range",
            code:
              "fn main() {\n    for i in 0..3 {\n        println!(\"{}\", i);\n    }\n}\n",
          },
          {
            title: "while with break",
            code:
              "fn main() {\n    let mut n = 3;\n    while n > 0 {\n        println!(\"{}\", n);\n        n -= 1;\n    }\n}\n",
          },
        ],
        exercise: {
          id: "control-sum",
          prompt: "Sum numbers 1..=n using a loop.",
          starterCode: "pub fn sum_to(n: u32) -> u32 {\n    todo!()\n}\n\nfn main() {}\n",
          tests: "#[cfg(test)]\nmod tests { use super::*; #[test] fn sums() { assert_eq!(sum_to(5), 15); } }\n",
        },
      },
      {
        title: "match and patterns",
        content: "match must handle all cases. Patterns include literals, ranges, |, and _. Use match for clear branching and destructuring.",
        quiz: [ { prompt: "match must be?", options: ["Exhaustive", "Mutable"], answerIndex: 0, explanation: "All cases covered." } ],
        examples: [
          {
            title: "match ranges",
            code:
              "fn grade(score: u8) -> &'static str {\n    match score {\n        90..=100 => \"A\",\n        80..=89 => \"B\",\n        _ => \"Keep going\",\n    }\n}\n",
          },
          {
            title: "match literals",
            code:
              "fn direction(ch: char) -> &'static str {\n    match ch {\n        'n' | 'N' => \"north\",\n        's' | 'S' => \"south\",\n        _ => \"other\",\n    }\n}\n",
          },
        ],
        exercise: {
          id: "control-grade",
          prompt: "Return letter grade (A/B/C/F) using match ranges.",
          starterCode: "pub fn letter(score: u8) -> &'static str {\n    todo!()\n}\n\nfn main() {}\n",
          tests: "#[cfg(test)]\nmod tests { use super::*; #[test] fn grades() { assert_eq!(letter(95), \"A\"); assert_eq!(letter(40), \"F\"); } }\n",
        },
      },
    ],
    quiz: [ { prompt: "What must match cover?", options: ["All cases", "Some cases"], answerIndex: 0, explanation: "Match is exhaustive." } ],
  },
  {
    id: "option-basics",
    title: "Option Basics",
    level: "Beginner",
    description: "Model maybe-values with Option<T> and handle them safely with match and if let.",
    sections: [
      {
        title: "What is Option?",
        content:
          "Option<T> represents an optional value: Some(T) or None. Use it instead of magic values like -1 to signal 'no value'. It keeps absence explicit and avoids bugs from forgetting to handle the empty case.",
        quiz: [
          {
            prompt: "What are the two variants of Option<T>?",
            options: ["Some/None", "Ok/Err", "True/False", "Present/Missing"],
            answerIndex: 0,
            explanation: "Option<T> is an enum with Some(T) and None.",
          },
        ],
        examples: [
          {
            title: "Looking up by index",
            code: "fn get_third(nums: &[i32]) -> Option<i32> {\n    nums.get(2).copied()\n}\n",
          },
        ],
        exercise: {
          id: "option-get-first-even",
          prompt: "Return the first even number in a slice as Option<i32>.",
          starterCode:
            "pub fn first_even(nums: &[i32]) -> Option<i32> {\n    // walk through nums and return Some(n) for the first even n, or None if there is none\n    todo!()\n}\n\nfn main() {}\n",
          tests:
            "#[cfg(test)]\nmod tests {\n    use super::*;\n    #[test]\n    fn finds_first_even() {\n        assert_eq!(first_even(&[1, 3, 4, 6]), Some(4));\n        assert_eq!(first_even(&[1, 3, 5]), None);\n    }\n}\n",
        },
      },
      {
        title: "match and if let with Option",
        content:
          "Use match to handle Some and None explicitly. When you only care about the Some case, if let makes the code shorter. match is exhaustive; if let is a shorthand for the common case.",
        quiz: [
          {
            prompt: "When is if let handy with Option?",
            options: ["When you only care about the Some case", "When you need all cases", "When you want to panic", "When you want a loop"],
            answerIndex: 0,
            explanation: "if let lets you concisely handle just the Some branch.",
          },
        ],
        examples: [
          {
            title: "match on Option",
            code:
              "fn describe_len(name: Option<&str>) -> &'static str {\n    match name {\n        Some(n) if n.len() > 3 => \"long name\",\n        Some(_) => \"short name\",\n        None => \"no name\",\n    }\n}\n",
          },
          {
            title: "if let for the Some case",
            code:
              "fn print_if_even(n: Option<i32>) {\n    if let Some(value) = n {\n        if value % 2 == 0 {\n            println!(\"even: {}\", value);\n        }\n    }\n}\n",
          },
        ],
        exercise: {
          id: "option-length-or-default",
          prompt: "Return the length of Some(&str), or 0 if the Option is None.",
          starterCode:
            "pub fn len_or_zero(s: Option<&str>) -> usize {\n    // use match or if let to handle Some/None\n    todo!()\n}\n\nfn main() {}\n",
          tests:
            "#[cfg(test)]\nmod tests {\n    use super::*;\n    #[test]\n    fn handles_some_and_none() {\n        assert_eq!(len_or_zero(Some(\"rust\")), 4);\n        assert_eq!(len_or_zero(None), 0);\n    }\n}\n",
        },
      },
    ],
    quiz: [
      {
        prompt: "What does None mean in Option<T>?",
        options: ["There is no value", "Zero value", "Panic at runtime", "Compiler error"],
        answerIndex: 0,
        explanation: "None is the explicit 'no value' case.",
      },
    ],
  },
  {
    id: "ownership-borrowing",
    title: "Ownership & Borrowing Essentials",
    level: "Beginner",
    description: "Understand ownership rules, moves, and references.",
    sections: [
      {
        title: "Moves vs Copy",
        content: "Every value has one owner. Move types (String, Vec) transfer ownership; Copy types (i32, bool) duplicate by value.",
        examples: [
          {
            title: "Move vs copy",
            code:
              "fn main() {\n    let s = String::from(\"hi\");\n    let t = s;\n    let x = 5;\n    let y = x;\n    println!(\"{} {}\", x, y);\n}\n",
          },
          {
            title: "Move into function",
            code:
              "fn consume(name: String) {\n    println!(\"{}\", name);\n}\n\nfn main() {\n    let n = String::from(\"rust\");\n    consume(n);\n}\n",
          },
        ],
        exercise: {
          id: "ownership-len",
          prompt: "Take ownership of a String and return its length.",
          starterCode: "pub fn take_and_len(input: String) -> usize {\n    todo!()\n}\n\nfn main() {}\n",
          tests: "#[cfg(test)]\nmod tests { use super::*; #[test] fn length() { assert_eq!(take_and_len(String::from(\"rust\")), 4); } }\n",
        },
      },
      {
        title: "Borrowing",
        content: "&T gives read-only access; &mut T gives exclusive write access. Rule: many immutable or one mutable at a time.",
        examples: [
          {
            title: "Borrowing a string",
            code:
              "fn print_len(s: &String) {\n    println!(\"{}\", s.len());\n}\n\nfn main() {\n    let name = String::from(\"Ferris\");\n    print_len(&name);\n    println!(\"{}\", name);\n}\n",
          },
          {
            title: "Mutable borrow",
            code:
              "fn add_bang(msg: &mut String) {\n    msg.push('!');\n}\n\nfn main() {\n    let mut m = String::from(\"hi\");\n    add_bang(&mut m);\n    println!(\"{}\", m);\n}\n",
          },
        ],
        exercise: {
          id: "ownership-borrow",
          prompt: "Append an exclamation to a String via &mut.",
          starterCode: "pub fn shout(msg: &mut String) {\n    todo!()\n}\n\nfn main() {}\n",
          tests: "#[cfg(test)]\nmod tests { use super::*; #[test] fn mutates() { let mut msg=String::from(\"hi\"); shout(&mut msg); assert_eq!(msg, \"hi!\"); } }\n",
        },
      },
      {
        title: "Slices",
        content: "Slices (&[T], &str) are borrowed views with length. They don't own data; &mut [T] allows mutation with exclusivity.",
        examples: [
          {
            title: "First word",
            code:
              "fn first_word(s: &str) -> &str {\n    s.split_whitespace().next().unwrap_or(\"\")\n}\n",
          },
          {
            title: "Array slice",
            code:
              "fn tail(nums: &[i32]) -> Option<&[i32]> {\n    if nums.len() > 1 {\n        Some(&nums[1..])\n    } else {\n        None\n    }\n}\n",
          },
        ],
        exercise: {
          id: "ownership-first-word",
          prompt: "Return the first word slice from an input &str.",
          starterCode: "pub fn first_word(s: &str) -> &str {\n    todo!()\n}\n\nfn main() {}\n",
          tests: "#[cfg(test)]\nmod tests { use super::*; #[test] fn finds_first() { assert_eq!(first_word(\"hello rust\"), \"hello\"); } }\n",
        },
      },
    ],
    quiz: [
      { prompt: "After a move, old binding usable?", options: ["No", "Yes"], answerIndex: 0, explanation: "Move invalidates old binding." },
      { prompt: "How many mutable borrows at once?", options: ["One", "Many"], answerIndex: 0, explanation: "One mutable or many immutable." },
    ],
  },
  {
    id: "data-structures",
    title: "Strings, Slices, and Collections",
    level: "Beginner",
    description: "Work with String, &str, Vec, and HashMap.",
    sections: [
      {
        title: "String vs &str",
        content: "String owns growable UTF-8; &str is a borrowed view. Make String with to_string()/String::from; borrow with &my_string[..].",
        quiz: [ { prompt: "Which type owns text?", options: ["String", "&str"], answerIndex: 0, explanation: "String owns heap data." } ],
        examples: [
          {
            title: "To owned",
            code:
              "fn main() {\n    let borrowed: &str = \"hi\";\n    let owned: String = borrowed.to_string();\n    println!(\"{} {}\", borrowed, owned);\n}\n",
          },
          {
            title: "Concat",
            code:
              "fn greet(name: &str) -> String {\n    let mut msg = String::from(\"Hello, \");\n    msg.push_str(name);\n    msg\n}\n",
          },
        ],
        exercise: {
          id: "data-to-upper",
          prompt: "Return an owned uppercase String from an &str input.",
          starterCode: "pub fn loud(s: &str) -> String {\n    todo!()\n}\n\nfn main() {}\n",
          tests: "#[cfg(test)]\nmod tests { use super::*; #[test] fn uppercases() { assert_eq!(loud(\"rust\"), \"RUST\"); } }\n",
        },
      },
      {
        title: "Vectors",
        content: "Vec<T> is a growable list. push adds; pop removes; iterate safely with for/iterators.",
        quiz: [ { prompt: "How to append to Vec?", options: ["push", "add"], answerIndex: 0, explanation: "push appends." } ],
        examples: [
          {
            title: "Collect into Vec",
            code:
              "let doubled: Vec<i32> = (0..3)\n    .map(|n| n * 2)\n    .collect();\n",
          },
          {
            title: "Push and pop",
            code:
              "fn main() {\n    let mut nums = vec![1, 2];\n    nums.push(3);\n    let last = nums.pop();\n    println!(\"{:?} {:?}\", nums, last);\n}\n",
          },
        ],
        exercise: {
          id: "data-last-even",
          prompt: "Return the last even number in a Vec<i32>, if any.",
          starterCode: "pub fn last_even(nums: &[i32]) -> Option<i32> {\n    todo!()\n}\n\nfn main() {}\n",
          tests: "#[cfg(test)]\nmod tests { use super::*; #[test] fn finds_even() { assert_eq!(last_even(&[1,3,4,7]), Some(4)); assert_eq!(last_even(&[1,3,5]), None); } }\n",
        },
      },
      {
        title: "HashMap basics",
        content: "HashMap stores key/value pairs. insert adds; get returns Option<&V>; entry().or_insert helps mutate counts.",
        quiz: [ { prompt: "How to add to HashMap?", options: ["insert", "push"], answerIndex: 0, explanation: "insert adds key/value." } ],
        examples: [
          {
            title: "Counting",
            code:
              "use std::collections::HashMap;\n\nfn main() {\n    let mut counts = HashMap::new();\n    for ch in \"rust\".chars() {\n        *counts.entry(ch).or_insert(0) += 1;\n    }\n    println!(\"{:?}\", counts);\n}\n",
          },
          {
            title: "Lookup",
            code:
              "use std::collections::HashMap;\n\nfn get_score(map: &HashMap<&str, i32>, name: &str) -> i32 {\n    *map.get(name).unwrap_or(&0)\n}\n",
          },
        ],
        exercise: {
          id: "data-count",
          prompt: "Count occurrences of chars in a &str using HashMap.",
          starterCode: "use std::collections::HashMap;\n\npub fn char_counts(input: &str) -> HashMap<char, usize> {\n    todo!()\n}\n\nfn main() {}\n",
          tests: "#[cfg(test)]\nmod tests { use super::*; #[test] fn counts_chars() { let mut map = char_counts(\"aba\"); assert_eq!(map.remove(&'a'), Some(2)); assert_eq!(map.remove(&'b'), Some(1)); } }\n",
        },
      },
    ],
  },
  {
    id: "debugging-panics",
    title: "Debugging and Panics",
    level: "Beginner",
    description: "Use dbg! and println! to inspect values, understand panics, and use unwrap/expect safely.",
    sections: [
      {
        title: "Quick debugging tools",
        content:
          "dbg!(expr) prints the value and returns it, great for inspecting in the middle of an expression. println! prints formatted output; eprintln! prints to stderr. Use these to see what the program is doing while you learn.",
        quiz: [
          {
            prompt: "What does dbg!(x) do?",
            options: ["Prints and returns x", "Consumes x forever", "Panics", "Optimizes code"],
            answerIndex: 0,
            explanation: "dbg! logs to stderr and yields the value back.",
          },
        ],
        examples: [
          { title: "dbg! in an expression", code: "fn double(n: i32) -> i32 {\n    let n = dbg!(n);\n    n * 2\n}\n" },
          { title: "stderr vs stdout", code: "fn main() {\n    println!(\"normal output\");\n    eprintln!(\"error output\");\n}\n" },
        ],
        exercise: {
          id: "debugging-dbg-sum",
          prompt: "Use dbg! inside sum_and_double to print the intermediate sum, then return sum * 2.",
          starterCode: "pub fn sum_and_double(a: i32, b: i32) -> i32 {\n    // log the sum with dbg!\n    let sum = a + b;\n    todo!()\n}\n\nfn main() {}\n",
          tests: "#[cfg(test)]\nmod tests {\n    use super::*;\n    #[test]\n    fn doubles_sum() {\n        assert_eq!(sum_and_double(2, 3), 10);\n    }\n}\n",
          checks: { mustInclude: ["dbg!"] },
        },
      },
      {
        title: "Panics, unwrap, and expect",
        content:
          "A panic! stops the program when an unrecoverable error happens (like out-of-bounds access). unwrap on Option/Result will panic on None/Err; expect is like unwrap but lets you add a message. Prefer handling None/Err, but unwrap/expect are okay for quick prototypes when failure means bug.",
        quiz: [
          {
            prompt: "What happens when you unwrap a None?",
            options: ["It panics", "It returns 0", "It returns false", "It compiles to noop"],
            answerIndex: 0,
            explanation: "unwrap on None panics at runtime.",
          },
        ],
        examples: [
          { title: "panic! explicitly", code: "fn must_be_positive(n: i32) {\n    if n <= 0 {\n        panic!(\"need positive number\");\n    }\n}\n" },
          { title: "unwrap vs expect", code: "fn first_char(s: &str) -> char {\n    s.chars().next().expect(\"string should not be empty\")\n}\n" },
        ],
        exercise: {
          id: "debugging-safe-divide",
          prompt: "Return Some(a / b) for nonzero b, otherwise return None (do not panic).",
          starterCode: "pub fn safe_divide(a: i32, b: i32) -> Option<i32> {\n    todo!()\n}\n\nfn main() {}\n",
          tests: "#[cfg(test)]\nmod tests {\n    use super::*;\n    #[test]\n    fn divides_or_none() {\n        assert_eq!(safe_divide(10, 2), Some(5));\n        assert_eq!(safe_divide(5, 0), None);\n    }\n}\n",
          checks: { mustNotInclude: ["unwrap", "expect", "panic!"] },
        },
      },
    ],
    quiz: [
      { prompt: "What does RUST_BACKTRACE=1 do?", options: ["Shows stack traces on panic", "Enables optimizations", "Turns off dbg!", "Formats code"], answerIndex: 0, explanation: "It prints a backtrace when a panic occurs." },
      { prompt: "When is expect preferred over unwrap?", options: ["When you want a custom panic message", "When you want to ignore errors", "It never is", "Only in release"], answerIndex: 0, explanation: "expect lets you describe the invariant for easier debugging." },
    ],
  },
  {
    id: "beginner-mini-project",
    title: "Mini Project: Word Count CLI",
    level: "Beginner",
    description: "Tie beginner concepts together by building a tiny word-counting CLI core.",
    sections: [
      {
        title: "Designing the CLI logic",
        content:
          "Keep the core logic pure and testable: write a function that counts words in a &str and returns a summary. Later, a real CLI could read std::env::args() and call that function. This keeps I/O separate from logic.",
        quiz: [
          {
            prompt: "Why separate core logic from I/O?",
            options: ["Easier to test", "It panics less", "It makes code slower", "It removes types"],
            answerIndex: 0,
            explanation: "Pure logic is easy to unit test and reuse.",
          },
        ],
        examples: [
          { title: "Word counting idea", code: "fn count_words(input: &str) -> usize {\n    input.split_whitespace().count()\n}\n" },
        ],
        exercise: {
          id: "mini-count-words",
          prompt: "Implement count_words returning the number of words (split_whitespace) in input.",
          starterCode: "pub fn count_words(input: &str) -> usize {\n    // split on whitespace and count the words\n    todo!()\n}\n\nfn main() {}\n",
          tests: "#[cfg(test)]\nmod tests {\n    use super::*;\n    #[test]\n    fn counts_words() {\n        assert_eq!(count_words(\"rust is fast\"), 3);\n        assert_eq!(count_words(\"  spaced   out  \" ), 2);\n    }\n}\n",
          checks: { mustInclude: ["split_whitespace"] },
        },
      },
      {
        title: "Formatting a summary",
        content:
          "Once you have a count, build a friendly string like \"Words: 3\". This mirrors what a CLI might print to stdout after parsing args.",
        quiz: [
          {
            prompt: "Which macro prints to stdout?",
            options: ["println!", "eprintln!", "panic!", "dbg!"],
            answerIndex: 0,
            explanation: "println! writes to standard output.",
          },
        ],
        examples: [
          { title: "Make a summary", code: "fn summary(count: usize) -> String {\n    format!(\"Words: {}\", count)\n}\n" },
        ],
        exercise: {
          id: "mini-summary",
          prompt: "Given a count, return a summary string like \"Words: 4\".",
          starterCode: "pub fn summary(count: usize) -> String {\n    // format the message\n    todo!()\n}\n\nfn main() {}\n",
          tests: "#[cfg(test)]\nmod tests {\n    use super::*;\n    #[test]\n    fn formats_summary() {\n        assert_eq!(summary(4), \"Words: 4\");\n    }\n}\n",
          checks: { mustInclude: ["format!"] },
        },
      },
    ],
    quiz: [
      {
        prompt: "What standard library function can you use to read CLI args?",
        options: ["std::env::args", "std::cli::read", "std::fs::args", "std::io::argv"],
        answerIndex: 0,
        explanation: "std::env::args() iterates over command-line arguments.",
      },
      {
        prompt: "Write a tiny function that takes &str input and returns a String summary with the word count (e.g., \"Words: 2\").",
        options: ["(open-ended coding prompt)", "It cannot be done", "Requires unsafe", "Needs nightly"],
        answerIndex: 0,
        explanation: "Combine split_whitespace().count() with format!(\"Words: {}\", count).",
      },
    ],
  },
  // Intermediate
  {
    id: "structs-enums",
    title: "Structs & Enums",
    level: "Intermediate",
    description: "Define data shapes with structs and enums; pattern match over them.",
    sections: [
      {
        title: "Struct definitions",
        content: "Named structs give fields; tuple structs are positional. Use impl blocks for methods.",
        examples: [ { title: "Point struct", code: "struct Point { x:i32, y:i32 }\nimpl Point { fn manhattan(&self)->i32 { self.x.abs()+self.y.abs() } }" } ],
        quiz: [
          { prompt: "How do you declare a struct?", options: ["struct Name { ... }", "class Name {}", "type Name {}", "new struct {}"], answerIndex: 0, explanation: "Rust uses struct keyword with fields." },
        ],
        exercise: {
          id: "structs-rect-area",
          prompt: "Define a Rect { width: u32, height: u32 } and add an area method returning width * height.",
          starterCode: "pub struct Rect { pub width: u32, pub height: u32 }\n\nimpl Rect {\n    // add area here\n}\n\nfn main() {}\n",
          tests: "#[cfg(test)]\nmod tests {\n    use super::*;\n    #[test]\n    fn area() {\n        let r = Rect { width: 3, height: 4 };\n        assert_eq!(r.area(), 12);\n    }\n}\n",
          checks: { mustInclude: ["struct Rect", "impl Rect", "area"] },
        },
      },
      {
        title: "Enums and match",
        content: "Enums encode variants. match lets you destructure each possibility.",
        examples: [ { title: "Message enum", code: "enum Message { Quit, Move { x:i32, y:i32 } }\nfn handle(msg:Message){ match msg { Message::Quit => println!(\"bye\"), Message::Move {x,y} => println!(\"{},{}\", x,y), } }" } ],
        quiz: [
          { prompt: "match on an enum must be...", options: ["Exhaustive", "Optional"], answerIndex: 0, explanation: "All variants must be handled." },
        ],
        exercise: {
          id: "enums-status-describe",
          prompt: "Define Status { Ok, NotFound } and return \"ok\" or \"not found\" from describe().",
          starterCode: "pub enum Status { Ok, NotFound }\n\npub fn describe(s: Status) -> &'static str {\n    // match here\n    todo!()\n}\n\nfn main() {}\n",
          tests: "#[cfg(test)]\nmod tests {\n    use super::*;\n    #[test]\n    fn describes() {\n        assert_eq!(describe(Status::Ok), \"ok\");\n        assert_eq!(describe(Status::NotFound), \"not found\");\n    }\n}\n",
          checks: { mustInclude: ["match", "Status"] },
        },
      },
      {
        title: "Traffic light enum",
        content: "Practice variant matching by returning a wait time for each light color.",
        examples: [ { title: "TrafficLight", code: "pub enum TrafficLight { Red, Yellow, Green }\nimpl TrafficLight { pub fn time_to_wait(&self) -> u8 { match self { TrafficLight::Red => 30, TrafficLight::Yellow => 5, TrafficLight::Green => 0 } } }" } ],
        quiz: [
          { prompt: "Which match arm set covers all lights?", options: ["Red/Yellow/Green", "Only Red", "Only Green"], answerIndex: 0, explanation: "Handle every variant." },
        ],
        exercise: {
          id: "structs-traffic-light",
          prompt: "Create TrafficLight enum with Red/Yellow/Green and time_to_wait method.",
          starterCode: "pub enum TrafficLight { Red, Yellow, Green }\nimpl TrafficLight { pub fn time_to_wait(&self) -> u8 { todo!() } }\nfn main() {}\n",
          tests: "#[cfg(test)]\nmod tests {\n    use super::*;\n    #[test]\n    fn waits_match_light(){ assert_eq!(TrafficLight::Red.time_to_wait(),30); assert_eq!(TrafficLight::Yellow.time_to_wait(),5); assert_eq!(TrafficLight::Green.time_to_wait(),0); } }\n",
          checks: { mustInclude: ["TrafficLight", "match"] },
        },
      },
    ],
    quiz: [
      { prompt: "How to reference an enum variant?", options: ["Type::Variant", "Type.Variant"], answerIndex: 0, explanation: "Use Type::Variant." },
      { prompt: "match expressions must be...", options: ["Exhaustive", "Mutable"], answerIndex: 0, explanation: "All variants handled." },
      { prompt: "How do you define a struct with fields?", options: ["struct Name { ... }", "class Name {}", "type Name {}", "fn struct"], answerIndex: 0, explanation: "Use struct with named fields." },
      { prompt: "What should time_to_wait return for TrafficLight::Green?", options: ["0", "5", "30", "panic"], answerIndex: 0, explanation: "Green should wait 0 seconds." },
    ],
  },
  {
    id: "functions-basics",
    title: "Functions",
    level: "Intermediate",
    description: "Define functions, parameters, returns, and references.",
    sections: [
      {
        title: "Function signatures",
        content: "fn name(params) -> ReturnType defines a function. Use explicit types; return the last expression or use return.",
        examples: [
          {
            title: "Add function",
            code: "fn add(a: i32, b: i32) -> i32 {\n    a + b\n}\n",
          },
        ],
        quiz: [
          { prompt: "Where do you specify return type?", options: ["After ->", "Before fn", "In comments", "You don't"], answerIndex: 0, explanation: "Use -> ReturnType." },
        ],
        exercise: {
          id: "functions-add-twice",
          prompt: "Write add_twice(a,b) that returns (a+b)*2.",
          starterCode: "pub fn add_twice(a:i32, b:i32) -> i32 {\n    todo!()\n}\n\nfn main() {}\n",
          tests: "#[cfg(test)]\nmod tests { use super::*; #[test] fn adds_twice(){ assert_eq!(add_twice(2,3),10); } }\n",
        },
      },
      {
        title: "Passing references",
        content: "Pass references (&T) to avoid moves. Use &mut T when the function needs to mutate. Choose ownership vs borrowing intentionally.",
        examples: [
          {
            title: "Borrowing param",
            code: "fn len(s: &String) -> usize {\n    s.len()\n}\n",
          },
        ],
        quiz: [
          { prompt: "Why pass &T?", options: ["To avoid moving ownership", "To copy values", "To allocate", "To panic"], answerIndex: 0, explanation: "Borrowing avoids moves/copies." },
        ],
        exercise: {
          id: "functions-append-exclaim",
          prompt: "Append '!' to a String via &mut and return its new length.",
          starterCode: "pub fn shout_len(msg: &mut String) -> usize {\n    todo!()\n}\n\nfn main() {}\n",
          tests: "#[cfg(test)]\nmod tests { use super::*; #[test] fn appends() { let mut m=String::from(\"hi\"); assert_eq!(shout_len(&mut m),3); assert_eq!(m, \"hi!\"); } }\n",
        },
      },
    ],
    quiz: [
      { prompt: "Where does return type go?", options: ["After ->", "Before name"], answerIndex: 0, explanation: "Use -> ReturnType." },
      { prompt: "Why pass &T into a function?", options: ["To avoid moving ownership", "To panic", "To allocate heap", "To clone values"], answerIndex: 0, explanation: "Borrowing avoids transferring ownership." },
    ],
  },
  {
    id: "methods-impls",
    title: "Methods & impl",
    level: "Intermediate",
    description: "Implement methods with self, associated functions, and ownership choices.",
    sections: [
      {
        title: "Methods with self",
        content: "Methods live in impl blocks. &self for read-only, &mut self to mutate, self to take ownership.",
        examples: [ { title: "Counter inc", code: "struct Counter { value:i32 }\nimpl Counter { fn inc(&mut self) { self.value += 1; } }" } ],
        quiz: [
          { prompt: "What does &self mean?", options: ["Borrow immutably", "Take ownership", "Mutable borrow", "Static method"], answerIndex: 0, explanation: "&self borrows immutably inside a method." },
        ],
        exercise: {
          id: "methods-counter",
          prompt: "Add inc returning new value on Counter.",
          starterCode: "pub struct Counter { pub value: i32 }\nimpl Counter {\n    // add inc\n}\nfn main() {}\n",
          tests: "#[cfg(test)]\nmod tests { use super::*; #[test] fn increments(){ let mut c=Counter{value:0}; assert_eq!(c.inc(),1); assert_eq!(c.inc(),2); } }\n",
        },
      },
      {
        title: "Associated functions",
        content: "Functions inside impl without self are associated functions (often constructors like new). Call with Type::function().",
        examples: [ { title: "new constructor", code: "struct User { name:String }\nimpl User { fn new(name:&str)->Self { Self { name:name.to_string() } } }" } ],
        quiz: [
          { prompt: "How do you call an associated function?", options: ["Type::function()", "value.function()", "function value", "function::Type"], answerIndex: 0, explanation: "Associated functions use path syntax Type::function()." },
        ],
        exercise: {
          id: "methods-new",
          prompt: "Implement new on Point {x,y} to construct from (i32,i32).",
          starterCode: "pub struct Point { pub x: i32, pub y: i32 }\nimpl Point {\n    // add new here\n}\nfn main() {}\n",
          tests: "#[cfg(test)]\nmod tests { use super::*; #[test] fn builds(){ let p=Point::new(1,2); assert_eq!(p.x,1); assert_eq!(p.y,2); } }\n",
        },
      },
    ],
    quiz: [
      { prompt: "How to call a method?", options: ["value.method()", "method value"], answerIndex: 0, explanation: "Use dot syntax." },
      { prompt: "How do you call an associated function?", options: ["Type::function()", "value.function()"], answerIndex: 0, explanation: "Associated functions use Type::function()." },
    ],
  },
  {
    id: "traits-basics",
    title: "Traits",
    level: "Intermediate",
    description: "Define traits, implement them, and use trait bounds.",
    sections: [
      {
        title: "Defining traits",
        content: "Traits describe required behavior. Implement with impl Trait for Type. Traits can include default methods.",
        examples: [
          {
            title: "Trait + default",
            code:
              "trait Greeter {\n    fn greet(&self) -> String {\n        \"hi\".to_string()\n    }\n}\n\nstruct User;\n\nimpl Greeter for User {}\n",
          },
        ],
        quiz: [
          { prompt: "What does a trait define?", options: ["Behavior contract", "Struct fields", "Modules", "Crates"], answerIndex: 0, explanation: "Traits describe required methods/associated items." },
        ],
        exercise: {
          id: "traits-default",
          prompt: "Define Greeter with default greet() returning 'hi' and implement for User.",
          starterCode: "pub trait Greeter {\n    // add default greet\n}\n\npub struct User;\n\nimpl Greeter for User {}\n\nfn main() {}\n",
          tests: "#[cfg(test)]\nmod tests { use super::*; #[test] fn greets(){ let u=User; assert_eq!(u.greet(), \"hi\"); } }\n",
        },
      },
      {
        title: "Trait bounds",
        content: "Use trait bounds (T: Trait) to constrain generics. You can bound lifetimes or multiple traits (T: Display + Clone).",
        examples: [
          {
            title: "Generic display",
            code:
              "use std::fmt::Display;\n\nfn shout<T: Display>(t: T) -> String {\n    format!(\"{}!\", t)\n}\n",
          },
        ],
        quiz: [
          { prompt: "What does T: Display mean?", options: ["T implements Display", "T equals Display"], answerIndex: 0, explanation: "It's a trait bound." },
        ],
        exercise: {
          id: "traits-sum",
          prompt: "Implement a Summable trait for Vec<i32> that returns the sum of elements.",
          starterCode: "pub trait Summable { fn sum_items(&self) -> i32; }\nimpl Summable for Vec<i32> { fn sum_items(&self) -> i32 { todo!() } }\nfn main() {}\n",
          tests: "#[cfg(test)]\nmod tests { use super::*; #[test] fn sums_vector(){ let nums=vec![1,2,3]; assert_eq!(nums.sum_items(),6); } }\n",
        },
      },
    ],
    quiz: [
      { prompt: "What does T: Display mean?", options: ["T implements Display", "T equals Display"], answerIndex: 0, explanation: "Trait bound." },
      { prompt: "Trait definitions contain...", options: ["Method signatures", "Struct fields"], answerIndex: 0, explanation: "Traits list behavior." },
      { prompt: "What can traits provide by default?", options: ["Method bodies", "Struct fields", "Modules", "Enums"], answerIndex: 0, explanation: "Traits can include default method implementations." },
    ],
  },
  {
    id: "generics-basics",
    title: "Generics",
    level: "Intermediate",
    description: "Generic functions and types; monomorphization; when to use them.",
    sections: [
      {
        title: "Generic functions",
        content: "Use type parameters to write reusable code. Bounds constrain capabilities. The compiler monomorphizes at compile time for used types.",
        examples: [
          {
            title: "Generic max",
            code:
              "fn max<T: PartialOrd>(a: T, b: T) -> T {\n    if a > b {\n        a\n    } else {\n        b\n    }\n}\n",
          },
        ],
        quiz: [
          { prompt: "When are generics specialized?", options: ["Compile time", "Runtime"], answerIndex: 0, explanation: "Rust monomorphizes generics at compile time." },
        ],
        exercise: {
          id: "generics-max",
          prompt: "Write a generic min<T: PartialOrd> that returns the smaller of two values.",
          starterCode: "pub fn min<T: PartialOrd>(a: T, b: T) -> T {\n    todo!()\n}\n\nfn main() {}\n",
          tests: "#[cfg(test)]\nmod tests { use super::*; #[test] fn finds_min(){ assert_eq!(min(1,2),1); assert_eq!(min(\"b\",\"a\"),\"a\"); } }\n",
        },
      },
      {
        title: "Generic types",
        content: "Structs and enums can be generic (struct Wrapper<T> { value: T }). Use where clauses for readability when bounds are long.",
        examples: [
          {
            title: "Wrapper",
            code: "struct Wrapper<T> {\n    value: T,\n}\n",
          },
        ],
        quiz: [
          { prompt: "Can structs be generic?", options: ["Yes", "No"], answerIndex: 0, explanation: "Structs and enums can have type parameters." },
        ],
        exercise: {
          id: "generics-wrapper",
          prompt: "Create a Wrapper<T> struct with new and value methods.",
          starterCode: "pub struct Wrapper<T> { pub value: T }\nimpl<T> Wrapper<T> {\n    pub fn new(value:T)->Self { todo!() }\n    pub fn value(&self) -> &T { todo!() }\n}\nfn main() {}\n",
          tests: "#[cfg(test)]\nmod tests { use super::*; #[test] fn wraps(){ let w=Wrapper::new(5); assert_eq!(*w.value(),5); } }\n",
        },
      },
    ],
    quiz: [ { prompt: "What is monomorphization?", options: ["Compile-time specialization", "Runtime dispatch"], answerIndex: 0, explanation: "Generics generate concrete versions at compile time." } ],
  },
  {
    id: "modules-cargo",
    title: "Modules, Crates, and Cargo",
    level: "Intermediate",
    description: "Organize code with modules, library vs binary crates, and Cargo features.",
    sections: [
      { title: "Modules", content: "mod declares modules. pub exposes items. use brings names into scope.", examples: [ { title: "Simple module", code: "mod math { pub fn double(n:i32)->i32 { n*2 } }\nfn main(){ println!(\"{}\", math::double(4)); }" } ], quiz: [ { prompt: "How do you expose an item?", options: ["pub", "mut", "use", "mod"], answerIndex: 0, explanation: "pub makes items visible outside the module." } ], exercise: { id: "modules-mod-fizz", prompt: "Create a greetings module with a pub fn hi() returning \"hi\".", starterCode: "mod greetings {\n    // add pub fn hi\n}\n\nfn main() {}\n", tests: "#[cfg(test)]\nmod tests { use super::*; #[test] fn greets(){ assert_eq!(greetings::hi(), \"hi\"); } }\n", checks: { mustInclude: ["mod greetings", "pub fn hi"] } } },
      { title: "Binary vs library", content: "Binary crates use src/main.rs; libraries use src/lib.rs. Workspaces manage multiple crates.", examples: [ { title: "Cargo commands", code: "cargo fmt\ncargo test\ncargo doc --open" } ], quiz: [ { prompt: "Where is library root?", options: ["src/lib.rs", "src/main.rs"], answerIndex: 0, explanation: "Library crates start at src/lib.rs." }, { prompt: "What does pub use do?", options: ["Re-export an item", "Format code", "Run tests", "Build docs"], answerIndex: 0, explanation: "pub use re-exports names for consumers." } ], exercise: { id: "modules-lib-fn", prompt: "Write a lib-style function helper() that returns 42.", starterCode: "// imagine this is in src/lib.rs\npub fn helper() -> i32 {\n    todo!()\n}\n\nfn main() {}\n", tests: "#[cfg(test)]\nmod tests { use super::*; #[test] fn helps(){ assert_eq!(helper(), 42); } }\n", checks: { mustInclude: ["pub fn helper"] } } },
      {
        title: "Visibility and use",
        content: "Items private by default; pub exposes. use brings paths into scope. pub use re-exports for cleaner APIs.",
        examples: [ { title: "Re-export", code: "mod math { pub fn double(n:i32)->i32{ n*2 } }\npub use math::double;" } ],
        exercise: {
          id: "modules-reexport",
          prompt: "Create utils module with pub triple and re-export at crate root.",
          starterCode: "mod utils {\n    // add pub fn triple\n}\n// re-export here\n\nfn main() {}\n",
          tests: "#[cfg(test)]\nmod tests { use super::*; #[test] fn triples(){ assert_eq!(triple(3),9); } }\n",
          checks: { mustInclude: ["mod utils", "pub fn triple", "pub use"] },
        },
      },
    ],
    quiz: [ { prompt: "Where is library root?", options: ["src/lib.rs", "src/main.rs"], answerIndex: 0, explanation: "Libraries start at src/lib.rs." } ],
  },
  {
    id: "error-handling",
    title: "Error Handling",
    level: "Intermediate",
    description: "Use Result, Option, and the ? operator to propagate errors.",
    sections: [
      {
        title: "Result and Option",
        content: "Result<T,E> models success/failure; Option<T> for optional data.",
        examples: [
          {
            title: "Parsing",
            code:
              "fn parse_num(input: &str) -> Result<i32, _> {\n    input.parse::<i32>()\n}\n",
          },
        ],
        quiz: [
          {
            prompt: "What does Option represent?",
            options: ["Some/None", "Ok/Err"],
            answerIndex: 0,
            explanation: "Option is for optional values.",
          },
        ],
        exercise: {
          id: "error-maybe-first",
          prompt: "Return the first char of a &str as Option<char> (None if empty).",
          starterCode:
            "pub fn maybe_first(s: &str) -> Option<char> {\\n    todo!()\\n}\\n\\nfn main() {}\\n",
          tests:
            "#[cfg(test)]\\nmod tests { use super::*; #[test] fn works(){ assert_eq!(maybe_first(\\\"rust\\\"), Some('r')); assert_eq!(maybe_first(\\\"\\\"), None); } }\\n",
        },
      },
      {
        title: "? operator",
        content: "? early-returns on errors, simplifying propagation.",
        examples: [
          {
            title: "Propagate",
            code:
              "fn first_digit(text: &str) -> Result<i32, _> {\n    let ch = text.chars().next().unwrap_or('0');\n    let s = ch.to_string();\n    s.parse::<i32>()\n}\n",
          },
        ],
        quiz: [
          {
            prompt: "What does ? do on Err?",
            options: ["Returns early", "Panics", "Ignores"],
            answerIndex: 0,
            explanation: "It returns the Err to the caller.",
          },
        ],
        exercise: {
          id: "error-first-digit",
          prompt: "Use ? to return the first digit of a &str as i32, or an error if not a digit.",
          starterCode:
            "pub fn first_digit(text: &str) -> Result<i32, std::num::ParseIntError> {\\n    // use ? to propagate parse errors\\n    todo!()\\n}\\n\\nfn main() {}\\n",
          tests:
            "#[cfg(test)]\\nmod tests { use super::*; #[test] fn parses() { assert_eq!(first_digit(\\\"9abc\\\"), Ok(9)); assert!(first_digit(\\\"\\\").is_err()); } }\\n",
        },
      },
      {
        title: "Custom errors and mapping",
        content: "Define your own error enums and use map_err to convert lower-level errors into them for context.",
        examples: [
          {
            title: "Custom error",
            code:
              "#[derive(Debug)]\nenum ParseError { Empty, NotNumber }\nfn parse_num(s: &str) -> Result<i32, ParseError> {\n    let s = s.trim();\n    if s.is_empty() {\n        return Err(ParseError::Empty);\n    }\n    s.parse::<i32>().map_err(|_| ParseError::NotNumber)\n}\n",
          },
        ],
        exercise: {
          id: "error-custom",
          prompt: "Create AppError {Empty, InvalidNumber} and use it in parse_positive.",
          starterCode: "#[derive(Debug)]\npub enum AppError { Empty, InvalidNumber }\n\npub fn parse_positive(input: &str) -> Result<u32, AppError> {\n    todo!()\n}\n\nfn main() {}\n",
          tests: "#[cfg(test)]\nmod tests { use super::*; #[test] fn parses_positive(){ assert_eq!(parse_positive(\" 5 \"), Ok(5)); assert!(parse_positive(\"0\").is_err()); assert!(parse_positive(\" \" ).is_err()); } }\n",
          checks: { mustInclude: ["AppError", "Result"] },
        },
      },
    ],
    quiz: [ { prompt: "What does ? expand to?", options: ["match returning early", "panic"], answerIndex: 0, explanation: "? propagates errors via match." } ],
    exercise: {
      id: "error-parse-port",
      prompt: "Implement parse_port that parses a &str into u16 and returns Result.",
      starterCode: "pub fn parse_port(input: &str) -> Result<u16, String> {\n    todo!()\n}\n\nfn main() {}\n",
      tests: "#[cfg(test)]\nmod tests { use super::*; #[test] fn parses_valid_port(){ assert_eq!(parse_port(\"8080\"), Ok(8080)); } #[test] fn rejects_invalid(){ assert!(parse_port(\"-1\").is_err()); assert!(parse_port(\"abc\").is_err()); } }\n",
      checks: { mustInclude: ["Result", "parse"] },
    },
  },
  {
    id: "collections-iterators",
    title: "Collections & Iterators",
    level: "Intermediate",
    description: "Vectors, hash maps, and iterator adapters like map/filter.",
    sections: [
      {
        title: "Iterator chains",
        content: "Iterators are lazy; adapters build pipelines; collect realizes them.",
        examples: [
          {
            title: "Map and collect",
            code:
              "let evens: Vec<i32> = (0..6)\n    .filter(|n| n % 2 == 0)\n    .collect();\n",
          },
        ],
        quiz: [
          {
            prompt: "What does collect do?",
            options: ["Materializes into a collection", "Sorts", "Clones items", "Mutates in place"],
            answerIndex: 0,
            explanation: "collect consumes an iterator into a collection.",
          },
        ],
        exercise: {
          id: "iter-squares",
          prompt: "Use iterator adapters to return squares of numbers 0..5 in a Vec<i32>.",
          starterCode: "pub fn squares() -> Vec<i32> {\n    // build from a range with iterators\n    todo!()\n}\n\nfn main() {}\n",
          tests: "#[cfg(test)]\nmod tests { use super::*; #[test] fn builds_squares(){ assert_eq!(squares(), vec![0,1,4,9,16,25]); } }\n",
          checks: { mustInclude: ["collect"] },
        },
      },
      {
        title: "Vectors revisited",
        content: "Vec<T> is growable. Borrowed iteration avoids moves; into_iter consumes.",
        examples: [
          {
            title: "Borrowed iteration",
            code:
              "fn sum(vec: &Vec<i32>) -> i32 {\n    vec.iter().sum()\n}\n",
          },
        ],
        quiz: [ { prompt: "Does Vec<T> grow?", options: ["Yes", "No"], answerIndex: 0, explanation: "Vec is growable." } ],
        exercise: {
          id: "collections-evens",
          prompt: "Return Vec<i32> of even numbers using iterators.",
          starterCode: "pub fn evens(values: Vec<i32>) -> Vec<i32> {\n    todo!()\n}\n\nfn main() {}\n",
          tests: "#[cfg(test)]\nmod tests { use super::*; #[test] fn filters_evens(){ assert_eq!(evens(vec![1,2,3,4]), vec![2,4]); } }\n",
          checks: { mustInclude: ["filter", "collect"] },
        },
      },
      {
        title: "HashMap review",
        content: "insert adds entries; get returns Option; entry/or_insert updates counts.",
        examples: [
          {
            title: "Count words",
            code:
              "use std::collections::HashMap;\n\nfn count_words(text: &str) -> HashMap<&str, usize> {\n    let mut map = HashMap::new();\n    for w in text.split_whitespace() {\n        *map.entry(w).or_insert(0) += 1;\n    }\n    map\n}\n",
          },
        ],
        quiz: [ { prompt: "What does entry().or_insert do?", options: ["Inserts default if missing", "Removes key", "Sorts keys", "Panics"], answerIndex: 0, explanation: "entry/or_insert initializes missing keys." } ],
        exercise: {
          id: "collections-merge",
          prompt: "Given two HashMaps, produce a new map summing matching keys.",
          starterCode: "use std::collections::HashMap;\n\npub fn merge_sum(a:&HashMap<String,i32>, b:&HashMap<String,i32>) -> HashMap<String,i32> {\n    todo!()\n}\n\nfn main() {}\n",
          tests: "#[cfg(test)]\nmod tests { use super::*; #[test] fn merges(){ let mut a=HashMap::new(); a.insert(\"x\".into(),1); let mut b=HashMap::new(); b.insert(\"x\".into(),2); b.insert(\"y\".into(),3); let merged=merge_sum(&a,&b); assert_eq!(merged.get(\"x\"), Some(&3)); assert_eq!(merged.get(\"y\"), Some(&3)); } }\n",
        },
      },
      {
        title: "Building pipelines",
        content: "Combine map, filter, fold to express transforms succinctly. fold accumulates a result while iterating.",
        examples: [
          {
            title: "Fold sum of squares",
            code:
              "fn sum_squares(nums: &[i32]) -> i32 {\n    nums.iter()\n        .map(|n| n * n)\n        .fold(0, |acc, n| acc + n)\n}\n",
          },
        ],
        quiz: [ { prompt: "What does fold do?", options: ["Accumulates over iterator", "Sorts items"], answerIndex: 0, explanation: "fold combines items into a single value." } ],
        exercise: {
          id: "collections-fold",
          prompt: "Use iterators to compute product of positive numbers in a slice.",
          starterCode: "pub fn product_positive(nums:&[i32]) -> i32 {\n    todo!()\n}\n\nfn main() {}\n",
          tests: "#[cfg(test)]\nmod tests { use super::*; #[test] fn multiplies(){ assert_eq!(product_positive(&[1,-2,3,4]),12); assert_eq!(product_positive(&[-1,-2]),1); } }\n",
          checks: { mustInclude: ["filter", "fold"] },
        },
      },
    ],
  },
  // Advanced
  {
    id: "lifetimes",
    title: "Lifetimes in Practice",
    level: "Advanced",
    description: "Annotate lifetimes on functions and structs to express borrowing relationships.",
    sections: [
      {
        title: "Longest string",
        content: "Tie output lifetime to inputs to avoid dangling refs.",
        examples: [
          {
            title: "longest",
            code:
              "fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {\n    if x.len() > y.len() {\n        x\n    } else {\n        y\n    }\n}\n",
          },
        ],
      },
      {
        title: "Structs with references",
        content: "Structs holding references need explicit lifetimes on fields and impl blocks.",
        examples: [
          {
            title: "Excerpt",
            code:
              "struct Excerpt<'a> {\n    part: &'a str,\n}\n\nimpl<'a> Excerpt<'a> {\n    fn len(&self) -> usize {\n        self.part.len()\n    }\n}\n",
          },
        ],
      },
    ],
    quiz: [ { prompt: "When require explicit lifetimes?", options: ["When returning refs tied to inputs", "Never"], answerIndex: 0, explanation: "When inference insufficient." } ],
    exercise: {
      id: "lifetimes-longest",
      prompt: "Write longest returning longer of two &str with lifetimes.",
      starterCode: "pub fn longest<'a>(a:&'a str, b:&'a str) -> &'a str {\n    todo!()\n}\nfn main() {}\n",
      tests: "#[cfg(test)]\nmod tests { use super::*; #[test] fn picks_longer(){ let a=String::from(\"short\"); let b=String::from(\"much longer\"); assert_eq!(longest(&a,&b), \"much longer\"); } }\n",
      checks: { mustInclude: ["'a", "&str"] },
    },
  },
  {
    id: "smart-pointers",
    title: "Smart Pointers & Interior Mutability",
    level: "Advanced",
    description: "Box, Rc, Arc, and interior mutability with RefCell/Mutex.",
    sections: [
      {
        title: "Reference counting",
        content: "Rc<T> enables shared ownership single-threaded; RefCell<T> enables interior mutability at runtime.",
        examples: [
          {
            title: "Rc with RefCell",
            code:
              "use std::cell::RefCell;\nuse std::rc::Rc;\n\nfn main() {\n    let shared = Rc::new(RefCell::new(0));\n    let a = shared.clone();\n    *a.borrow_mut() += 1;\n    println!(\"{}\", shared.borrow());\n}\n",
          },
        ],
      },
      {
        title: "Box for recursion",
        content: "Box<T> allocates on the heap; useful for recursive types and trait objects.",
        examples: [
          {
            title: "List with Box",
            code: "enum List {\n    Cons(i32, Box<List>),\n    Nil,\n}\n",
          },
        ],
      },
    ],
    quiz: [ { prompt: "What does Rc<T> provide?", options: ["Shared ownership", "Thread-safe"], answerIndex: 0, explanation: "Rc is single-threaded shared ownership." } ],
    exercise: {
      id: "smart-counter",
      prompt: "Use Rc<RefCell<i32>> to increment a shared counter and return its new value.",
      starterCode: "use std::cell::RefCell; use std::rc::Rc;\n\npub fn bump(counter: &Rc<RefCell<i32>>) -> i32 {\n    todo!()\n}\n\nfn main() {}\n",
      tests: "#[cfg(test)]\nmod tests { use super::*; #[test] fn increments_shared_counter(){ let counter=Rc::new(RefCell::new(0)); assert_eq!(bump(&counter),1); assert_eq!(bump(&counter),2); } }\n",
      checks: { mustInclude: ["Rc<RefCell"] },
    },
  },
  {
    id: "concurrency",
    title: "Concurrency",
    level: "Advanced",
    description: "Threads, channels, and shared state with Arc<Mutex<_>>.",
    stub: true,
    sections: [
      {
        title: "Threads",
        content: "Use std::thread::spawn; share state with Arc<Mutex<T>>.",
        examples: [
          {
            title: "Spawn thread",
            code:
              "use std::thread;\n\nfn main() {\n    let handle = thread::spawn(|| println!(\"hi\"));\n    handle.join().unwrap();\n}\n",
          },
        ],
      },
    ],
  },
  {
    id: "async",
    title: "Async Rust",
    level: "Advanced",
    description: "async/await basics and futures.",
    stub: true,
    sections: [
      {
        title: "async fn",
        content: "async fn returns a Future; .await drives it in an async runtime.",
        examples: [
          {
            title: "Async function",
            code:
              "async fn fetch() -> Result<(), reqwest::Error> {\n    Ok(())\n}\n",
          },
        ],
      },
    ],
  },
  {
    id: "macros-traits",
    title: "Macros, Trait Objects, and Advanced Patterns",
    level: "Advanced",
    description: "macro_rules! basics, dyn Trait, and associated types.",
    stub: true,
    sections: [
      {
        title: "macro_rules!",
        content: "Declarative macros pattern-match on tokens.",
        examples: [
          {
            title: "vec! idea",
            code:
              "macro_rules! my_vec {\n    ( $( $x:expr ),* ) => {{\n        let mut temp = Vec::new();\n        $( temp.push($x); )*\n        temp\n    }};\n}\n",
          },
        ],
      },
    ],
  },
  {
    id: "unsafe",
    title: "Unsafe Rust Overview",
    level: "Expert",
    description: "Unsafe blocks, raw pointers, and encapsulating invariants.",
    stub: true,
    sections: [
      {
        title: "Unsafe blocks",
        content: "unsafe allows operations the compiler cannot verify; encapsulate behind safe APIs.",
        examples: [
          {
            title: "Raw pointers",
            code:
              "let x = 5;\nlet raw = &x as *const i32;\nunsafe {\n    println!(\"{}\", *raw);\n}\n",
          },
        ],
      },
    ],
  },
  {
    id: "ffi",
    title: "FFI Basics",
    level: "Expert",
    description: "Call C from Rust and expose Rust to other languages.",
    stub: true,
    sections: [
      {
        title: "extern blocks",
        content: "Declare foreign functions with extern \"C\"; ensure types are FFI-safe.",
        examples: [
          {
            title: "Calling C",
            code: "extern \"C\" {\n    fn abs(input: i32) -> i32;\n}\n",
          },
        ],
      },
    ],
  },
  {
    id: "architecture",
    title: "Architecting Larger Rust Codebases",
    level: "Expert",
    description: "Workspaces, crate boundaries, and API design for maintainability.",
    stub: true,
    sections: [ { title: "Workspaces", content: "Workspaces share a Cargo.lock across crates and simplify dependency management.", examples: [ { title: "Workspace manifest", code: "[workspace]\nmembers=[\"api\",\"frontend\"]" } ] } ],
  },
];
