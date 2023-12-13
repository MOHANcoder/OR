class Transportation {
    constructor(costTable, origins, destinations) {
        this.costTable = costTable;
        this.origins = origins;
        this.destinations = destinations;
    }

    balance() {
        let sumOfOrigins = this.origins.reduce((previous, current) => previous + current);
        let sumOfDesinations = this.destinations.reduce((previous, current) => previous + current);
        if(sumOfOrigins < sumOfDesinations){
            this.costTable.push(Array.from({length:this.costTable[0].length},_=>0));
        }else if(sumOfOrigins > sumOfDesinations){
            this.costTable.forEach( row => row.push(0));
        }
    }

    allocate (row,column,availableQuantity){
        let cost;
        if( this.origins[row] < this.destinations[column]){
            cost = this.costTable[row][column] * this.origins[row];
            availableQuantity -= this.origins[row];
            this.destinations[column] -= this.origins[row];
            this.origins[row] = 0;
            // strikeOutedRows.push(row);
        }else if(this.origins[row] > this.destinations[column]){
            cost = this.costTable[row][column] * this.destinations[column];
            availableQuantity -= this.destinations[column];
            this.origins[row] -= this.destinations[column];
            this.destinations[column] = 0;
            // strikeOutedColumns.push(column);
        }else{
            cost = this.costTable[row][column] * this.destinations[column];
            availableQuantity -= this.origins[row];
            this.origins[row] = 0;
            this.destinations[column] = 0;
            // strikeOutedRows.push(row);
            // strikeOutedColumns.push(column);
        }
        return [cost,availableQuantity];
    }

    northWestCorner (availableQuantity){
        let row = 0,column = 0;
        for(let i=0;i<this.origins.length;i++){
            if(this.origins[i] !== 0){
                row = i;
                break;
            }
        }

        for(let i=0;i<this.destinations.length;i++){
            if(this.destinations[i] !== 0){
                column = i;
                break;
            }
        }
        
        return this.allocate(row,column,availableQuantity);
    }

    rowMinima (availableQuantity){
        let row = 0,column;
        for(let i=0;i<this.origins.length;i++){
            if(this.origins[i] !== 0){
                row = i;
                break;
            }
        }

        for(let i=0;i<this.destinations.length;i++){
            if(this.destinations[i] !== 0){
                column = i;
                break;
            }
        }

        for(let i = column+1;i < this.destinations.length;i++){
            if(this.destinations[i] === 0){
                continue;
            }

            if(this.costTable[row][i] < this.costTable[row][column]){
                column = i;
            }
        }
        return this.allocate(row,column,availableQuantity);
    }

    solveByNorthWestCorner(){
        this.balance();
        let strikeOutedRows = [];
        let strikeOutedColumns = [];
    }

    findIBFS (){
        let rowStart = 0,rowEnd = this.costTable.length-1;
        let columnStart = 0,columnEnd = this.costTable[0].length-1;
        let totalCost = 0,cost;
        let strikeOutedRows = [];
        let strikeOutedColumns = [];
        let availableQuantity = this.origins.reduce((previous, current) => previous + current);
        while(availableQuantity > 0){
            // [cost,availableQuantity] = this.northWestCorner(availableQuantity);
            [cost,availableQuantity] = this.rowMinima(availableQuantity);
            // console.log(cost,rowStart,rowEnd,columnStart,columnEnd);
            console.log(cost,availableQuantity);
            totalCost += cost;
        }
        console.log(totalCost);
    }
}

const p1 = new Transportation([
    [6,4,1,5],
    [8,9,2,7],
    [4,3,6,2]
],[14,16,5],[6,10,15,4]);

p1.findIBFS();