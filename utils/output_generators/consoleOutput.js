const copy2d = require("../copy2d");

class ConsoleOutputGenerator {
    constructor(problemType) {
        this.problemType = problemType;
    }

    generateForAssignmentProblem(costTable, message, options) {
        if (options === undefined) {
            console.log(message);
            console.table(costTable);
        } else {
            let duplicate = copy2d(costTable);
            const { step, tickedRows, tickedColumns } = options;
            switch (step) {
                case "TICKING":
                    for (let i = 0; i < duplicate.length; i++) {
                        if (tickedRows.includes(i)) {
                            duplicate[i].push('/');
                        } else {
                            duplicate[i].push('.');
                        }
                    }

                    duplicate.push(Array.from({ length: duplicate[0].length }, (_, i) => {
                        if (tickedColumns.includes(i)) {
                            return '/';
                        } else {
                            return '.';
                        }
                    }));

                    console.log(message);
                    console.table(duplicate);
                    break;
            }
        }
    }

    generateForSimplexAlgorithm(simplexTable, message, options) {
        let titles = ['CB', 'YB', 'XB'];
        for (let i = 1; i <= simplexTable[0].length - 3; i++) {
            titles.push("Y" + i);
        }
        console.log(simplexTable);
        console.table(simplexTable);
        if (options === undefined) {
            let simplexTableCopy = copy2d([titles, ...simplexTable]);
            if (message === undefined) {
                console.table(simplexTableCopy);
            } else {
                console.log(message);
                console.table(simplexTableCopy);
            }
        } else {
            const { step, payload } = options;
            let simplexTableCopy;
            switch (step) {
                case "ZJCALC":
                    const {zj} = payload;
                    const zjcopy = new Array(zj.length+3);
                    zjcopy.push("");
                    zjcopy.push("");
                    zjcopy.push("");
                    zjcopy.push(...zj);
                    simplexTableCopy= copy2d([titles, ...simplexTable,zjcopy]);
                    for (let row of simplexTableCopy) {
                        row[1] = "Y" + (row[1].add(1));
                    }
                    console.log(simplexTableCopy+"");
                    console.table(simplexTable);
                    console.table(simplexTableCopy);
                    break;
            }
        }
    }

    generate(costTable, message, options) {
        switch (this.problemType) {
            case "ASSIGNMENT":
                this.generateForAssignmentProblem(costTable, message, options);
                break;
            case "SIMPLEX":
                this.generateForSimplexAlgorithm(costTable, message);
                break;
        }
    }

    showMessage(message) {
        console.log(message);
    }

}

module.exports = ConsoleOutputGenerator;