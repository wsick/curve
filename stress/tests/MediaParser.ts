import StressTest = require('./StressTest');

class MediaParser extends StressTest {
    data: string;

    prepare (ready?: () => any): boolean {
        this.data = "1.23456789E10";
        return false;
    }

    runIteration () {
        var parser = new path2d.MediaParser(this.data);
        parser.ParseDouble();
    }
}
export = MediaParser;