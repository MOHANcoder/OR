const MinifiedNumber = require("./MinifiedNumber");

function Constraint(noOfDecisionVariables, coEfficientsArray, symbol, constant) {
    this.noOfDecisionVariables = noOfDecisionVariables;
    this.coEfficientsArray = coEfficientsArray;
    this.symbol = symbol;
    this.constant = constant;
    this.variables = [];
    if (this.constant < 0) {
        this.coEfficientsArray = this.coEfficientsArray.map(x => -x);
        if (this.symbol != "=") {
            switch (this.symbol) {
                case "<=": this.symbol = ">="; break;
                case ">=": this.symbol = "<="; break;
            }
        }
        this.constant = -this.constant;
    }

    this.toString = function () {
        let s = "";
        this.coEfficientsArray.forEach((coEfficient, i) => {
            if (i < noOfDecisionVariables) {
                if (i > 0 && coEfficient > -1)
                    s += "+"
                s += `${coEfficient}x${i + 1}`;
            } else {
                if (i > 0 && coEfficient > -1)
                    s += "+"
                s += `${coEfficient}s${i + 1}`;
            }
        });
        s += this.symbol + this.constant;
        return s;
    }

    this.convertToStandardForm = function (variables, index) {
        if (this.symbol != "=") {
            switch (this.symbol) {
                case "<=": {
                    variables[index].push(1);
                    break;
                }
                case ">=": {
                    variables[index].push(-1);
                    break;
                }
            }
            for (let i = 0; i < variables.length; i++) {
                if (i != index) {
                    variables[i].push(0);
                }
            }
            this.symbol = "=";
        }
    }
}

function ObjectiveFunction(noOfDecisionVariables, type, coEfficientsArray, constraints, nonNegativeConstraints) {
    this.noOfDecisionVariables = noOfDecisionVariables;
    this.constraints = constraints;
    this.coEfficientsArray = coEfficientsArray;
    this.type = type;
    this.variables = [];
    this.nonNegativeConstraints = nonNegativeConstraints;
    for (let i = 0; i < this.constraints.length; i++) {
        this.variables.push(new Array());
    }

    this.convertToStandardForm = function () {
        this.constraints.forEach((constraint, i) => {
            constraint.variables = this.variables[i];
            if (constraint.symbol != "=") {
                // Adding slack and surplus variables to the objective function
                this.coEfficientsArray.push(0);

                let arr = new Array(this.noOfDecisionVariables).fill(0);
                this.nonNegativeConstraints.push(new Constraint(this.noOfDecisionVariables, arr, ">=", 0));
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
                this.nonNegativeConstraints[i].coEfficientsArray.push(0);
            }
        }

        // Non negative constraints for each surplus or slack variables
        for (let i = this.noOfDecisionVariables; i < this.coEfficientsArray.length; i++) {
            // Adding zero as a coefficient for slack and surplus variables
            for (let j = 0; j < this.variables[0].length; j++) {
                this.nonNegativeConstraints[i].coEfficientsArray.push(0);
            }
            // Replace the coefficient from 0 to 1 for convert the constraint for the corresponding slack or surplus variable
            this.nonNegativeConstraints[i].coEfficientsArray[i] = 1;
        }
    }

    this.getInitialBasicFeasibleSolution = function () {
        let solution = new Array(this.nonNegativeConstraints.length).fill(0);
        for (let i = this.noOfDecisionVariables; i < this.nonNegativeConstraints.length; i++) {
            solution[i] = this.constraints[i - this.noOfDecisionVariables].constant;
        }
        return solution;
    }

    this.printAllConstraints = function () {
        this.constraints.forEach(constraint => console.log(constraint + ""));
        this.nonNegativeConstraints.forEach(constraint => console.log(constraint + ""));
    }

    this.displaySimplexTable = function(simplexTable){
        let title = "CB|YB|XB";
        for(let i = 1;i <= simplexTable[0].length - 3; i++ ){
            title += "|Y"+i;
        }
        console.log(title);
        for(let row of simplexTable){
            console.log(row[0]+ (",Y"+(row[1].add(1)))+","+row.slice(2));
        }
    }

    this.solve = function () {
        this.convertToStandardForm();
        let IBFS = this.getInitialBasicFeasibleSolution();
        console.log(IBFS);
        let simplexTable = [];
        for (let i = 0; i < this.constraints.length; i++) {
            let row = [];
            // Adding initial cost of decision variable
            row.push(new MinifiedNumber(this.coEfficientsArray[this.noOfDecisionVariables + i]));
            // Adding the ith slack or surplus variable
            row.push(new MinifiedNumber(i+this.noOfDecisionVariables));
            // Adding the initial solution for the corresponding slack or surplus variable
            row.push(new MinifiedNumber(IBFS[this.noOfDecisionVariables + i]));
            // Adding the coefficients of the constraints
            row.push(...this.constraints[i].coEfficientsArray.map(c=>new MinifiedNumber(c)));
            simplexTable.push(row);
        }

        console.log(simplexTable);
        
        let zj = Array.from({length:this.coEfficientsArray.length},_=>new MinifiedNumber(0));
        let cj = this.coEfficientsArray.map(e=>new MinifiedNumber(e));
        let isFirstIteration = true;
        let columnsToSkip = 3;
        let maxIterations = 5;
        do {
            if(!isFirstIteration){
                // Finding pivotal element and moving to next iteration
                let e = new MinifiedNumber(Infinity);
                zj.forEach(z=>{
                    if(z.min(z,e) == z){
                        
                        e = z;
                    }
                });
                let pivotalColumn = zj.indexOf(e);
                let row,pivotalRow = 0;
                let pivot ,prevValue = new MinifiedNumber(Infinity);
                for(row = 0;row<simplexTable.length;row++){
                    if(simplexTable[row][pivotalColumn+3].isNegative()){
                        continue;
                    }
                    let value = simplexTable[row][2].divide(simplexTable[row][pivotalColumn+3]);
                    if(value.min(value,prevValue) === value){
                        pivot = simplexTable[row][pivotalColumn+3];
                        pivotalRow = row;
                        prevValue = value;
                    }
                }

                simplexTable[pivotalRow][0] = cj[pivotalColumn];
                simplexTable[pivotalRow][1].changeValue(pivotalColumn);
                let modifiedSimplexTable = new Array(simplexTable.length);
                for(let i = 0;i<simplexTable.length;i++){
                    let t = [];
                    for(let j = 0;j<simplexTable[i].length;j++){
                        t.push(simplexTable[i][j]);
                    }
                    modifiedSimplexTable[i] = t;
                }
                
                for(let column = 2;column < simplexTable[0].length; column++){
                    modifiedSimplexTable[pivotalRow][column] = simplexTable[pivotalRow][column].divide(pivot);
                }
                for(let row = 0;row < simplexTable.length;row++){
                    if(row == pivotalRow){
                        continue;
                    }
                    for(let column = 2;column < simplexTable[0].length; column++){
                        modifiedSimplexTable[row][column] = simplexTable[row][column].subtract(simplexTable[pivotalRow][column].multiply(simplexTable[row][pivotalColumn+columnsToSkip]).divide(pivot));
                    }
                }
                simplexTable = modifiedSimplexTable;
            }
            
            zj.forEach(z=>z.changeValue(0));
            console.log(zj);
            for (let row = 0; row < simplexTable.length; row++) {
                for (let i = 0; i < zj.length; i++) {
                    zj[i] = zj[i].add(simplexTable[row][0].multiply(simplexTable[row][columnsToSkip+i]));
                }
            }

            zj = zj.map((z,i)=>z.subtract(cj[i]));

            isFirstIteration = false;
            this.displaySimplexTable(simplexTable);
            
        } while (zj.some(z=>z.isNegative()) && maxIterations--);
        // console.log(simplexTable[2][6]);
        simplexTable[2][6].minify();
        // console.log(simplexTable[2][6].minify());
    }

    this.toString = function () {
        let s = "";
        s += this.type + " z = ";
        this.coEfficientsArray.forEach((coEfficient, i) => {
            if (i < noOfDecisionVariables) {
                if (i > 0 && coEfficient > -1)
                    s += "+"
                s += `${coEfficient}x${i + 1}`;
            } else {
                if (i > 0 && coEfficient > -1)
                    s += "+"
                s += `${coEfficient}s${i + 1}`;
            }
        });
        return s;
    }
}

function Simplex() {

}

// let c1 = new Constraint(4,[1,-2,3,1],"<=",-10);
let constraintArray = [];
function generate(n, l) {
    let a = [];
    for (let i = 0; i < n; i++) {
        a.push(Math.floor(Math.random() * l));
    }
    return a;
}
// for (let i = 0; i < 4; i++) {
//     let symbol = generate(1, 3)[0];
//     if (symbol == 0) {
//         symbol = "=";
//     } else if (symbol == 1) {
//         symbol = "<=";
//     } else {
//         symbol = ">=";
//     }
//     let constant = generate(1, 100)[0];
//     constraintArray.push(new Constraint(4, generate(4, 10), symbol, constant));
// }
// constraintArray.push(new Constraint(4,[ 9, 3, 0, 9 ],"<=",36),
// new Constraint(4,[ 9, 6, 5, 9 ],">=",36),
// new Constraint(4,[ 7, 5, 4, 5 ],"=",92),
// new Constraint(4,[ 1, 0, 0, 5 ],">=",54));
// console.log(constraintArray);
// constraintArray.forEach(constraint => console.log(constraint + ""));

// let nonNegativeConstraints = [new Constraint(4,[1,0,0,0],">=",0),
// new Constraint(4,[0,1,0,0],">=",0),
// new Constraint(4,[0,0,1,0],">=",0),
// new Constraint(4,[0,0,0,1],">=",0)]

constraintArray.push(new Constraint(2, [2, 1], "<=", 50),
    new Constraint(2, [2, 5], "<=", 100),
    new Constraint(2, [2, 3], "<=", 90));

let nonNegativeConstraints = [new Constraint(2, [1, 0], ">=", 0),
new Constraint(2, [0, 1], ">=", 0)]

let f1 = new ObjectiveFunction(2, "max", [4, 10], constraintArray, nonNegativeConstraints);
// console.log(f1+"");
// f1.printAllConstraints();
// f1.convertToStandardForm();
// console.log(f1+"");
// f1.printAllConstraints();
// console.log(f1.getInitialBasicFeasibleSolution());
f1.solve();
// f1.constraints.forEach(constraint => console.log(constraint + "" + constraint.variables));
// console.log(f1.variables);
// console.log(c1+"");

[
    new ObjectiveFunction(3,"max",[-1,3,-2],[
        new Constraint(3,[3,-1,2],"<=",7),
        new Constraint(3,[-2,4,0],"<=",12),
        new Constraint(3,[-4,3,8],"<=",10)
    ],
    [
        new Constraint(3,[1,0,0],">=",0),
        new Constraint(3,[0,1,0],">=",0),
        new Constraint(3,[0,0,1],">=",0)
    ])].forEach(objFn => objFn.solve());