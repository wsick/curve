namespace path2d {
    export function parseNumber(tracker: IParseTracker): number {
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
        var characteristic = parseInteger(tracker);
        var cur = data[tracker.offset];
        var mantissa = 0;
        if (cur === 0x2E) { // '.'
            tracker.offset++;
            mantissa = parseMantissa(tracker);
        } else if (cur !== 0x45 && cur !== 0x65) { // 'E' 'e'
            return negate ? -characteristic : characteristic;
        }
        var significand = parseSignificand(tracker);

        var num = negate ? -characteristic - mantissa : characteristic + mantissa;
        num = num * Math.pow(10, significand);
        return num;
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

    function parseInteger(tracker: IParseTracker): number {
        var num = 0;
        var data = tracker.data;
        var cur: number;
        while ((cur = data[tracker.offset]) != null && cur >= 0x30 && cur <= 0x39) {
            num = (num * 10) + (cur - 0x30);
            tracker.offset++;
        }
        return num;
    }

    function parseMantissa(tracker: IParseTracker): number {
        var num = 0;
        var divisor = 10;
        var data = tracker.data;
        var cur: number;
        while ((cur = data[tracker.offset]) != null && cur >= 0x30 && cur <= 0x39) {
            num += ((cur - 0x30) / divisor);
            divisor *= 10;
            tracker.offset++;
        }
        return num;
    }

    function parseSignificand(tracker: IParseTracker): number {
        var data = tracker.data;
        if (data[tracker.offset] !== 0x45 && data[tracker.offset] !== 0x65)
            return 0;
        tracker.offset++;

        if (data[tracker.offset] === 0x2D) { // '-'
            tracker.offset++;
            return -parseInteger(tracker);
        } else {
            return parseInteger(tracker);
        }
    }
}