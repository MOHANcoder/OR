module.exports = (Array2D) => {
    const copyArray2D = new Array();
    Array2D.forEach( arr => {
        copyArray2D.push([...arr]);
    });
    return copyArray2D;
};