function init(table) {
    let numberOfRows;

    /**
     * Checking whether the cost table is unbalanced or not
     */

    if(table.length < table[0].length){
        // Row Balancing
        table.push(Array.from({length:table[0].length},_=>0));
    }

    if(table.length > table[0].length){
        // Column Balancing
        table.forEach(row=>row.push(0));
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

    console.log("After row subtraction : ",table);
    
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
    
    console.log("After column subtraction : ",table);

    return table;
}

function removeAllAssignments(table){
    for(let i = 0;i<table.length;i++){
        for(let j =0;j<table.length;j++){
            if(table[i][j] == "[0]")
            table[i][j] = 0;
        }
    }
    return table;
}

function calculateNumberOfAssignments(table){
    let numberOfAssignments = 0;
    for(let row = 0;row<table.length;row++){
        for(let col =0;col<table[0].length;col++){
            if(table[row][col] == '[0]'){
                numberOfAssignments++;
                break;
            }
        }
    }
    return numberOfAssignments;
}


function optimize(table,numberOfAssignments,unAssignedRows){
    
 
    function assignCell(table,row,col,direction){
        let numberOfZeros = 0;
        if(direction == 1){
            for(let i = 0;i<table.length;i++){
                if(i == col){
                    continue;
                }
                if(table[row][i] == 0){
                    numberOfZeros++;
                }else if(table[row][i] == '[0]'){
                    let isAssignmentChanged;
                    [isAssignmentChanged,table] = changeAssignment(table,row,i,0);
                    if(isAssignmentChanged){
                        table[row][col] = '[0]';
                        return [true,table];
                    }else{
                        return [false,table];
                    }
                }
            }
            table[row][col] = '[0]';
            return [true,table];
        }else{
            for(let i = 0;i<table.length;i++){
                if(i == row){
                    continue;
                }
                if(table[i][col] == 0){
                    numberOfZeros++;
                }else if(table[i][col] == '[0]'){
                    let isAssignmentChanged;
                    [isAssignmentChanged,table] = changeAssignment(table,i,col,1);
                    if(isAssignmentChanged){
                        table[row][col] = '[0]';
                        return [true,table];
                    }else{
                        return [false,table];
                    }
                }
            }
            table[row][col] = '[0]';
            return [true,table];
        }
        
    }
    
    
    function changeAssignment(table,row,col,direction){
        if(direction == 1){
            for(let i = 0;i<table.length;i++){
                if(i == col){
                    continue;
                }
                if(table[row][i] == 0){
                    let isAssigned;
                    [isAssigned,table]= assignCell(table,row,i,0);
                    if(isAssigned){
                        table[row][col] = 0;
                        return [true,table];
                    }
                }
            }
        }else{
            for(let i = 0;i<table.length;i++){
                if(i == row){
                    continue;
                }
                if(table[i][col] == 0){
                    let isAssigned;
                    [isAssigned,table] = assignCell(table,i,col,1);
                    if(isAssigned){
                        table[row][col] = 0;
                        return [true,table];
                    }
                }
            }
        }
        return [false,table];
    }


    while(numberOfAssignments!=table.length){
        unAssignedRows.forEach(function(row){
            for(let col =0;col<table[row].length;col++){
                if(table[row][col] == 0){
                    let isAssigned;
                    [isAssigned,table] = assignCell(table,row,col,0);
                    if(isAssigned){
                        return table;
                    }
                }
            }
            numberOfAssignments = calculateNumberOfAssignments(table);
        });
    }
    return table;
}


  

function solve(table) {
    let initialCostTable = table;
    table = init(table);

    let numberOfAssignments = 0;
    let numberOfRows = table.length;

    while (numberOfAssignments != numberOfRows) {
        numberOfAssignments = 0;

        let tickedRows = [], tickedColumns = [];

        //let rowIndices = Array.from({length:numberOfRows},(v,i)=>i);
        let rowIndices = new Array(numberOfRows).fill(true, 0, numberOfRows);
        // console.log(rowIndices);
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
                    if((table[i].filter(v=>v==0)).length > 1){
                        console.log("This row : ",table[i]);
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
                if(!dontConsider)
                    unAssignedRows.push(i);
            }
        }

        console.log("After the selection step-1 : ",table,rowThatHaveMoreThanOneZeros);

        rowThatHaveMoreThanOneZeros.forEach(row=>{
            let isAnyZeroChecked = false;
            for(let col = 0;col<table.length;col++){
                if(rowIndices[col] && table[row][col] == 0){
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

        
        console.log("After the selection step-2 : ",table);

        if (numberOfAssignments == numberOfRows) {
            break;
        }
        

        /**
         * Normally, each unassigned rows are ticked by the algorithm
         */

        let assignedColumns = [];
        tickedRows.push(...unAssignedRows);


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

        let unCoveredEntries = [];

        // Finding all uncovered entries
        for (let i of tickedRows) {
            for (let j = 0; j < numberOfRows; j++) {
                if (!tickedColumns.includes(j)) {
                    unCoveredEntries.push(table[i][j]);
                }
            }
        }

        // console.log(unCoveredEntries);

        let minimumUnCoveredEntry = Math.min(...unCoveredEntries);

        //Adding the minimum uncovered entry to the entries at the intersections.

        for (let i = 0; i < numberOfRows; i++) {
            if (!tickedRows.includes(i)) {
                for (let j of tickedColumns) {
                    table[i][j] += minimumUnCoveredEntry;
                }
            }
        }

        // Subtracting the uncovered entries by the minimum amoung them
        for (let i of tickedRows) {
            for (let j = 0; j < numberOfRows; j++) {
                if (!tickedColumns.includes(j)) {
                    table[i][j] -= minimumUnCoveredEntry;
                }
            }
        }

        // for(let i = 0;i<numberOfRows;i++){
        //     for(let assignedColumn of assignedColumns){

        //     }
        // }

        console.log(table);
        // console.log(tickedRows, tickedColumns);
        // console.log(unAssignedRows);

        // table = removeAllAssignments(table);
        if(minimumUnCoveredEntry == 0){
            
            // console.log("---------------");
            table = optimize(table,initialCostTable,unAssignedRows);
            // console.log(table);
            numberOfAssignments = calculateNumberOfAssignments(table);
        }
        if(numberOfAssignments!=table.length)
        table = removeAllAssignments(table);
    }
    console.log("Finished : ",table);
}

solve([[18, 26, 17, 11], [13, 28, 14, 26], [38, 19, 18, 15], [19, 26, 24, 10]]);

solve([[1,4,6,3],[9,7,10,9],[4,5,11,7],[8,7,8,5]]);
// see the screen shot for the correct answer


solve([[30,27,31,39],[28,18,28,37],[33,17,29,41],[27,18,30,43],[40,20,27,36]]);

solve([[32,38,40,28,40],[40,24,28,21,36],[41,27,33,30,37],[22,38,41,36,36],[29,33,40,35,39]]);

solve([[9,3,1,13,1],[1,17,13,20,5],[0,14,8,11,4],[19,3,0,5,5],[12,8,1,6,2]]);

solve([[Number.POSITIVE_INFINITY,5,2,0],[4,7,5,6],[5,8,4,3],[3,6,6,2]]);

solve([[9,11,15,10,11],[12,9,Number.POSITIVE_INFINITY,10,9],[Number.POSITIVE_INFINITY,11,14,11,7],[14,8,12,7,8]]);

solve([[9,26,15],[13,27,6],[35,20,15],[18,30,20]]);

solve([[8,7,6],[5,7,8],[6,8,7]]);

solve([[85,75,65,125,75],[90,78,66,132,78],[75,66,57,114,69],[80,72,60,120,72],[76,64,56,112,68]]);