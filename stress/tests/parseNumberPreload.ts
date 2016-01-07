import StressTest = require('./StressTest');

function stringToTracker(str: string): curve.parse.buffer.IParseTracker {
    var buffer = new TextEncoder().encode(str);
    return {
        data: buffer,
        offset: 0
    };
}

class ParseNumberTest extends StressTest {
    data: string;
    tracker: curve.parse.buffer.IParseTracker;

    prepare(ready?: () => any): boolean {
        this.data = "1.23456789E10";
        this.tracker = stringToTracker(this.data);
        return false;
    }

    runIteration() {
        this.tracker.offset = 0;
        var num = curve.parse.buffer.parseNumber(this.tracker);
    }
}
export = ParseNumberTest;