const copy2d = require("../copy2d");

class HTMLOutputGenerator {
    #htmlContent;
    constructor(problemType,options) {
        this.problemType = problemType;
        this.#htmlContent = "";
    }

    clearContent(){
        this.#htmlContent = "";
    }

    getContent(){
        return this.#htmlContent;
    }

    getHTMLTableFrom2dArray(table) {
        return `<table>
                <thead>
                    <tr>
                        <th></th>
                        ${(() => {
                            let headings = "";
                            for (let i = 0; i < table[0].length; i++) {
                                headings += `<th>${i}</th>`;
                            }
                            return headings;
                        })()
                    }
                    </tr>
                </thead>
                <tbody>
                        ${table.map((row, i) => {
                return (
                    `<tr>
                        <td>${i}</td>
                        ${row.map(col => `<td>${col}</td>`).join()}
                    </tr>`
                );
            })
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

    generate(costTable, message, options) {
        switch (this.problemType) {
            case "ASSIGNMENT":
                this.generateForAssignmentProblem(costTable, message, options);
                break;
        }
    }

    showMessage(message) {
        this.#htmlContent += `<p>${message}</p>`;
    }
}

module.exports = HTMLOutputGenerator;