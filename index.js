const MinifiedNumber = require("./src/MinifiedNumber");
const Assignment = require("./src/assignment");
const {Constraint,ObjectiveFunction} = require("./src/simplex");
const Transportation = require("./src/transportation");
const ConsoleOutputGenerator = require("./utils/output_generators/consoleOutput.js");
const HTMLOutputGenerator = require("./utils/output_generators/htmlOutput.js");

/**
 * exporting essential classes
 */

module.exports = {
    MinifiedNumber,
    Assignment,
    Constraint,
    ObjectiveFunction,
    Transportation,
    ConsoleOutputGenerator,
    HTMLOutputGenerator
};