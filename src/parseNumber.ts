namespace path2d {
    export function parseNumber(tracker: IParseTracker): number {
        var start = tracker.offset;
        var data = tracker.data;
        var len = data.length;
        //NaN
        if (isNaN(data, tracker.offset)) {
            tracker.offset += 3;
            return NaN;
        }

        //Check - or +
        var negate = false;
        if (data[tracker.offset] === 0x2D) {
            negate = true;
            tracker.offset++;
        } else if (data[tracker.offset] === 0x2B) {
            tracker.offset++;
        }

        //Infinity
        if (isInfinity(data, tracker.offset)) {
            tracker.offset += 8;
            return negate ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;
        }

        //(characteristic)[.(mantissa)][Ee[+-](significand)]
        parseInteger(tracker);
        var cur = data[tracker.offset];
        if (cur === 0x2E) { // '.'
            tracker.offset++;
            if (!parseMantissa(tracker))
                throw new Error("Invalid number");
        }

        if (!parseSignificand(tracker))
            throw new Error("Invalid number");

        return parseFloat(getSlice(data, start, tracker.offset - start));
    }

    function isNaN(data: Uint8Array, i: number): boolean {
        return data[i + 0] === 0x4E //N
            && data[i + 1] === 0x61 //a
            && data[i + 2] === 0x4E //N
            ;
    }

    function isInfinity(data: Uint8Array, i: number): boolean {
        return data[i + 0] === 0x49 //I
            && data[i + 1] === 0x6E //n
            && data[i + 2] === 0x66 //f
            && data[i + 3] === 0x69 //i
            && data[i + 4] === 0x6E //n
            && data[i + 5] === 0x69 //i
            && data[i + 6] === 0x74 //t
            && data[i + 7] === 0x79 //y
            ;
    }

    function parseInteger(tracker: IParseTracker): boolean {
        var start = tracker.offset;
        var data = tracker.data;
        var cur: number;
        while ((cur = data[tracker.offset]) != null && cur >= 0x30 && cur <= 0x39) {
            tracker.offset++;
        }
        return tracker.offset !== start;
    }

    function parseMantissa(tracker: IParseTracker): boolean {
        var start = tracker.offset;
        var data = tracker.data;
        var cur: number;
        while ((cur = data[tracker.offset]) != null && cur >= 0x30 && cur <= 0x39) {
            tracker.offset++;
        }
        return tracker.offset !== start;
    }

    function parseSignificand(tracker: IParseTracker): boolean {
        var data = tracker.data;
        if (data[tracker.offset] !== 0x45 && data[tracker.offset] !== 0x65)
            return true;
        tracker.offset++;

        var cur = data[tracker.offset];
        if (cur === 0x2D || cur === 0x2B) // '-' '+'
            tracker.offset++;
        return parseInteger(tracker);
    }

    function getSlice(data: Uint8Array, offset: number, length: number): string {
        var buf = new Uint8Array(length);
        for (var i = 0; i < length; i++) {
            buf[i] = data[offset + i];
        }
        return String.fromCharCode.apply(null, buf);
    }
}