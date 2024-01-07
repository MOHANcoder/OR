const copy2d = require("../utils/copy2d");

class Transportation {
    constructor(costTable, origins, destinations, outputGenerator) {
        this.costTable = costTable;
        this.origins = origins;
        this.destinations = destinations;
        this.outputGenerator = outputGenerator;
        this.isOutputGeneratorAdded = outputGenerator !== undefined;
        if (this.isOutputGeneratorAdded) {
            this.outputGenerator.generate(this.costTable, "Initial Table : ");
        }
        this.balance();
    }

    balance() {
        let sumOfOrigins = this.origins.reduce((previous, current) => previous + current);
        let sumOfDesinations = this.destinations.reduce((previous, current) => previous + current);
        if (sumOfOrigins < sumOfDesinations) {
            // Adding a zero filled row
            this.costTable.push(Array.from({ length: this.costTable[0].length }, _ => 0));
            this.origins.push(sumOfDesinations - sumOfOrigins);
        } else if (sumOfOrigins > sumOfDesinations) {
            // Adding a zero filled column
            this.costTable.forEach(row => row.push(0));
            this.destinations.push(sumOfOrigins - sumOfDesinations);
        }
    }

    allocate(row, column, availableQuantity) {
        let cost;
        if (this.origins[row] < this.destinations[column]) {
            cost = this.costTable[row][column] * this.origins[row];
            availableQuantity -= this.origins[row];
            this.destinations[column] -= this.origins[row];
            this.origins[row] = 0;
        } else if (this.origins[row] > this.destinations[column]) {
            cost = this.costTable[row][column] * this.destinations[column];
            availableQuantity -= this.destinations[column];
            this.origins[row] -= this.destinations[column];
            this.destinations[column] = 0;
        } else {
            cost = this.costTable[row][column] * this.destinations[column];
            availableQuantity -= this.origins[row];
            this.origins[row] = 0;
            this.destinations[column] = 0;
        }
        return [cost, availableQuantity, row, column];
    }

    northWestCorner(availableQuantity) {
        let row = 0, column = 0;
        // Finding the first unstriked row
        for (let i = 0; i < this.origins.length; i++) {
            if (this.origins[i] !== 0) {
                row = i;
                break;
            }
        }

        // Finding the first unstriked column
        for (let i = 0; i < this.destinations.length; i++) {
            if (this.destinations[i] !== 0) {
                column = i;
                break;
            }
        }

        return this.allocate(row, column, availableQuantity);
    }

    rowMinima(availableQuantity) {
        let row, column;
        let minimumCost = Infinity;
        // Finding the first unstriked row
        for (let i = 0; i < this.origins.length; i++) {
            if (this.origins[i] !== 0) {
                row = i;
                break;
            }
        }
        // Finding the minimum cost column
        for (let i = 0; i < this.destinations.length; i++) {
            if (this.destinations[i] === 0) {
                continue;
            }

            if (this.costTable[row][i] < minimumCost) {
                column = i;
                minimumCost = this.costTable[row][i];
            }
        }
        return this.allocate(row, column, availableQuantity);
    }

    columnMinima(availableQuantity) {
        let row, column;
        let minimumCost = Infinity;
        // Finding the first unstriked column
        for (let i = 0; i < this.destinations.length; i++) {
            if (this.destinations[i] !== 0) {
                column = i;
                break;
            }
        }
        // Finding the minimum cost in the selected column
        for (let i = 0; i < this.origins.length; i++) {
            if (this.origins[i] === 0) {
                continue;
            }

            if (this.costTable[i][column] < minimumCost) {
                row = i;
                minimumCost = this.costTable[i][column];
            }
        }

        return this.allocate(row, column, availableQuantity);
    }

    matrixMinima(availableQuantity) {
        let row, column;
        let minimumCost = Infinity;

        for (let i = 0; i < this.costTable.length; i++) {
            if (this.origins[i] === 0) {
                continue;
            }

            for (let j = 0; j < this.costTable[0].length; j++) {
                if (this.destinations[j] !== 0) {
                    if (this.costTable[i][j] < minimumCost) {
                        row = i;
                        column = j;
                        minimumCost = this.costTable[i][j];
                    }
                }
            }
        }

        return this.allocate(row, column, availableQuantity);
    }

    vogelApproximation(availableQuantity) {
        let row, column;
        let rowPenalities = [], columnPenalities = [];
        let maximumRowPenality = -Infinity, maximumColumnPenality = -Infinity, maximumPenalityRow, maximumPenalityColumn;

        // Finding the penalities for each unstriked rows
        for (let i = 0; i < this.costTable.length; i++) {
            if (this.origins[i] === 0) {
                continue;
            }
            let copy = [];
            for (let j = 0; j < this.costTable[i].length; j++) {
                if (this.destinations[j] === 0) {
                    continue;
                }
                copy.push(this.costTable[i][j]);
            }
            copy = copy.sort();
            if (copy.length > 1) {
                rowPenalities.push({ index: i, penality: copy[1] - copy[0] });
            } else {
                rowPenalities.push({ index: i, penality: 0 });
            }
        }

        // Finding the penalities for each unstriked columns
        for (let i = 0; i < this.costTable[0].length; i++) {
            if (this.destinations[i] === 0) {
                continue;
            }

            let copy = [];
            for (let j = 0; j < this.costTable.length; j++) {
                if (this.origins[j] === 0) {
                    continue;
                }
                copy.push(this.costTable[j][i]);
            }
            copy = copy.sort();
            if (copy.length > 1) {
                columnPenalities.push({ index: i, penality: copy[1] - copy[0] });
            } else {
                columnPenalities.push({ index: i, penality: 0 });
            }
        }
        // Finding the largest row penality
        rowPenalities.forEach(({ penality, index }) => {
            if (penality > maximumRowPenality) {
                maximumRowPenality = penality;
                maximumPenalityRow = index;
            }
        });
        // Finding the largest column penality
        columnPenalities.forEach(({ penality, index }) => {
            if (penality > maximumColumnPenality) {
                maximumColumnPenality = penality;
                maximumPenalityColumn = index;
            }
        });
        // Finding the cell that have minimum cost in the selected row or column
        if (maximumRowPenality > maximumColumnPenality) {
            row = maximumPenalityRow;
            let minimumPenality = Infinity;
            for (let i = 0; i < this.costTable[row].length; i++) {
                if (this.destinations[i] === 0) {
                    continue;
                }
                if (this.costTable[row][i] < minimumPenality) {
                    column = i;
                    minimumPenality = this.costTable[row][i];
                }
            }
        } else {
            column = maximumPenalityColumn;
            let minimumPenality = Infinity;
            for (let i = 0; i < this.costTable.length; i++) {
                if (this.origins[i] === 0) {
                    continue;
                }
                if (this.costTable[i][column] < minimumPenality) {
                    row = i;
                    minimumPenality = this.costTable[i][column];
                }
            }
        }
        // console.log(row, column);
        return this.allocate(row, column, availableQuantity);
    }

    findIBFSUsingNorthWestCorner() {
        this.findIBFS("NWC");
    }

    findIBFSUsingRowMinima() {
        this.findIBFS("RM");
    }

    findIBFSUsingColumnMinima() {
        this.findIBFS("CM");
    }

    findIBFSUsingMatrixMinima() {
        this.findIBFS("MM");
    }

    findIBFSUsingVogelApproximation() {
        this.findIBFS("VA");
    }

    findIBFS(IBFSFindingMethodName) {
        let totalCost = 0, cost;
        let availableQuantity = this.origins.reduce((previous, current) => previous + current);
        let copyOfOrigins = [...this.origins];
        let copyOfDestinations = [...this.destinations];
        let costTableCopy = copy2d(this.costTable);
        costTableCopy.forEach((row, i) => row.push(this.origins[i]));
        costTableCopy.push(this.destinations);
        let row, column;
        while (availableQuantity > 0) {
            switch (IBFSFindingMethodName) {
                case "NWC": [cost, availableQuantity, row, column] = this.northWestCorner(availableQuantity); break;
                case "RM": [cost, availableQuantity, row, column] = this.rowMinima(availableQuantity); break;
                case "CM": [cost, availableQuantity, row, column] = this.columnMinima(availableQuantity); break;
                case "MM": [cost, availableQuantity, row, column] = this.matrixMinima(availableQuantity); break;
                case "VA": [cost, availableQuantity, row, column] = this.vogelApproximation(availableQuantity); break;
            }
            totalCost += cost;
            if (this.isOutputGeneratorAdded) {
                this.outputGenerator.generate(costTableCopy, "After the allocation : ", {
                   origins:this.origins, row, column, cost
                });
                this.outputGenerator.showMessage(`Now,Total Cost for this Allocation = ${cost} Available Quantity = ${availableQuantity}`);
            }
        }
        if(this.isOutputGeneratorAdded){
            this.outputGenerator.showMessage(`Finished : Total cost = ${totalCost}`);
        }
        this.origins = [...copyOfOrigins];
        this.destinations = [...copyOfDestinations];
    }
}

module.exports = Transportation;