const copy2d = require("../copy2d");

class HTMLOutputGenerator {
    #htmlContent;
    constructor(problemType) {
        this.problemType = problemType;
        this.#htmlContent = "";
    }

    clearContent() {
        this.#htmlContent = "";
    }

    getContent() {
        return this.#htmlContent;
    }

    getHTMLTableFrom2dArray(table) {
        return `<table>
                <tbody>
                        ${table.map((row) => {
                return (
                    `<tr>
                        ${row.map(col => `<td>${col}</td>`).join("")}
                    </tr>`
                );
            }).join("")
            }
                </tbody>
            </table>`;
    }

    generateForAssignmentProblem(costTable, message, options) {
        if (options === undefined) {
            this.showMessage(message);
            this.#htmlContent += this.getHTMLTableFrom2dArray(costTable);
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

                    this.showMessage(message);
                    this.#htmlContent += this.getHTMLTableFrom2dArray(duplicate);
            }
        }
    }

    generateForSimplexAlgorithm(simplexTable, message, options) {
        if (options === undefined) {
            this.showMessage(message);
            this.#htmlContent += this.getHTMLTableFrom2dArray(simplexTable);
        } else {
            const { zj, cj, zjminuscj } = options;
            let headings = ['CB', 'YB', 'XB'];
            for (let i = 1; i <= simplexTable[0].length - 3; i++) {
                headings.push("Y" + i);
            }
            let simplexTableCopy = [];
            simplexTableCopy.push(headings);
            simplexTable.forEach(row => {
                let rowObject = [];
                row.forEach((col, i) => {
                    if (i == 1) {
                        rowObject.push("Y" + col.add(1));
                    } else {
                        rowObject.push(col + "");
                    }
                });
                simplexTableCopy.push(rowObject);
            });
            simplexTableCopy.push(['','','zj',...zj.map(z=>z+"")]);
            simplexTableCopy.push(['','','cj',...cj.map(z=>z+"")]);
            simplexTableCopy.push(['','','zj - cj',...zjminuscj.map(z=>z+"")]);
            if (message === undefined) {
                this.#htmlContent += this.getHTMLTableFrom2dArray(simplexTableCopy);
            } else {
                this.showMessage(message);
                this.#htmlContent += this.getHTMLTableFrom2dArray(simplexTableCopy);
            }
        }
    }

    generateForTransportationProblem(costTable,message,options){
        if (options === undefined) {
            if (message !== undefined) {
                this.showMessage(message);
            }
            this.#htmlContent += this.getHTMLTableFrom2dArray(costTable);
        } else {
            const { origins, row, column, cost } = options;
            costTable[row][column] += `- [${cost}]`;
            costTable.forEach((row, i) => {
                if (i < costTable.length-1) { row[row.length - 1] = origins[i] }
            });
            this.#htmlContent += this.getHTMLTableFrom2dArray(costTable);
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
                this.generateForTransportationProblem(costTable,message,options);
                break;
        }
    }

    showMessage(message) {
        this.#htmlContent += `<p>${message}</p>`;
    }
}

module.exports = HTMLOutputGenerator;