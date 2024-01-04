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
                    for(let i = 0;i < duplicate.length;i++){
                        if(tickedRows.includes(i)){
                            duplicate[i].push('/');
                        }else{
                            duplicate[i].push('.');
                        }
                    }

                    duplicate.push(Array.from( {length:duplicate[0].length}, (_,i) => {
                        if(tickedColumns.includes(i)){
                            return '/';
                        }else{
                            return '.';
                        }
                    }));

                    console.log(message);
                    console.table(duplicate);
                    break;
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

    showMessage(message){
        console.log(message);
    }

}

module.exports = ConsoleOutputGenerator;