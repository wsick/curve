namespace curve.parse.dom {
    var domsvg = <SVGSVGElement>document.createElementNS("http://www.w3.org/2000/svg", "svg");
    var dompath = <SVGPathElement>document.createElementNS("http://www.w3.org/2000/svg", "path");

    export class Parser implements IParser {
        parse(runner: ISegmentRunner, data: string|Uint8Array) {
            if (typeof data !== "string") {
                console.warn("Input parse data was not a string.", data);
                return;
            }
            dompath.setAttribute("d", <string>data);

            var segments = dompath.pathSegList,
                cur: number[] = [0, 0];
            for (var i = 0, len = segments.numberOfItems; i < len; i++) {
                parseSegment(runner, segments.getItem(i), cur);
            }
        }
    }

    function parseSegment(runner: ISegmentRunner, segment: SVGPathSeg, cur: number[]) {
        switch (segment.pathSegType) {
            case SVGPathSeg.PATHSEG_ARC_ABS:
                let arc1 = <SVGPathSegArcAbs>segment;
                let ell1 = ellipticalArc.toEllipse(cur[0], cur[1], arc1.r1, arc1.r2, arc1.angle, arc1.largeArcFlag ? 1 : 0, arc1.sweepFlag ? 1 : 0, arc1.x, arc1.y);
                if (!ell1.rx || !ell1.ry)
                    runner.lineTo(ell1.cx, ell1.cy);
                else
                    runner.ellipse(ell1.cx, ell1.cy, ell1.rx, ell1.ry, ell1.phi, ell1.sa, ell1.ea, ell1.ac);
                cur[0] = arc1.x;
                cur[1] = arc1.y;
                break;
            case SVGPathSeg.PATHSEG_ARC_REL:
                let arc2 = <SVGPathSegArcRel>segment;
                let ell2 = ellipticalArc.toEllipse(cur[0], cur[1], arc2.r1, arc2.r2, arc2.angle, arc2.largeArcFlag ? 1 : 0, arc2.sweepFlag ? 1 : 0, cur[0] + arc2.x, cur[1] + arc2.y);
                if (!ell2.rx || !ell2.ry)
                    runner.lineTo(ell2.cx, ell2.cy);
                else
                    runner.ellipse(ell2.cx, ell2.cy, ell2.rx, ell2.ry, ell2.phi, ell2.sa, ell2.ea, ell2.ac);
                cur[0] += arc2.x;
                cur[1] += arc2.y;
                break;
            case SVGPathSeg.PATHSEG_CLOSEPATH:
                runner.closePath();
                break;
            case SVGPathSeg.PATHSEG_CURVETO_CUBIC_ABS:
                let curve1 = <SVGPathSegCurvetoCubicAbs>segment;
                runner.bezierCurveTo(curve1.x1, curve1.y1, curve1.x2, curve1.y2, curve1.x, curve1.y);
                cur[0] = curve1.x;
                cur[1] = curve1.y;
                break;
            case SVGPathSeg.PATHSEG_CURVETO_CUBIC_REL:
                let curve2 = <SVGPathSegCurvetoCubicRel>segment;
                runner.bezierCurveTo(cur[0] + curve2.x1, cur[1] + curve2.y1, cur[0] + curve2.x2, cur[1] + curve2.y2, cur[0] + curve2.x, cur[1] + curve2.y);
                cur[0] += curve2.x;
                cur[1] += curve2.y;
                break;
            case SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_ABS:
                let curve3 = <SVGPathSegCurvetoCubicSmoothAbs>segment;
                smoothCubic(runner, curve3.x2, curve3.y2, curve3.x, curve3.y, cur);
                break;
            case SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_REL:
                let curve4 = <SVGPathSegCurvetoCubicSmoothRel>segment;
                smoothCubic(runner, cur[0] + curve4.x2, cur[1] + curve4.y2, cur[0] + curve4.x, cur[1] + curve4.y, cur);
                break;
            case SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_ABS:
                let curve5 = <SVGPathSegCurvetoQuadraticAbs>segment;
                runner.quadraticCurveTo(curve5.x1, curve5.y1, curve5.x, curve5.y);
                cur[0] = curve5.x;
                cur[1] = curve5.y;
                break;
            case SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_REL:
                let curve6 = <SVGPathSegCurvetoQuadraticRel>segment;
                runner.quadraticCurveTo(cur[0] + curve6.x1, cur[1] + curve6.y1, cur[0] + curve6.x, cur[1] + curve6.y);
                cur[0] += curve6.x;
                cur[1] += curve6.y;
                break;
            case SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_SMOOTH_ABS:
                let curve7 = <SVGPathSegCurvetoQuadraticSmoothAbs>segment;
                smoothQuadratic(runner, curve7.x, curve7.y, cur);
                break;
            case SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_SMOOTH_REL:
                let curve8 = <SVGPathSegCurvetoQuadraticSmoothRel>segment;
                smoothQuadratic(runner, cur[0] + curve8.x, cur[1] + curve8.y, cur);
                break;
            case SVGPathSeg.PATHSEG_LINETO_ABS:
                let line1 = <SVGPathSegLinetoAbs>segment;
                cur[0] = line1.x;
                cur[1] = line1.y;
                runner.lineTo(cur[0], cur[1]);
                break;
            case SVGPathSeg.PATHSEG_LINETO_HORIZONTAL_ABS:
                let line2 = <SVGPathSegLinetoHorizontalAbs>segment;
                cur[0] = line2.x;
                runner.lineTo(cur[0], cur[1]);
                break;
            case SVGPathSeg.PATHSEG_LINETO_HORIZONTAL_REL:
                let line3 = <SVGPathSegLinetoHorizontalRel>segment;
                cur[0] += line3.x;
                runner.lineTo(cur[0], cur[1]);
                break;
            case SVGPathSeg.PATHSEG_LINETO_REL:
                let line4 = <SVGPathSegLinetoRel>segment;
                cur[0] += line4.x;
                cur[1] += line4.y;
                runner.lineTo(cur[0], cur[1]);
                break;
            case SVGPathSeg.PATHSEG_LINETO_VERTICAL_ABS:
                let line5 = <SVGPathSegLinetoVerticalAbs>segment;
                cur[1] = line5.y;
                runner.lineTo(cur[0], cur[1]);
                break;
            case SVGPathSeg.PATHSEG_LINETO_VERTICAL_REL:
                let line6 = <SVGPathSegLinetoVerticalRel>segment;
                cur[1] += line6.y;
                runner.lineTo(cur[0], cur[1]);
                break;
            case SVGPathSeg.PATHSEG_MOVETO_ABS:
                let move1 = <SVGPathSegMovetoAbs>segment;
                cur[0] = move1.x;
                cur[1] = move1.y;
                runner.moveTo(cur[0], cur[1]);
                break;
            case SVGPathSeg.PATHSEG_MOVETO_REL:
                let move2 = <SVGPathSegMovetoRel>segment;
                cur[0] += move2.x;
                cur[1] += move2.y;
                runner.moveTo(cur[0], cur[1]);
                break;
            default:
            case SVGPathSeg.PATHSEG_UNKNOWN:
                console.warn("Unknown path segment.");
                break;
        }
    }

    function smoothCubic(runner: ISegmentRunner, x2: number, y2: number, x: number, y: number, cur: number[]) {
        var [cx, cy] = cur;
        console.warn("Smooth cubic", "Not implemented");
    }

    function smoothQuadratic(runner: ISegmentRunner, x: number, y: number, cur: number[]) {
        var [cx, cy] = cur;
        console.warn("Smooth quadratic", "Not implemented");
    }
}