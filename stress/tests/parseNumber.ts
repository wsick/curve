import StressTest = require('./StressTest');

function stringToTracker(str: string): path2d.IParseTracker {
    var buffer = new TextEncoder().encode(str);
    return {
        data: buffer,
        offset: 0
    };
}

class ParseNumberTest extends StressTest {
    data: string;

    prepare(ready?: () => any): boolean {
        this.data = "1.23456789E10";
        return false;
    }

    runIteration() {
        var num = path2d.parseNumber(stringToTracker(this.data));
    }
}
export = ParseNumberTest;