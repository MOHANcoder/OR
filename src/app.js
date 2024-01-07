const MinifiedNumber = require("./MinifiedNumber.js");
const Assignment = require("./assignment.js");
const Transportation = require("./transportation.js");
const {ObjectiveFunction,Constraint} = require("./simplex.js");
const ConsoleOutputGenerator = require("../utils/output_generators/consoleOutput.js");
const HTMLOutputGenerator = require("../utils/output_generators/htmlOutput.js");
const fs = require("fs");
let simplexGenerator = new HTMLOutputGenerator("SIMPLEX");
new ObjectiveFunction(4,"max",
    [new MinifiedNumber(15),new MinifiedNumber(6), new MinifiedNumber(9), new MinifiedNumber(2)],
    [
    new Constraint(4,
        [
            new MinifiedNumber(2),
            new MinifiedNumber(1),
            new MinifiedNumber(5),
            new MinifiedNumber(6,10)
        ],
            "<=",
            new MinifiedNumber(10)
    ),
    new Constraint(4,
        [
            new MinifiedNumber(3),
            new MinifiedNumber(1),
            new MinifiedNumber(3),
            new MinifiedNumber(1,4)
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
],simplexGenerator).solve();

new ObjectiveFunction(3,"min",
    [new MinifiedNumber(1),new MinifiedNumber(-3), new MinifiedNumber(2)],
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
],simplexGenerator).solve();

fs.writeFileSync('index.html',`<html><head><link rel='stylesheet' href='style.css'/></head><body>`,'utf-8');

fs.appendFileSync('index.html',simplexGenerator.getContent(),'utf-8');

let generator = new ConsoleOutputGenerator("ASSIGNMENT");
generator = new HTMLOutputGenerator("ASSIGNMENT");
let p = new Assignment([[18, 26, 17, 11], [13, 28, 14, 26], [38, 19, 18, 15], [19, 26, 24, 10]],generator);
console.log(p.solve());
generator.showMessage("Next problem");
p = new Assignment([[1,4,6,3],[9,7,10,9],[4,5,11,7],[8,7,8,5]],generator);
console.log(p.solve());
generator.showMessage("Next problem");
p = new Assignment([[30,27,31,39],[28,18,28,37],[33,17,29,41],[27,18,30,43],[40,20,27,36]],generator);
console.log(p.solve());
generator.showMessage("Next problem");
p = new Assignment([[32,38,40,28,40],[40,24,28,21,36],[41,27,33,30,37],[22,38,41,36,36],[29,33,40,35,39]],generator);
console.log(p.solve());
generator.showMessage("Next problem");
p = new Assignment([[9,3,1,13,1],[1,17,13,20,5],[0,14,8,11,4],[19,3,0,5,5],[12,8,1,6,2]],generator);
console.log(p.solve());
generator.showMessage("Next problem");
p = new Assignment([[Number.POSITIVE_INFINITY,5,2,0],[4,7,5,6],[5,8,4,3],[3,6,6,2]],generator);
console.log(p.solve());
generator.showMessage("Next problem");
p = new Assignment([[9,11,15,10,11],[12,9,Number.POSITIVE_INFINITY,10,9],[Number.POSITIVE_INFINITY,11,14,11,7],[14,8,12,7,8]],generator);
console.log(p.solve());
generator.showMessage("Next problem");
p = new Assignment([[9,26,15],[13,27,6],[35,20,15],[18,30,20]],generator);
console.log(p.solve());
generator.showMessage("Next problem");
p = new Assignment([[8,7,6],[5,7,8],[6,8,7]],generator);
console.log(p.solve());
generator.showMessage("Next problem");
p = new Assignment([[85,75,65,125,75],[90,78,66,132,78],[75,66,57,114,69],[80,72,60,120,72],[76,64,56,112,68]],generator);
console.log(p.solve());
generator.showMessage("Next problem");
fs.appendFileSync('index.html',generator.getContent(),'utf8');
let transportationGenerator = new ConsoleOutputGenerator("TRANSPORTATION");
transportationGenerator = new HTMLOutputGenerator("TRANSPORTATION");
const p1 = new Transportation([
    [6, 4, 1, 5],
    [8, 9, 2, 7],
    [4, 3, 6, 2]
], [14, 16, 5], [6, 10, 15, 4],transportationGenerator);

// const p1 = new Transportation([
//     [30,30,230],
//     [90,45,170],
//     [250,200,50]
// ],[1,3,4],[4,2,2]);

// const p1 = new Transportation([
//     [95,80,70,60],
//     [75,65,60,50],
//     [70,45,50,40],
//     [60,40,40,30]
// ],[70,40,90,30],[40,50,60,60]);
p1.findIBFSUsingNorthWestCorner();
p1.findIBFSUsingRowMinima();
p1.findIBFSUsingColumnMinima()
p1.findIBFSUsingMatrixMinima();
p1.findIBFSUsingVogelApproximation();

fs.appendFileSync('index.html',transportationGenerator.getContent(),'utf8');
fs.appendFileSync('index.html','</body></html>','utf-8');