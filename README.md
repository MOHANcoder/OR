# operations-research
A Simple NPM package for solving Operations Research Problems

Usage :

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

