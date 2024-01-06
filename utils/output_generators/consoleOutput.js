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
        let tableColumns = ['CB', 'YB', 'XB'];
        for (let i = 1; i <= simplexTable[0].length - 3; i++) {
            tableColumns.push("Y" + i);
        }

        let simplexTableCopy = [];
        simplexTable.forEach(row => {
            let rowObject = {};
            row.forEach((col, i) => {
                if (i == 1) {
                    rowObject[tableColumns[i]] = "Y" + col.add(1);
                } else {
                    rowObject[tableColumns[i]] = col + "";
                }
            });
            simplexTableCopy.push(rowObject);
        });

        if (options === undefined) {
            if (message === undefined) {
                console.table(simplexTableCopy);
            } else {
                console.log(message);
                console.table(simplexTableCopy);
            }
        } else {
            const { zj, cj, zjminuscj } = options;
            let zjRowObject = {}, cjRowObject = {}, zjminuscjRowObject = {};
            let nextIndex = 0;
            for (let i = 0; i < simplexTable[0].length; i++) {
                if (i == 2) {
                    zjRowObject[tableColumns[i]] = "zj";
                    cjRowObject[tableColumns[i]] = "cj";
                    zjminuscjRowObject[tableColumns[i]] = "zj - cj";
                } else if (i > 2) {
                    zjRowObject[tableColumns[i]] = zj[nextIndex] + "";
                    cjRowObject[tableColumns[i]] = cj[nextIndex] + "";
                    zjminuscjRowObject[tableColumns[i]] = zjminuscj[nextIndex] + "";
                    nextIndex++;
                }
            }
            simplexTableCopy.push(zjRowObject, cjRowObject, zjminuscjRowObject);
        }
        if (message === undefined) {
            console.table(simplexTableCopy);
        } else {
            console.log(message);
            console.table(simplexTableCopy);
        }
    }

    generateForTransportationProblem(costTable, message, options) {
        if (options === undefined) {
            if (message !== undefined) {
                this.showMessage(message);
            }
            console.table(costTable);
        } else {
            const { origins, row, column, cost } = options;
            costTable[row][column] += `- [${cost}]`;
            costTable.forEach((row, i) => {
                if (i < costTable.length-1) { row[row.length - 1] = origins[i] }
            });
            console.table(costTable);
        }
    }

    generate(costTable, message, options) {
        switch (this.problemType) {
            case "ASSIGNMENT":
                this.generateForAssignmentProblem(costTable, message, options);
                break;
            case "SIMPLEX":
                this.generateForSimplexAlgorithm(costTable, message, options);
                break;
            case "TRANSPORTATION":
                this.generateForTransportationProblem(costTable, message, options);
                break;
        }
    }

    showMessage(message) {
        console.log(message);
    }

}

module.exports = ConsoleOutputGenerator;