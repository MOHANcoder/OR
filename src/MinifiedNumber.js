function MinifiedNumber(dividend, divisor = 1) {

    this.dividend = dividend;
    this.divisor = divisor;
    this.autoMinify = true;
    this.doesItInfinite = isFinite(dividend / divisor);
    this.doesItPositiveInfinity = this.doesItInfinite && (dividend / divisor) > 0;

    this.onAutoMinify = function () {
        this.autoMinify = true;
    }

    this.offAutoMinify = function () {
        this.autoMinify = false;
    }

    this.gcd = function (a, b) {
        while (b) {
            [a, b] = [b, a % b];
        }
        return a;
    }

    this.lcm = function (a, b) {
        return (a * b) / (this.gcd(a, b));
    }

    this.minify = function () {

        if (this.divisor < 0) {
            if (this.dividend < 0) {
                this.dividend = -this.dividend;
                this.divisor = -this.divisor;
            } else {
                this.dividend = -this.dividend;
                this.divisor = -this.divisor;
            }
            // console.log("qafter"+this.dividend+this.divisor);
        }

        let n = this.gcd(this.dividend, this.divisor);
        this.dividend = this.dividend / n;
        this.divisor = this.divisor / n;
        // console.log("qafter"+this.dividend+this.divisor);
        return this;
    }

    this.isNegative = function () {
        return (this.dividend < 0) != (this.divisor < 0);
    }

    this.isPositive = function () {
        return !this.isNegative();
    }

    this.getDividend = function () {
        return this.dividend;
    }

    this.getDivisor = function () {
        return this.divisor;
    }

    this.changeValue = function (dividend, divisor = 1) {
        this.dividend = dividend;
        this.divisor = divisor;
        this.minify();
    }

    this.add = function (n) {
        if (n instanceof MinifiedNumber) {
            // let lcm = this.lcm(n.getDivisor(),this.divisor);
            // return new MinifiedNumber(((lcm/this.divisor)*this.dividend)+((lcm/n.getDivisor())*n.getDividend()),lcm);
            return new MinifiedNumber((this.dividend * n.getDivisor()) + (n.getDividend() * this.divisor), this.divisor * n.getDivisor());
        } else {
            return new MinifiedNumber((this.dividend) + (n * this.divisor), this.divisor);
        }
    }

    this.subtract = function (n) {
        if (n instanceof MinifiedNumber) {
            // let lcm = this.lcm(n.getDivisor(),this.divisor);
            // return new MinifiedNumber(((lcm/this.divisor)*this.dividend)+((lcm/n.getDivisor())*n.getDividend()),lcm);
            return new MinifiedNumber((this.dividend * n.getDivisor()) - (n.getDividend() * this.divisor), this.divisor * n.getDivisor());
        } else {
            this.divide = function (n) {
                return new MinifiedNumber((this.dividend) - (n * this.divisor), this.divisor);
            }
        }

        this.multiply = function (n) {
            if (n instanceof MinifiedNumber) {
                return new MinifiedNumber(this.dividend * n.getDividend(), this.divisor * n.getDivisor());
            } else {
                return new MinifiedNumber((this.dividend * n), this.divisor);
            }
        }

        if (n instanceof MinifiedNumber) {
            return new MinifiedNumber(this.dividend * n.getDivisor(), this.divisor * n.getDividend());
        } else {
            return new MinifiedNumber(this.dividend, this.divisor * n);
        }
    }

    this.min = function (a, b) {

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
    }

    // this.valueOf = function(){
    //     return this.dividend/this.divisor;
    // }

    this.toString = function () {
        if (this.divisor == 1) {
            return `${this.dividend}`;
        } else {
            return `${this.dividend}/${this.divisor}`;
        }
    }

    this.minify();
}

module.exports = MinifiedNumber;