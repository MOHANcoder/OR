class MinifiedNumber {
    constructor(dividend, divisor = 1) {

        this.dividend = dividend;
        this.divisor = divisor;
        this.autoMinify = true;
        this.doesItInfinite = !isFinite(dividend / divisor);
        this.doesItPositiveInfinity = this.doesItInfinite && (dividend / divisor) > 0;
        this.minify();
    }

    gcd(a, b) {
        while (b) {
            if (a == 0) {
                return b;
            }
            if (b == 0) {
                return a;
            }
            if (a == b) {
                return a;
            }
            [a, b] = [b, a % b];
        }
        return a;
    }

    lcm(a, b) {
        return (a * b) / (this.gcd(a, b));
    };

    minify() {

        let n = this.gcd(this.dividend, this.divisor);
        this.dividend = this.dividend / n;
        this.divisor = this.divisor / n;

        if (this.divisor < 0) {
            if (this.dividend < 0) {
                this.dividend = -this.dividend;
                this.divisor = -this.divisor;
            } else {
                this.dividend = -this.dividend;
                this.divisor = -this.divisor;
            }
        }
        return this;
    };

    isNegative() {
        return (this.dividend < 0) != (this.divisor < 0);
    };

    isPositive() {
        return !this.isNegative();
    };

    getDividend() {
        return this.dividend;
    };

    getDivisor() {
        return this.divisor;
    };

    changeValue(dividend, divisor = 1) {
        this.dividend = dividend;
        this.divisor = divisor;
        this.minify();
    };

    getValue() {
        return this.dividend / this.divisor;
    };

    add(n) {
        if (n instanceof MinifiedNumber) {
            return new MinifiedNumber((this.dividend * n.getDivisor()) + (n.getDividend() * this.divisor), this.divisor * n.getDivisor());
        } else {
            return new MinifiedNumber((this.dividend) + (n * this.divisor), this.divisor);
        }
    };

    multiply(n) {
        if (n instanceof MinifiedNumber) {
            return new MinifiedNumber(this.dividend * n.getDividend(), this.divisor * n.getDivisor());
        } else {
            return new MinifiedNumber((this.dividend * n), this.divisor);
        }
    };

    divide(n) {
        if (n instanceof MinifiedNumber) {
            return new MinifiedNumber(this.dividend * n.getDivisor(), this.divisor * n.getDividend());
        } else {
            return new MinifiedNumber(this.dividend, this.divisor * n);
        }
    };

    subtract(n) {
        if (n instanceof MinifiedNumber) {
            return new MinifiedNumber((this.dividend * n.getDivisor()) - (n.getDividend() * this.divisor), this.divisor * n.getDivisor());
        } else {
            return new MinifiedNumber((this.dividend) - (n * this.divisor), this.divisor);
        }
    };

    min(a, b) {

        if (!(a instanceof MinifiedNumber)) {
            a = new MinifiedNumber(a);
        }

        if (!(b instanceof MinifiedNumber)) {
            b = new MinifiedNumber(b);
        }

        if (a.doesItInfinite || b.doesItInfinite) {
            if (a.doesItInfinite) {
                return a.doesItPositiveInfinity ? b : a;
            }

            if (b.doesItInfinite) {
                return b.doesItPositiveInfinity ? a : b;
            }
        }

        let lcm = this.lcm(a.getDivisor(), b.getDivisor());
        if (((lcm / a.getDivisor()) * a.getDividend()) < ((lcm / b.getDivisor()) * b.getDividend())) {
            return a;
        } else {
            return b;
        }
    };

    toString() {
        if (this.divisor == 1) {
            return `${this.dividend}`;
        } else {
            return `${this.dividend}/${this.divisor}`;
        }
    };
}

module.exports = MinifiedNumber;