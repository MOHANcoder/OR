const MinifiedNumber = require("./MinifiedNumber");

class Constraint {
    constructor(noOfDecisionVariables, coEfficientsArray, symbol, constant) {
        this.noOfDecisionVariables = noOfDecisionVariables;
        this.coEfficientsArray = coEfficientsArray;
        this.symbol = symbol;
        this.constant = constant;
        this.variables = [];
        if (this.constant.getValue() < 0) {
            this.coEfficientsArray = this.coEfficientsArray.map(x => x.multiply(-1));
            if (this.symbol != "=") {
                switch (this.symbol) {
                    case "<=": this.symbol = ">="; break;
                    case ">=": this.symbol = "<="; break;
                }
            }
            this.constant = (this.constant).multiply(-1);
        }
    }

    toString() {
        let s = "";
        this.coEfficientsArray.forEach((coEfficient, i) => {
            if (i < noOfDecisionVariables) {
                if (i > 0 && coEfficient.getValue() > -1)
                    s += "+";
                s += `${coEfficient}x${i + 1}`; //for decision variables
            } else {
                if (i > 0 && coEfficient.getValue() > -1)
                    s += "+";
                s += `${coEfficient}s${i + 1}`; //for slack and surplus variables
            }
        });
        s += this.symbol + this.constant;
        return s;
    }

    convertToStandardForm(variables, index) {
        if (this.symbol != "=") {
            switch (this.symbol) {
                case "<=": {
                    variables[index].push(new MinifiedNumber(1));
                    break;
                }
                case ">=": {
                    variables[index].push(new MinifiedNumber(-1));
                    break;
                }
            }
            for (let i = 0; i < variables.length; i++) {
                if (i != index) {
                    variables[i].push(new MinifiedNumber(0));
                }
            }
            this.symbol = "=";
        }
    }
}

class ObjectiveFunction {
    constructor(noOfDecisionVariables, type, coEfficientsArray, constraints, nonNegativeConstraints) {
        this.noOfDecisionVariables = noOfDecisionVariables;
        this.constraints = constraints;
        this.coEfficientsArray = coEfficientsArray;
        this.type = type;
        this.variables = [];
        this.nonNegativeConstraints = nonNegativeConstraints;

        if (this.type === "min") {
            this.coEfficientsArray = this.coEfficientsArray.map(coEfficient => coEfficient.multiply(-1));
            this.type = "max";
        }

        for (let i = 0; i < this.constraints.length; i++) {
            this.variables.push(new Array());
        }
    }

    convertToStandardForm() {
        this.constraints.forEach((constraint, i) => {
            constraint.variables = this.variables[i];
            if (constraint.symbol != "=") {
                // Adding slack and surplus variables to the objective function
                this.coEfficientsArray.push(new MinifiedNumber(0));

                let arr = new Array(this.noOfDecisionVariables).map(_ => new MinifiedNumber(0));

                // Adding a non negative constraint for newly added slack and surplus variables
                this.nonNegativeConstraints.push(new Constraint(this.noOfDecisionVariables, arr, ">=", new MinifiedNumber(0)));
            }
            constraint.convertToStandardForm(this.variables, i);
        });

        this.constraints.forEach((constraint, i) => {
            constraint.coEfficientsArray.push(...this.variables[i]);
        });

        // Non negative constraints for each decision variables
        for (let i = 0; i < this.noOfDecisionVariables; i++) {
            // Adding zero as a coefficient for slack and surplus variables 
            for (let j = 0; j < this.variables[0].length; j++) {
                this.nonNegativeConstraints[i].coEfficientsArray.push(new MinifiedNumber(0));
            }
        }

        // Non negative constraints for each surplus or slack variables
        for (let i = this.noOfDecisionVariables; i < this.coEfficientsArray.length; i++) {
            // Adding zero as a coefficient for slack and surplus variables
            for (let j = 0; j < this.variables[0].length; j++) {
                this.nonNegativeConstraints[i].coEfficientsArray.push(new MinifiedNumber(0));
            }
            // Replace the coefficient from 0 to 1 for convert the constraint for the corresponding slack or surplus variable
            this.nonNegativeConstraints[i].coEfficientsArray[i] = new MinifiedNumber(1);
        }
    }

    //Creating an array of constants
    getInitialBasicFeasibleSolution() {
        let solution = Array.from({ length: this.nonNegativeConstraints.length }, _ => new MinifiedNumber(0));
        for (let i = this.noOfDecisionVariables; i < this.nonNegativeConstraints.length; i++) {
            solution[i] = this.constraints[i - this.noOfDecisionVariables].constant;
        }
        return solution;
    }

    printAllConstraints() {
        this.constraints.forEach(constraint => console.log(constraint + ""));
        this.nonNegativeConstraints.forEach(constraint => console.log(constraint + ""));
    }

    displaySimplexTable (simplexTable) {
        let title = "CB|YB|XB";
        for (let i = 1; i <= simplexTable[0].length - 3; i++) {
            title += "|Y" + i;
        }
        console.log(title);
        for (let row of simplexTable) {
            console.log(row[0] + (",Y" + (row[1].add(1))) + "," + row.slice(2));
        }
    }

    solve() {
        this.convertToStandardForm();
        let IBFS = this.getInitialBasicFeasibleSolution();
        let simplexTable = [];
        for (let i = 0; i < this.constraints.length; i++) {
            let row = [];
            // Adding initial cost of decision variable
            row.push(this.coEfficientsArray[this.noOfDecisionVariables + i]);
            // Adding the ith slack or surplus variable
            row.push(new MinifiedNumber(i + this.noOfDecisionVariables));
            // Adding the initial solution for the corresponding slack or surplus variable
            row.push(IBFS[this.noOfDecisionVariables + i]);
            // Adding the coefficients of the constraints
            row.push(...this.constraints[i].coEfficientsArray);
            simplexTable.push(row);
        }

        let zj = Array.from({ length: this.coEfficientsArray.length }, _ => new MinifiedNumber(0));
        let cj = this.coEfficientsArray;
        let isFirstIteration = true;
        let columnsToSkip = 3;
        do {
            if (!isFirstIteration) {
                // Finding pivotal element and moving to next iteration
                let e = new MinifiedNumber(Infinity);
                zj.forEach(z => {
                    e = z.min(z, e);
                });
                console.log("zj values ....");
                console.log(zj.join(" "));

                let pivotalColumn = zj.indexOf(e);
                let row, pivotalRow = 0;
                let pivot, prevValue = new MinifiedNumber(Infinity);
                console.log("min in z = ", e + "", " at index  = ", pivotalColumn);
                for (row = 0; row < simplexTable.length; row++) {
                    if (simplexTable[row][pivotalColumn + columnsToSkip].isNegative()) {
                        continue;
                    }
                    let value = simplexTable[row][2].divide(simplexTable[row][pivotalColumn + columnsToSkip]);
                    if (value.min(value, prevValue) === value) {
                        pivot = simplexTable[row][pivotalColumn + columnsToSkip];
                        pivotalRow = row;
                        prevValue = value;
                    }
                }
                if (pivot === undefined) {
                    console.log("This system of equations has no solution or has many solutions or unbounded solution.");
                    return;
                }
                console.log("pivotal row = ", pivotalRow, "pivotal column = ", pivotalColumn, "pivot  = ", pivot + "");
                simplexTable[pivotalRow][0] = cj[pivotalColumn];
                simplexTable[pivotalRow][1].changeValue(pivotalColumn);
                let modifiedSimplexTable = new Array(simplexTable.length);
                for (let i = 0; i < simplexTable.length; i++) {
                    let t = [];
                    for (let j = 0; j < simplexTable[i].length; j++) {
                        t.push(simplexTable[i][j]);
                    }
                    modifiedSimplexTable[i] = t;
                }

                for (let column = 2; column < simplexTable[0].length; column++) {
                    modifiedSimplexTable[pivotalRow][column] = simplexTable[pivotalRow][column].divide(pivot);
                }
                for (let row = 0; row < simplexTable.length; row++) {
                    if (row == pivotalRow) {
                        continue;
                    }
                    for (let column = 2; column < simplexTable[0].length; column++) {
                        modifiedSimplexTable[row][column] = simplexTable[row][column].subtract(simplexTable[pivotalRow][column].multiply(simplexTable[row][pivotalColumn + columnsToSkip]).divide(pivot));
                    }
                }
                simplexTable = modifiedSimplexTable;
            }

            zj.forEach(z => z.changeValue(0));

            for (let row = 0; row < simplexTable.length; row++) {
                for (let i = 0; i < zj.length; i++) {
                    zj[i] = zj[i].add(simplexTable[row][0].multiply(simplexTable[row][columnsToSkip + i]));
                }
            }

            zj = zj.map((z, i) => z.subtract(cj[i])); //Calculating the zj-cj values

            isFirstIteration = false;

            this.displaySimplexTable(simplexTable);

        } while (zj.some(z => z.isNegative())); //Check for any negative zj-cj values
    }

    toString() {
        let s = "";
        s += this.type + " z = ";
        this.coEfficientsArray.forEach((coEfficient, i) => {
            if (i < noOfDecisionVariables) {
                if (i > 0 && coEfficient.getValue() > -1)
                    s += "+";
                s += `${coEfficient}x${i + 1}`;
            } else {
                if (i > 0 && coEfficient.getValue() > -1)
                    s += "+";
                s += `${coEfficient}s${i + 1}`;
            }
        });
        return s;
    }
}

module.exports = {
    Constraint,
    ObjectiveFunction
};