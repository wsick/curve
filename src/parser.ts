/// <reference path="Path2DEx" />

(function (ex: typeof Path2DEx) {
    ex.parse = (d: string): Path2D => {
        var existing: Path2D;
        if (this instanceof Path2D) {
            existing = this;
        } else {
            existing = new ex();
        }
        doParse(existing, d);
        return existing;
    };

    function doParse(path: Path2D, d: string) {
        //TODO: Implement
    }
})(Path2DEx);