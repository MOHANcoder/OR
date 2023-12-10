const MinifiedNumber = require("./MinifiedNumber.js");

const {ObjectiveFunction,Constraint} = require("./simplex.js");

new ObjectiveFunction(4,"max",
    [new MinifiedNumber(15),new MinifiedNumber(6), new MinifiedNumber(9), new MinifiedNumber(2)],
    [
    new Constraint(4,
        [
            new MinifiedNumber(2),
            new MinifiedNumber(1),
            new MinifiedNumber(5),
            new MinifiedNumber(6,10)
        ],
            "<=",
            new MinifiedNumber(10)
    ),
    new Constraint(4,
        [
            new MinifiedNumber(3),
            new MinifiedNumber(1),
            new MinifiedNumber(3),
            new MinifiedNumber(1,4)
        ],
            "<=",
            new MinifiedNumber(12)
    ),
    new Constraint(4,
        [
            new MinifiedNumber(7),
            new MinifiedNumber(0),
            new MinifiedNumber(0),
            new MinifiedNumber(1)
        ],
            "<=",
            new MinifiedNumber(35)
    )
],
[
    new Constraint(4,
        [
            new MinifiedNumber(1),
            new MinifiedNumber(0),
            new MinifiedNumber(0),
            new MinifiedNumber(0)
        ],
            ">=",
            new MinifiedNumber(0)
    ),
    new Constraint(4,
        [
            new MinifiedNumber(0),
            new MinifiedNumber(1),
            new MinifiedNumber(0),
            new MinifiedNumber(0)
        ],
            ">=",
            new MinifiedNumber(0)
    ),
    new Constraint(4,
        [
            new MinifiedNumber(0),
            new MinifiedNumber(0),
            new MinifiedNumber(1),
            new MinifiedNumber(0)
        ],
            ">=",
            new MinifiedNumber(0)
    ),
    new Constraint(4,
        [
            new MinifiedNumber(0),
            new MinifiedNumber(0),
            new MinifiedNumber(0),
            new MinifiedNumber(1)
        ],
            ">=",
            new MinifiedNumber(0)
    )
]).solve();

new ObjectiveFunction(3,"min",
    [new MinifiedNumber(1),new MinifiedNumber(-3), new MinifiedNumber(2)],
    [
    new Constraint(3,
        [
            new MinifiedNumber(3),
            new MinifiedNumber(-1),
            new MinifiedNumber(2)
        ],
            "<=",
            new MinifiedNumber(7)
    ),
    new Constraint(3,
        [
            new MinifiedNumber(-2),
            new MinifiedNumber(4),
            new MinifiedNumber(0)
        ],
            "<=",
            new MinifiedNumber(12)
    ),
    new Constraint(3,
        [
            new MinifiedNumber(-4),
            new MinifiedNumber(3),
            new MinifiedNumber(8)
        ],
            "<=",
            new MinifiedNumber(10)
    )
],
[
    new Constraint(3,
        [
            new MinifiedNumber(1),
            new MinifiedNumber(0),
            new MinifiedNumber(0)
        ],
            ">=",
            new MinifiedNumber(0)
    ),
    new Constraint(3,
        [
            new MinifiedNumber(0),
            new MinifiedNumber(1),
            new MinifiedNumber(0)
        ],
            ">=",
            new MinifiedNumber(0)
    ),
    new Constraint(3,
        [
            new MinifiedNumber(0),
            new MinifiedNumber(0),
            new MinifiedNumber(1)
        ],
            ">=",
            new MinifiedNumber(0)
    )
]).solve();