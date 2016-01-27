import StressTest = require('./StressTest');

function stringToTracker (str: string): curve.parse.buffer.IParseTracker {
    var buffer = new TextEncoder().encode(str);
    return {
        data: buffer,
        offset: 0
    };
}

class ParseNumberTest extends StressTest {
    data: string;

    prepare (ready?: () => any): boolean {
        this.data = "1.23456789E10";
        return false;
    }

    runIteration () {
        var tracker = stringToTracker(this.data);
        var num = curve.parse.buffer.parseNumber(tracker);
    }
}
export = ParseNumberTest;