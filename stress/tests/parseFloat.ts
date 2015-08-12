import StressTest = require('./StressTest');

class ParseFloatTest extends StressTest {
    data: string;

    prepare(ready?: () => any): boolean {
        this.data = "1.23456789E10";
        return false;
    }

    runIteration() {
        var num = parseFloat(this.data);
    }
}
export = ParseFloatTest;