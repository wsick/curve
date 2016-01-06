// Path Markup Syntax: http://msdn.microsoft.com/en-us/library/cc189041(v=vs.95).aspx

//FigureDescription Syntax
// MoveCommand DrawCommands [CloseCommand]

//Double Syntax
// digits
// digits.digits
// 'Infinity'
// '-Infinity'
// 'NaN'

//Point Syntax
// x,y
// x y

//Loop until exhausted
//  Parse FigureDescription
//      Find "M" or "m"? - Parse MoveCommand (start point)
//          <point>
//
//      Find "L" or "l"? - Parse LineCommand (end point)
//          <point>
//      Find "H" or "h"? - Parse HorizontalLineCommand (x)
//          <double>
//      Find "V" or "v"? - Parse VerticalLineCommand (y)
//          <double>
//      Find "C" or "c"? - Parse CubicBezierCurveCommand (control point 1, control point 2, end point)
//          <point> <point> <point>
//      Find "Q" or "q"? - Parse QuadraticBezierCurveCommand (control point, end point)
//          <point> <point>
//      Find "S" or "s"? - Parse SmoothCubicBezierCurveCommand (control point 2, end point)
//          <point> <point>
//      Find "T" or "t"? - Parse SmoothQuadraticBezierCurveCommand (control point, end point)
//          <point> <point>
//      Find "A" or "a"? - Parse EllipticalArcCommand (size, rotationAngle, isLargeArcFlag, sweepDirectionFlag, endPoint)
//          <point> <double> <1,0> <1,0> <point>
//
//      Find "Z" or "z"? - CloseCommand

namespace curve.parse.matching {
    export class Parser implements IParser {
        parse(path: IPath, data: string|Uint8Array): IPath {
            if (typeof data === "string")
                parse(path, data, data.length);
            console.warn("Input parse data was not a string.", data);
            return path;
        }
    }

    interface IPoint {
        x: number;
        y: number;
    }

    function parse(path: IPath, str: string, len: number) {
        var index = 0;
        var fillRule = FillRule.EvenOdd;
        go();
        path.fillRule = fillRule || FillRule.EvenOdd;

        function go() {
            var cp = {x: 0, y: 0};
            var cp1: IPoint, cp2: IPoint, cp3: IPoint;
            var start = {x: 0, y: 0};
            var cbz = false; // last figure is a cubic bezier curve
            var qbz = false; // last figure is a quadratic bezier curve
            var cbzp = {x: 0, y: 0}; // points needed to create "smooth" beziers
            var qbzp = {x: 0, y: 0}; // points needed to create "smooth" beziers

            while (index < len) {
                var c;
                while (index < len && (c = str.charAt(index)) === ' ') {
                    index++;
                }
                index++;
                var relative = false;
                switch (c) {
                    case 'f':
                    case 'F':
                        c = str.charAt(index);
                        if (c === '0')
                            fillRule = FillRule.EvenOdd;
                        else if (c === '1')
                            fillRule = FillRule.NonZero;
                        else
                            return null;
                        index++;
                        c = str.charAt(index);
                        break;
                    case 'm':
                        relative = true;
                    case 'M':
                        cp1 = parsePoint();
                        if (cp1 == null)
                            break;
                        if (relative) {
                            cp1.x += cp.x;
                            cp1.y += cp.y;
                        }
                        path.moveTo(cp1.x, cp1.y);
                        start.x = cp.x = cp1.x;
                        start.y = cp.y = cp1.y;
                        advance();
                        while (morePointsAvailable()) {
                            if ((cp1 = parsePoint()) == null)
                                break;
                            if (relative) {
                                cp1.x += cp.x;
                                cp1.y += cp.y;
                            }
                            path.lineTo(cp1.x, cp1.y);
                        }
                        cp.x = cp1.x;
                        cp.y = cp1.y;
                        cbz = qbz = false;
                        break;
                    case 'l':
                        relative = true;
                    case 'L':
                        while (morePointsAvailable()) {
                            if ((cp1 = parsePoint()) == null)
                                break;

                            if (relative) {
                                cp1.x += cp.x;
                                cp1.y += cp.y;
                            }

                            path.lineTo(cp1.x, cp1.y);

                            cp.x = cp1.x;
                            cp.y = cp1.y;
                            advance();
                        }
                        cbz = qbz = false;
                        break;
                    case 'h':
                        relative = true;
                    case 'H':
                        var x = parseDouble();
                        if (x == null)
                            break;

                        if (relative)
                            x += cp.x;
                        cp = {x: x, y: cp.y};

                        path.lineTo(cp.x, cp.y);
                        cbz = qbz = false;
                        break;
                    case 'v':
                        relative = true;
                    case 'V':
                        var y = parseDouble();
                        if (y == null)
                            break;

                        if (relative)
                            y += cp.y;
                        cp = {x: cp.x, y: y};

                        path.lineTo(cp.x, cp.y);
                        cbz = qbz = false;
                        break;
                    case 'c':
                        relative = true;
                    case 'C':
                        while (morePointsAvailable()) {
                            if ((cp1 = parsePoint()) == null)
                                break;
                            if (relative) {
                                cp1.x += cp.x;
                                cp1.y += cp.y;
                            }
                            advance();
                            if ((cp2 = parsePoint()) == null)
                                break;
                            if (relative) {
                                cp2.x += cp.x;
                                cp2.y += cp.y;
                            }
                            advance();
                            if ((cp3 = parsePoint()) == null)
                                break;
                            if (relative) {
                                cp3.x += cp.x;
                                cp3.y += cp.y;
                            }
                            advance();

                            path.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, cp3.x, cp3.y);

                            cp1.x = cp3.x;
                            cp1.y = cp3.y;
                        }
                        cp.x = cp3.x;
                        cp.y = cp3.y;
                        cbz = true;
                        cbzp.x = cp2.x;
                        cbzp.y = cp2.y;
                        qbz = false;
                        break;
                    case 's':
                        relative = true;
                    case 'S':
                        while (morePointsAvailable()) {
                            if ((cp2 = parsePoint()) == null)
                                break;
                            if (relative) {
                                cp2.x += cp.x;
                                cp2.y += cp.y;
                            }
                            advance();
                            if ((cp3 = parsePoint()) == null)
                                break;
                            if (relative) {
                                cp3.x += cp.x;
                                cp3.y += cp.y;
                            }

                            if (cbz) {
                                cp1.x = 2 * cp.x - cbzp.x;
                                cp1.y = 2 * cp.y - cbzp.y;
                            } else
                                cp1 = cp;

                            path.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, cp3.x, cp3.y);

                            cbz = true;
                            cbzp.x = cp2.x;
                            cbzp.y = cp2.y;

                            cp.x = cp3.x;
                            cp.y = cp3.y;

                            advance();
                        }
                        qbz = false;
                        break;
                    case 'q':
                        relative = true;
                    case 'Q':
                        while (morePointsAvailable()) {
                            if ((cp1 = parsePoint()) == null)
                                break;
                            if (relative) {
                                cp1.x += cp.x;
                                cp1.y += cp.y;
                            }
                            advance();
                            if ((cp2 = parsePoint()) == null)
                                break;
                            if (relative) {
                                cp2.x += cp.x;
                                cp2.y += cp.y;
                            }
                            advance();

                            path.quadraticCurveTo(cp1.x, cp1.y, cp2.x, cp2.y);

                            cp.x = cp2.x;
                            cp.y = cp2.y;
                        }
                        qbz = true;
                        qbzp.x = cp1.x;
                        qbzp.y = cp1.y;
                        cbz = false;
                        break;
                    case 't':
                        relative = true;
                    case 'T':
                        while (morePointsAvailable()) {
                            if ((cp2 = parsePoint()) == null)
                                break;
                            if (relative) {
                                cp2.x += cp.x;
                                cp2.y += cp.y;
                            }

                            if (qbz) {
                                cp1.x = 2 * cp.x - qbzp.x;
                                cp1.y = 2 * cp.y - qbzp.y;
                            } else
                                cp1 = cp;

                            path.quadraticCurveTo(cp1.x, cp1.y, cp2.x, cp2.y);

                            qbz = true;
                            qbzp.x = cp1.x;
                            qbzp.y = cp1.y;

                            cp.x = cp2.x;
                            cp.y = cp2.y;

                            advance();
                        }
                        cbz = false;
                        break;
                    case 'a':
                        relative = true;
                    case 'A':
                        while (morePointsAvailable()) {
                            if ((cp1 = parsePoint()) == null)
                                break;

                            var angle = parseDouble();
                            var is_large = parseDouble() !== 0;
                            var sweep = SweepDirection.Counterclockwise;
                            if (parseDouble() !== 0) sweep = SweepDirection.Clockwise;

                            if ((cp2 = parsePoint()) == null)
                                break;
                            if (relative) {
                                cp2.x += cp.x;
                                cp2.y += cp.y;
                            }

                            console.warn("ellipticalArc not implemented");
                            //path.ellipticalArc(cp1.x, cp1.y, angle, is_large, sweep, cp2.x, cp2.y);

                            cp.x = cp2.x;
                            cp.y = cp2.y;

                            advance();
                        }
                        cbz = qbz = false;
                        break;
                    case 'z':
                    case 'Z':
                        path.closePath();

                        cp.x = start.x;
                        cp.y = start.y;
                        cbz = qbz = false;
                        break;
                    default:
                        break;
                }
            }
        }

        function parsePoint(): IPoint {
            var x = parseDouble();
            if (x == null)
                return null;

            var c;
            while (index < len && ((c = str.charAt(index)) === ' ' || c === ',')) {
                index++;
            }
            if (index >= len)
                return null;

            var y = parseDouble();
            if (y == null)
                return null;

            return {x: x, y: y};
        }

        function parseDouble(): number {
            advance();
            var isNegative = false;
            if (match('-')) {
                isNegative = true;
                index++;
            } else if (match('+')) {
                index++;
            }
            if (match('Infinity')) {
                index += 8;
                return isNegative ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;
            }
            if (match('NaN'))
                return NaN;

            var temp = '';
            while (index < len) {
                var code = str.charCodeAt(index);
                var c = str[index];
                //0-9, ., E, e, E-, e-
                if (code >= 48 && code <= 57)
                    temp += c;
                else if (code === 46)
                    temp += c;
                else if (c === 'E' || c === 'e') {
                    temp += c;
                    if (str[index + 1] === '-') {
                        temp += '-';
                        index++;
                    }
                }
                else
                    break;
                index++;
            }
            if (temp.length === 0)
                return null;
            var f = parseFloat(temp);
            return isNegative ? -f : f;
        }

        function advance() {
            var code: number;
            var c: string;
            while (index < len) {
                code = str.charCodeAt(index);
                //alphanum
                if ((code >= 65 && code <= 90) || (code >= 97 && code <= 122) || (code >= 48 && code <= 57))
                    break;
                c = String.fromCharCode(code);
                if (c === '.')
                    break;
                if (c === '-')
                    break;
                if (c === '+')
                    break;
                index++;
            }
        }

        function match(matchStr: string): boolean {
            var c1: string;
            var c2: string;
            for (var i = 0; i < matchStr.length && (index + i) < len; i++) {
                c1 = matchStr.charAt(i);
                c2 = str.charAt(index + i);
                if (c1 !== c2)
                    return false;
            }
            return true;
        }

        function morePointsAvailable(): boolean {
            var c;
            while (index < len && ((c = str.charAt(index)) === ',' || c === ' ')) {
                index++;
            }
            if (index >= len)
                return false;
            if (c === '.' || c === '-' || c === '+')
                return true;
            var code = str.charCodeAt(index);
            return code >= 48 && code <= 57;
        }
    }
}