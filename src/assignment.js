const copy2d = require("../utils/copy2d");

class Assignment {
    constructor(costTable, outputGenerator) {
        this.costTable = costTable;
        this.outputGenerator = outputGenerator;
        this.isOutputGeneratorAdded = outputGenerator !== undefined;
        if (this.isOutputGeneratorAdded) {
            this.outputGenerator.generate(this.costTable, "Initial Table : ");
        }
    }

    init(table) {
        let numberOfRows;

        /**
         * Checking whether the cost table is unbalanced or not
         */

        if (table.length < table[0].length) {
            // Row Balancing
            table.push(Array.from({ length: table[0].length }, _ => 0));
            if (this.isOutputGeneratorAdded) {
                this.outputGenerator.generate(table, "After row balancing : ");
            }
        }

        if (table.length > table[0].length) {
            // Column Balancing
            table.forEach(row => row.push(0));
            if (this.isOutputGeneratorAdded) {
                this.outputGenerator.generate(table, "After column balancing : ");
            }
        }

        numberOfRows = table.length;

        //Subtracting the minimum entry in each rows
        for (let i = 0; i < numberOfRows; i++) {
            let row = table[i];
            let minimumEntry = Math.min(...row);
            row.forEach((entry, index) => {
                row[index] = entry - minimumEntry;
            });
        }

        if (this.isOutputGeneratorAdded) {
            this.outputGenerator.generate(table, "After row subtraction : ");
        }

        //Subtracting the minimum entry in each columns
        for (let i = 0; i < numberOfRows; i++) {
            let minimumEntry = table[0][i];
            for (let j = 0; j < numberOfRows; j++) {
                if (table[j][i] < minimumEntry) {
                    minimumEntry = table[j][i];
                }
            }
            for (let j = 0; j < numberOfRows; j++) {
                table[j][i] -= minimumEntry;
            }
        }

        if (this.isOutputGeneratorAdded) {
            this.outputGenerator.generate(table, "After column subtraction : ");
        }

        return table;
    }

    removeAllAssignments(table) {
        for (let i = 0; i < table.length; i++) {
            for (let j = 0; j < table.length; j++) {
                if (table[i][j] == "[0]")
                    table[i][j] = 0;
            }
        }
        return table;
    }

    calculateNumberOfAssignments(table) {
        let numberOfAssignments = 0;
        for (let row = 0; row < table.length; row++) {
            for (let col = 0; col < table[0].length; col++) {
                if (table[row][col] == '[0]') {
                    numberOfAssignments++;
                    break;
                }
            }
        }
        return numberOfAssignments;
    }


    optimize(table, unAssignedRows) {
        let numberOfAssignments = this.calculateNumberOfAssignments(table);
        const assignCell = (table, row, col, direction) => {
            let numberOfZeros = 0;
            if (direction == 1) {
                for (let i = 0; i < table.length; i++) {
                    if (i == col) {
                        continue;
                    }
                    if (table[row][i] == 0) {
                        numberOfZeros++;
                    } else if (table[row][i] == '[0]') {
                        let isAssignmentChanged;
                        [isAssignmentChanged, table] = changeAssignment(table, row, i, 0);
                        if (isAssignmentChanged) {
                            table[row][col] = '[0]';
                            return [true, table];
                        } else {
                            return [false, table];
                        }
                    }
                }
                table[row][col] = '[0]';
                return [true, table];
            } else {
                for (let i = 0; i < table.length; i++) {
                    if (i == row) {
                        continue;
                    }
                    if (table[i][col] == 0) {
                        numberOfZeros++;
                    } else if (table[i][col] == '[0]') {
                        let isAssignmentChanged;
                        [isAssignmentChanged, table] = changeAssignment(table, i, col, 1);
                        if (isAssignmentChanged) {
                            table[row][col] = '[0]';
                            return [true, table];
                        } else {
                            return [false, table];
                        }
                    }
                }
                table[row][col] = '[0]';
                return [true, table];
            }

        }


        const changeAssignment = (table, row, col, direction) => {
            if (direction == 1) {
                for (let i = 0; i < table.length; i++) {
                    if (i == col) {
                        continue;
                    }
                    if (table[row][i] == 0) {
                        let isAssigned;
                        [isAssigned, table] = assignCell(table, row, i, 0);
                        if (isAssigned) {
                            table[row][col] = 0;
                            return [true, table];
                        }
                    }
                }
            } else {
                for (let i = 0; i < table.length; i++) {
                    if (i == row) {
                        continue;
                    }
                    if (table[i][col] == 0) {
                        let isAssigned;
                        [isAssigned, table] = assignCell(table, i, col, 1);
                        if (isAssigned) {
                            table[row][col] = 0;
                            return [true, table];
                        }
                    }
                }
            }
            return [false, table];
        }


        while (numberOfAssignments != table.length) {
            unAssignedRows.forEach((row) => {
                for (let col = 0; col < table[row].length; col++) {
                    if (table[row][col] == 0) {
                        let isAssigned;
                        [isAssigned, table] = assignCell(table, row, col, 0);
                        if (isAssigned) {
                            return table;
                        }
                    }
                }
                numberOfAssignments = this.calculateNumberOfAssignments(table);
            });
        }
        return table;
    }

    calculateTotalCost(costTable) {
        let cost = 0;
        this.costTable.forEach((row, i) => {
            row.forEach((col, j) => {
                if (costTable[i][j] === '[0]') {
                    cost += col;
                    return;
                }
            });
        });
        return cost;
    }
    
    calculateAssignmentMap(costTable){
        const assignmentMap = new Map();
        costTable.forEach((row,i) => {
            row.forEach((col,j) => {
                if(col === '[0]'){
                    assignmentMap.set(i,j);
                    return;
                }
            });
        });
        return assignmentMap;
    }

    solve() {
        let table = this.init(copy2d(this.costTable));

        let numberOfAssignments = 0;
        let numberOfRows = table.length;

        while (numberOfAssignments != numberOfRows) {
            numberOfAssignments = 0;

            let tickedRows = [], tickedColumns = [];

            let rowIndices = new Array(numberOfRows).fill(true, 0, numberOfRows);
            let unAssignedRows = [];

            /**
             * Making assignments at first appearing zeros in each rows
             * If there is no zero in a row then that row is pushed into the unAssignedRows array
             */

            let rowThatHaveMoreThanOneZeros = [];

            for (let i = 0; i < numberOfRows; i++) {
                let isAnyZeroChecked = false;
                let dontConsider = false;
                for (let j = 0; j < rowIndices.length; j++) {
                    if (rowIndices[j]) {
                        if ((table[i].filter(v => v == 0)).length > 1) {
                            rowThatHaveMoreThanOneZeros.push(i);
                            dontConsider = true;
                            break;
                        }

                        if (table[i][j] == 0) {
                            table[i][j] = "[0]";
                            numberOfAssignments++;
                            rowIndices[j] = false;
                            isAnyZeroChecked = true;
                            break;
                        }
                    }
                }
                if (!isAnyZeroChecked) {
                    if (!dontConsider)
                        unAssignedRows.push(i);
                }
            }

            // console.log("After the selection step-1 : ",table,rowThatHaveMoreThanOneZeros);
            if (this.isOutputGeneratorAdded) {
                this.outputGenerator.generate(table, "After the assignment on rows : ");
            }

            rowThatHaveMoreThanOneZeros.forEach(row => {
                let isAnyZeroChecked = false;
                for (let col = 0; col < table.length; col++) {
                    if (rowIndices[col] && table[row][col] == 0) {
                        rowIndices[col] = false;
                        table[row][col] = '[0]';
                        numberOfAssignments++;
                        isAnyZeroChecked = true;
                        break;
                    }
                }

                if (!isAnyZeroChecked) {
                    unAssignedRows.push(row);
                }
            });


            if (this.isOutputGeneratorAdded) {
                this.outputGenerator.generate(table, "After the column assignments : ");
            }

            if (numberOfAssignments == numberOfRows) {
                let cost = this.calculateTotalCost(table);
                if (this.isOutputGeneratorAdded) {
                    this.outputGenerator.generate(table, "Finished : ");
                    this.outputGenerator.showMessage(`Total cost = ${cost}units`);
                }
                return [table, cost,this.calculateAssignmentMap(table)];
            }


            /**
             * Normally, each unassigned rows are ticked by the algorithm
             */

            let assignedColumns = [];
            tickedRows.push(...unAssignedRows);

            // Finding all the ticked columns

            for (let unAssignedRow of unAssignedRows) {
                for (let i = 0; i < numberOfRows; i++) {
                    if (table[unAssignedRow][i] == 0) {
                        assignedColumns.push(i);
                        tickedColumns.push(i);
                        for (let j = 0; j < numberOfRows; j++) {
                            if (table[j][i] == "[0]") {
                                tickedRows.push(j);
                            }
                        }
                    }
                }
            }

            if (this.isOutputGeneratorAdded) {
                this.outputGenerator.generate(table, "After Ticking the rows and columns : ", {
                    step: "TICKING",
                    tickedRows,
                    tickedColumns
                });
            }

            let unCoveredEntries = [];

            // Finding all uncovered entries
            for (let i of tickedRows) {
                for (let j = 0; j < numberOfRows; j++) {
                    if (!tickedColumns.includes(j)) {
                        unCoveredEntries.push(table[i][j]);
                    }
                }
            }

            let minimumUnCoveredEntry = Math.min(...unCoveredEntries);

            if (this.isOutputGeneratorAdded) {
                this.outputGenerator.showMessage("Minimum Uncovered Entry : " + minimumUnCoveredEntry);
            }

            //Adding the minimum uncovered entry to the entries at the intersections.

            for (let i = 0; i < numberOfRows; i++) {
                if (!tickedRows.includes(i)) {
                    for (let j of tickedColumns) {
                        table[i][j] += minimumUnCoveredEntry;
                    }
                }
            }

            if (this.isOutputGeneratorAdded) {
                this.outputGenerator.generate(table, "After Adding the minimum uncovered entry to the entries at the intersections : ");
            }

            // Subtracting the uncovered entries by the minimum amoung them
            for (let i of tickedRows) {
                for (let j = 0; j < numberOfRows; j++) {
                    if (!tickedColumns.includes(j)) {
                        table[i][j] -= minimumUnCoveredEntry;
                    }
                }
            }

            if (this.isOutputGeneratorAdded) {
                this.outputGenerator.generate(table, "After Subtracting the uncovered entries by the minimum amoung them : ");
            }

            if (minimumUnCoveredEntry == 0) {
                table = this.optimize(table, unAssignedRows);
                numberOfAssignments = this.calculateNumberOfAssignments(table);
                if (this.isOutputGeneratorAdded) {
                    this.outputGenerator.generate(table, "After the optimization : ");
                    this.outputGenerator.showMessage(`Number of assignments = ${numberOfAssignments}`);
                }
            }
            if (numberOfAssignments != table.length) {
                table = this.removeAllAssignments(table);
                if (this.isOutputGeneratorAdded) {
                    this.outputGenerator.showMessage("Going for Next iteration : ");
                }
            }
        }
        let cost = this.calculateTotalCost(table);
        if (this.isOutputGeneratorAdded) {
            this.outputGenerator.generate(table, "Finished : ");
            this.outputGenerator.showMessage(`Total cost = ${cost}units`);
        }
        return [table, cost,this.calculateAssignmentMap(table)];
    }
}


module.exports = Assignment;