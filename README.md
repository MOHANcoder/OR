# operations-research

[![Version](https://img.shields.io/npm/v/operations-research.svg)](https://www.npmjs.com/package/operations-research)
[![Downloads](https://img.shields.io/npm/dt/operations-research)](https://www.npmjs.com/package/operations-research)
[![Documentation](https://img.shields.io/badge/documentation-yes-brightgreen.svg)](https://github.com/MOHANcoder/operations-research/wiki)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/MOHANcoder/operations-research/graphs/commit-activity)
[![License: MIT](https://img.shields.io/github/license/MOHANcoder/operations-research)](https://github.com/MOHANcoder/operations-research/blob/master/LICENSE)

A Simple NPM package for solving Operations Research Problems.
Step By Step solvers for Operations Research problems, Features to export the steps and calculations as a html content or in the console.

## Install

```sh
npm i operations-research
```

## Usage :

## Assignment Problem
```js
const {
    Assignment,
    ConsoleOutputGenerator,
    HTMLOutputGenerator
} = require("operations-research");

const fs = require("fs");

let assignmentConsoleGenerator = new ConsoleOutputGenerator("ASSIGNMENT");
let assignmentHTMLGenerator = new HTMLOutputGenerator("ASSIGNMENT");

let assignmentSample1 = new Assignment([[18, 26, 17, 11], [13, 28, 14, 26], [38, 19, 18, 15], [19, 26, 24, 10]],assignmentConsoleGenerator);
let assignmentSample2 = new Assignment([[1,4,6,3],[9,7,10,9],[4,5,11,7],[8,7,8,5]],assignmentHTMLGenerator);

assignmentSample1.solve(); //See the console for the step by step solution.
assignmentSample2.solve(); //[table,cost,Assignmentmap]

//Now writing the html content that are captured by the generator into index.html

fs.writeFileSync("index.html",`
<html>
<head><title>Operations Research</title>
<style> table,td{ border:1px solid; }
</style>
</head>
<body> ${assignmentHTMLGenerator.getContent()} </body></html>`,'utf8');
```



## Transportation Problem:

```js
const {
    Transportation,
    ConsoleOutputGenerator,
    HTMLOutputGenerator
} = require("operations-research");

const fs = require("fs");


let transportationConsoleGenerator = new ConsoleOutputGenerator("TRANSPORTATION");
let transportationHTMLGenerator = new HTMLOutputGenerator("TRANSPORTATION");

let transportationSample1 = new Transportation([
    [6, 4, 1, 5],
    [8, 9, 2, 7],
    [4, 3, 6, 2]
], [14, 16, 5], [6, 10, 15, 4],transportationConsoleGenerator);
let transportationSample2 = new Transportation([
    [95,80,70,60],
    [75,65,60,50],
    [70,45,50,40],
    [60,40,40,30]
],[70,40,90,30],[40,50,60,60],transportationHTMLGenerator);

transportationSample1.findIBFSUsingNorthWestCorner();
transportationSample1.findIBFSUsingRowMinima();
transportationSample1.findIBFSUsingColumnMinima()
transportationSample1.findIBFSUsingMatrixMinima();
transportationSample1.findIBFSUsingVogelApproximation();


transportationSample2.findIBFSUsingNorthWestCorner();
transportationSample2.findIBFSUsingRowMinima();
transportationSample2.findIBFSUsingColumnMinima()
transportationSample2.findIBFSUsingMatrixMinima();
transportationSample2.findIBFSUsingVogelApproximation();

//Now writing the html content that are captured by the generator into index.html

fs.writeFileSync("index.html",`
<html>
<head><title>Operations Research</title>
<style> table,td{ border:1px solid; }
</style>
</head>
<body> ${transportationHTMLGenerator.getContent()} </body></html>`,'utf8');
```


## Simplex Algorithm:

```js
const {
    Constraint,
    ObjectiveFunction,
    MinifiedNumber,
    ConsoleOutputGenerator,
    HTMLOutputGenerator
} = require("operations-research");

const fs = require("fs");

let simplexConsoleGenerator = new ConsoleOutputGenerator("SIMPLEX");
let simplexHTMLGenerator = new HTMLOutputGenerator("SIMPLEX");

let simplexSample1 = new ObjectiveFunction(4, "max",
    [new MinifiedNumber(15), new MinifiedNumber(6), new MinifiedNumber(9), new MinifiedNumber(2)],
    [
        new Constraint(4,
            [
                new MinifiedNumber(2),
                new MinifiedNumber(1),
                new MinifiedNumber(5),
                new MinifiedNumber(6, 10)
            ],
            "<=",
            new MinifiedNumber(10)
        ),
        new Constraint(4,
            [
                new MinifiedNumber(3),
                new MinifiedNumber(1),
                new MinifiedNumber(3),
                new MinifiedNumber(1, 4)
            ],
            "<=",
            new MinifiedNumber(12)
        ),
        new Constraint(4,
            [
                new MinifiedNumber(7),
                new MinifiedNumber(0),
                new MinifiedNumber(0),
                new MinifiedNumber(1)
            ],
            "<=",
            new MinifiedNumber(35)
        )
    ],
    [
        new Constraint(4,
            [
                new MinifiedNumber(1),
                new MinifiedNumber(0),
                new MinifiedNumber(0),
                new MinifiedNumber(0)
            ],
            ">=",
            new MinifiedNumber(0)
        ),
        new Constraint(4,
            [
                new MinifiedNumber(0),
                new MinifiedNumber(1),
                new MinifiedNumber(0),
                new MinifiedNumber(0)
            ],
            ">=",
            new MinifiedNumber(0)
        ),
        new Constraint(4,
            [
                new MinifiedNumber(0),
                new MinifiedNumber(0),
                new MinifiedNumber(1),
                new MinifiedNumber(0)
            ],
            ">=",
            new MinifiedNumber(0)
        ),
        new Constraint(4,
            [
                new MinifiedNumber(0),
                new MinifiedNumber(0),
                new MinifiedNumber(0),
                new MinifiedNumber(1)
            ],
            ">=",
            new MinifiedNumber(0)
        )
    ], simplexConsoleGenerator);

let simplexSample2 = new ObjectiveFunction(3, "min",
    [new MinifiedNumber(1), new MinifiedNumber(-3), new MinifiedNumber(2)],
    [
        new Constraint(3,
            [
                new MinifiedNumber(3),
                new MinifiedNumber(-1),
                new MinifiedNumber(2)
            ],
            "<=",
            new MinifiedNumber(7)
        ),
        new Constraint(3,
            [
                new MinifiedNumber(-2),
                new MinifiedNumber(4),
                new MinifiedNumber(0)
            ],
            "<=",
            new MinifiedNumber(12)
        ),
        new Constraint(3,
            [
                new MinifiedNumber(-4),
                new MinifiedNumber(3),
                new MinifiedNumber(8)
            ],
            "<=",
            new MinifiedNumber(10)
        )
    ],
    [
        new Constraint(3,
            [
                new MinifiedNumber(1),
                new MinifiedNumber(0),
                new MinifiedNumber(0)
            ],
            ">=",
            new MinifiedNumber(0)
        ),
        new Constraint(3,
            [
                new MinifiedNumber(0),
                new MinifiedNumber(1),
                new MinifiedNumber(0)
            ],
            ">=",
            new MinifiedNumber(0)
        ),
        new Constraint(3,
            [
                new MinifiedNumber(0),
                new MinifiedNumber(0),
                new MinifiedNumber(1)
            ],
            ">=",
            new MinifiedNumber(0)
        )
    ], simplexHTMLGenerator);

simplexSample1.solve();
simplexSample2.solve();

//Now writing the html content that are captured by the generator into index.html

fs.writeFileSync("index.html",`
<html>
<head><title>Operations Research</title>
<style> table,td{ border:1px solid; }
</style>
</head>
<body> ${simplexHTMLGenerator.getContent()} </body></html>`,'utf8');
```
## 👤 Author

This project was made by **S.Mohan**
Feel free to contact me if you have any trouble with this package.

-   Github: [@MOHANcoder](https://www.github.com/MOHANcoder)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!
Feel free to check [issues page](https://github.com/MOHANcoder/operations-research/issues).

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2024 [S.Mohan (MOHANcoder)](https://www.github.com/MOHANcoder).
This project is [MIT](https://github.com/MOHANcoder/operations-research/blob/main/LICENSE) licensed.
