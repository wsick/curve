var gfx;
(function (gfx) {
    gfx.version = '0.1.0';
})(gfx || (gfx = {}));
var gfx;
(function (gfx) {
    var proto = CanvasRenderingContext2D.prototype;
    if (typeof proto.drawPath !== "function") {
        proto.drawPath = function (path) {
            this.beginPath();
            path.draw(this);
        };
    }
})(gfx || (gfx = {}));
var gfx;
(function (gfx) {
    var proto = CanvasRenderingContext2D.prototype;
    if (!proto.ellipse) {
        proto.ellipse = function (x, y, radiusX, radiusY, rotation, startAngle, endAngle, antiClockwise) {
            this.save();
            this.translate(x, y);
            this.rotate(rotation);
            this.scale(radiusX, radiusY);
            this.arc(0, 0, 1, startAngle, endAngle, antiClockwise);
            this.restore();
        };
    }
})(gfx || (gfx = {}));
var gfx;
(function (gfx) {
    var proto = CanvasRenderingContext2D.prototype;
    var _fill = proto.fill;
    proto.fill = function (arg) {
        if (arg instanceof gfx.Path) {
            this.drawPath(arg);
            _fill.apply(this, Array.prototype.slice.call(arguments, 1));
        }
        else {
            _fill.apply(this, arguments);
        }
    };
    var _stroke = proto.stroke;
    proto.stroke = function (arg) {
        if (arg instanceof gfx.Path) {
            this.drawPath(arg);
            _stroke.call(this);
        }
        else {
            _stroke.call(this);
        }
    };
    var _clip = proto.clip;
    proto.clip = function (arg) {
        if (arg instanceof gfx.Path) {
            this.drawPath(arg);
            _clip.apply(this, Array.prototype.slice.call(arguments, 1));
        }
        else {
            _clip.apply(this, arguments);
        }
    };
})(gfx || (gfx = {}));
(function (global) {
    if (typeof global.TextEncoder === "function")
        return;
    global.TextEncoder = function TextEncoder() {
    };
    Object.defineProperty(TextEncoder.prototype, "encoding", { value: 'utf-8', writable: false });
    TextEncoder.prototype.encode = function encode(str) {
        var buf = new ArrayBuffer(str.length);
        var arr = new Uint8Array(buf);
        for (var i = 0; i < arr.length; i++) {
            arr[i] = str.charCodeAt(i);
        }
        return arr;
    };
})(this);
var gfx;
(function (gfx) {
    var ellipticalArc;
    (function (ellipticalArc) {
        var NO_DRAW_EPSILON = 0.000002;
        var ZERO_EPSILON = 0.000019;
        var SMALL_EPSILON = 0.000117;
        function generate(path, sx, sy, rx, ry, rotationAngle, isLargeArcFlag, sweepDirectionFlag, ex, ey) {
            var sx = sx, sy = sy, ex = ex, ey = ey, rx = rx, ry = ry;
            if (Math.abs(ex - sx) < NO_DRAW_EPSILON && Math.abs(ey - sy) < NO_DRAW_EPSILON)
                return;
            if (Math.abs(rx) < ZERO_EPSILON || Math.abs(ry) < ZERO_EPSILON) {
                path.lineTo(ex, ey);
                return;
            }
            if (Math.abs(rx) < SMALL_EPSILON || Math.abs(ry) < SMALL_EPSILON) {
                return;
            }
            rx = Math.abs(rx);
            ry = Math.abs(ry);
            var angle = rotationAngle * Math.PI / 180.0;
            var cos_phi = Math.cos(angle);
            var sin_phi = Math.sin(angle);
            var dx2 = (sx - ex) / 2.0;
            var dy2 = (sy - ey) / 2.0;
            var x1p = cos_phi * dx2 + sin_phi * dy2;
            var y1p = cos_phi * dy2 - sin_phi * dx2;
            var x1p2 = x1p * x1p;
            var y1p2 = y1p * y1p;
            var rx2 = rx * rx;
            var ry2 = ry * ry;
            var lambda = (x1p2 / rx2) + (y1p2 / ry2);
            if (lambda > 1.0) {
                var lambda_root = Math.sqrt(lambda);
                rx *= lambda_root;
                ry *= lambda_root;
                rx2 = rx * rx;
                ry2 = ry * ry;
            }
            var cxp, cyp, cx, cy;
            var c = (rx2 * ry2) - (rx2 * y1p2) - (ry2 * x1p2);
            var large = isLargeArcFlag === true;
            var sweep = sweepDirectionFlag === gfx.SweepDirection.Clockwise;
            if (c < 0.0) {
                var scale = Math.sqrt(1.0 - c / (rx2 * ry2));
                rx *= scale;
                ry *= scale;
                rx2 = rx * rx;
                ry2 = ry * ry;
                cxp = 0.0;
                cyp = 0.0;
                cx = 0.0;
                cy = 0.0;
            }
            else {
                c = Math.sqrt(c / ((rx2 * y1p2) + (ry2 * x1p2)));
                if (large === sweep)
                    c = -c;
                cxp = c * (rx * y1p / ry);
                cyp = c * (-ry * x1p / rx);
                cx = cos_phi * cxp - sin_phi * cyp;
                cy = sin_phi * cxp + cos_phi * cyp;
            }
            cx += (sx + ex) / 2.0;
            cy += (sy + ey) / 2.0;
            var at = Math.atan2(((y1p - cyp) / ry), ((x1p - cxp) / rx));
            var theta1 = (at < 0.0) ? 2.0 * Math.PI + at : at;
            var nat = Math.atan2(((-y1p - cyp) / ry), ((-x1p - cxp) / rx));
            var delta_theta = (nat < at) ? 2.0 * Math.PI - at + nat : nat - at;
            if (sweep) {
                if (delta_theta < 0.0)
                    delta_theta += 2.0 * Math.PI;
            }
            else {
                if (delta_theta > 0.0)
                    delta_theta -= 2.0 * Math.PI;
            }
            var segment_count = Math.floor(Math.abs(delta_theta / (Math.PI / 2))) + 1;
            var delta = delta_theta / segment_count;
            var bcp = 4.0 / 3 * (1 - Math.cos(delta / 2)) / Math.sin(delta / 2);
            var cos_phi_rx = cos_phi * rx;
            var cos_phi_ry = cos_phi * ry;
            var sin_phi_rx = sin_phi * rx;
            var sin_phi_ry = sin_phi * ry;
            var cos_theta1 = Math.cos(theta1);
            var sin_theta1 = Math.sin(theta1);
            for (var i = 0; i < segment_count; ++i) {
                var theta2 = theta1 + delta;
                var cos_theta2 = Math.cos(theta2);
                var sin_theta2 = Math.sin(theta2);
                var c1x = sx - bcp * (cos_phi_rx * sin_theta1 + sin_phi_ry * cos_theta1);
                var c1y = sy + bcp * (cos_phi_ry * cos_theta1 - sin_phi_rx * sin_theta1);
                var cur_ex = cx + (cos_phi_rx * cos_theta2 - sin_phi_ry * sin_theta2);
                var cur_ey = cy + (sin_phi_rx * cos_theta2 + cos_phi_ry * sin_theta2);
                var c2x = cur_ex + bcp * (cos_phi_rx * sin_theta2 + sin_phi_ry * cos_theta2);
                var c2y = cur_ey + bcp * (sin_phi_rx * sin_theta2 - cos_phi_ry * cos_theta2);
                path.bezierCurveTo(c1x, c1y, c2x, c2y, cur_ex, cur_ey);
                sx = cur_ex;
                sy = cur_ey;
                theta1 = theta2;
                cos_theta1 = cos_theta2;
                sin_theta1 = sin_theta2;
            }
        }
        ellipticalArc.generate = generate;
    })(ellipticalArc = gfx.ellipticalArc || (gfx.ellipticalArc = {}));
})(gfx || (gfx = {}));
var gfx;
(function (gfx) {
    var parse;
    (function (parse) {
        parse.style = parse.ParseStyles.CharMatching;
        function getParser() {
            if (parse.style === parse.ParseStyles.Buffer)
                return new parse.buffer.Parser();
            return new parse.matching.Parser();
        }
        parse.getParser = getParser;
    })(parse = gfx.parse || (gfx.parse = {}));
})(gfx || (gfx = {}));
var gfx;
(function (gfx) {
    var parse;
    (function (parse) {
        (function (ParseStyles) {
            ParseStyles[ParseStyles["CharMatching"] = 2] = "CharMatching";
            ParseStyles[ParseStyles["Buffer"] = 1] = "Buffer";
        })(parse.ParseStyles || (parse.ParseStyles = {}));
        var ParseStyles = parse.ParseStyles;
    })(parse = gfx.parse || (gfx.parse = {}));
})(gfx || (gfx = {}));
var gfx;
(function (gfx) {
    var segments;
    (function (segments) {
        var Arc = (function () {
            function Arc() {
            }
            Arc.prototype.draw = function (ctx, args) {
                var x = args[0];
                var y = args[1];
                var radius = args[2];
                var sa = args[3];
                var ea = args[4];
                var cc = args[5];
                ctx.arc(x, y, radius, sa, ea, cc);
            };
            Arc.prototype.init = function (metrics, x, y, radius, sa, ea, cc) {
                if (metrics.inited)
                    return;
                var sx = metrics.sx = x + (radius * Math.cos(sa));
                var sy = metrics.sy = y + (radius * Math.sin(sa));
                var ex = metrics.ex = x + (radius * Math.cos(ea));
                var ey = metrics.ey = y + (radius * Math.sin(ea));
                var l = metrics.l = x - radius;
                metrics.cl = arcContainsPoint(sx, sy, ex, ey, l, y, cc);
                var r = metrics.r = x + radius;
                metrics.cr = arcContainsPoint(sx, sy, ex, ey, r, y, cc);
                var t = metrics.t = y - radius;
                metrics.ct = arcContainsPoint(sx, sy, ex, ey, x, t, cc);
                var b = metrics.b = y + radius;
                metrics.cb = arcContainsPoint(sx, sy, ex, ey, x, b, cc);
                metrics.inited = true;
            };
            Arc.prototype.extendFillBox = function (box, sx, sy, args, metrics) {
                var x = args[0];
                var y = args[1];
                var radius = args[2];
                var sa = args[3];
                var ea = args[4];
                var cc = args[5];
                if (ea === sa)
                    return;
                this.init(metrics, x, y, radius, sa, ea, cc);
                box.l = Math.min(box.l, sx, metrics.ex);
                box.r = Math.max(box.r, sx, metrics.ex);
                box.t = Math.min(box.t, sy, metrics.ey);
                box.b = Math.max(box.b, sy, metrics.ey);
                if (metrics.cl)
                    box.l = Math.min(box.l, metrics.l);
                if (metrics.cr)
                    box.r = Math.max(box.r, metrics.r);
                if (metrics.ct)
                    box.t = Math.min(box.t, metrics.t);
                if (metrics.cb)
                    box.b = Math.max(box.b, metrics.b);
            };
            Arc.prototype.extendStrokeBox = function (box, sx, sy, args, pars, metrics) {
                var x = args[0];
                var y = args[1];
                var radius = args[2];
                var sa = args[3];
                var ea = args[4];
                var cc = args[5];
                if (ea === sa)
                    return;
                this.init(metrics, x, y, radius, sa, ea, cc);
                box.l = Math.min(box.l, sx, metrics.ex);
                box.r = Math.max(box.r, sx, metrics.ex);
                box.t = Math.min(box.t, sy, metrics.ey);
                box.b = Math.max(box.b, sy, metrics.ey);
                var hs = pars.strokeThickness / 2.0;
                if (metrics.cl)
                    box.l = Math.min(box.l, metrics.l - hs);
                if (metrics.cr)
                    box.r = Math.max(box.r, metrics.r + hs);
                if (metrics.ct)
                    box.t = Math.min(box.t, metrics.t - hs);
                if (metrics.cb)
                    box.b = Math.max(box.b, metrics.b + hs);
                var cap = pars.strokeStartLineCap || pars.strokeEndLineCap || 0;
                var sv = this.getStartVector(metrics.sx, metrics.sy, args, metrics);
                sv[0] = -sv[0];
                sv[1] = -sv[1];
                var ss = getCapSpread(sx, sy, pars.strokeThickness, cap, sv);
                var ev = this.getEndVector(metrics.sx, metrics.sy, args, metrics);
                var es = getCapSpread(metrics.ex, metrics.ey, pars.strokeThickness, cap, ev);
                box.l = Math.min(box.l, ss.x1, ss.x2, es.x1, es.x2);
                box.r = Math.max(box.r, ss.x1, ss.x2, es.x1, es.x2);
                box.t = Math.min(box.t, ss.y1, ss.y2, es.y1, es.y2);
                box.b = Math.max(box.b, ss.y1, ss.y2, es.y1, es.y2);
            };
            Arc.prototype.getStartVector = function (sx, sy, args, metrics) {
                var x = args[0];
                var y = args[1];
                var radius = args[2];
                var sa = args[3];
                var ea = args[4];
                var cc = args[5];
                this.init(metrics, x, y, radius, sa, ea, cc);
                var rv = [
                    sx - x,
                    sy - y
                ];
                if (cc)
                    return [rv[1], -rv[0]];
                return [-rv[1], rv[0]];
            };
            Arc.prototype.getEndVector = function (sx, sy, args, metrics) {
                var x = args[0];
                var y = args[1];
                var radius = args[2];
                var sa = args[3];
                var ea = args[4];
                var cc = args[5];
                this.init(metrics, x, y, radius, sa, ea, cc);
                var rv = [
                    metrics.ex - x,
                    metrics.ey - y
                ];
                if (cc)
                    return [rv[1], -rv[0]];
                return [-rv[1], rv[0]];
            };
            return Arc;
        })();
        segments.Arc = Arc;
        function arcContainsPoint(sx, sy, ex, ey, cpx, cpy, cc) {
            var n = (ex - sx) * (cpy - sy) - (cpx - sx) * (ey - sy);
            if (n === 0)
                return true;
            if (n > 0 && cc)
                return true;
            if (n < 0 && !cc)
                return true;
            return false;
        }
        function getCapSpread(x, y, thickness, cap, vector) {
            var hs = thickness / 2.0;
            switch (cap) {
                case gfx.PenLineCap.Round:
                    return {
                        x1: x - hs,
                        x2: x + hs,
                        y1: y - hs,
                        y2: y + hs
                    };
                    break;
                case gfx.PenLineCap.Square:
                    var ed = normalizeVector(vector);
                    var edo = perpendicularVector(ed);
                    return {
                        x1: x + hs * (ed[0] + edo[0]),
                        x2: x + hs * (ed[0] - edo[0]),
                        y1: y + hs * (ed[1] + edo[1]),
                        y2: y + hs * (ed[1] - edo[1])
                    };
                    break;
                case gfx.PenLineCap.Flat:
                default:
                    var ed = normalizeVector(vector);
                    var edo = perpendicularVector(ed);
                    return {
                        x1: x + hs * edo[0],
                        x2: x + hs * -edo[0],
                        y1: y + hs * edo[1],
                        y2: y + hs * -edo[1]
                    };
                    break;
            }
        }
        function normalizeVector(v) {
            var len = Math.sqrt(v[0] * v[0] + v[1] * v[1]);
            return [
                v[0] / len,
                v[1] / len
            ];
        }
        function perpendicularVector(v) {
            return [
                -v[1],
                v[0]
            ];
        }
    })(segments = gfx.segments || (gfx.segments = {}));
})(gfx || (gfx = {}));
var gfx;
(function (gfx) {
    var segments;
    (function (segments) {
        var LineTo = (function () {
            function LineTo() {
            }
            LineTo.prototype.draw = function (ctx, args) {
                var x = args[0];
                var y = args[1];
                ctx.lineTo(x, y);
            };
            LineTo.prototype.extendFillBox = function (box, sx, sy, args) {
                var x = args[0];
                var y = args[1];
                box.l = Math.min(box.l, x);
                box.r = Math.max(box.r, x);
                box.t = Math.min(box.t, y);
                box.b = Math.max(box.b, y);
            };
            LineTo.prototype.extendStrokeBox = function (box, sx, sy, args, pars) {
                this.extendFillBox(box, sx, sy, args);
            };
            LineTo.prototype.getStartVector = function (sx, sy, args) {
                return [
                    args[0] - sx,
                    args[1] - sy
                ];
            };
            LineTo.prototype.getEndVector = function (sx, sy, args) {
                return [
                    args[0] - sx,
                    args[1] - sy
                ];
            };
            return LineTo;
        })();
        segments.LineTo = LineTo;
    })(segments = gfx.segments || (gfx.segments = {}));
})(gfx || (gfx = {}));
var gfx;
(function (gfx) {
    var segments;
    (function (segments) {
        var _arc = new segments.Arc();
        var _lineTo = new segments.LineTo();
        var ArcTo = (function () {
            function ArcTo() {
            }
            ArcTo.prototype.draw = function (ctx, args) {
                var x1 = args[0];
                var y1 = args[1];
                var x2 = args[2];
                var y2 = args[3];
                var radius = args[4];
                ctx.arcTo(x1, y1, x2, y2, radius);
            };
            ArcTo.prototype.init = function (metrics, sx, sy, args) {
                if (metrics.inited || sx !== metrics.sx || sy !== metrics.sy)
                    return;
                metrics.sx = sx;
                metrics.sy = sy;
                var x1 = args[0];
                var y1 = args[1];
                var x2 = args[2];
                var y2 = args[3];
                var radius = args[4];
                var v1 = la.vec2.create(x1 - sx, y1 - sy);
                var v2 = la.vec2.create(x2 - x1, y2 - y1);
                var inner_theta = Math.PI - la.vec2.angleBetween(v1, v2);
                var a = getTangentPoint(inner_theta, radius, la.vec2.create(sx, sy), v1, true);
                var b = getTangentPoint(inner_theta, radius, la.vec2.create(x1, y1), v2, false);
                metrics.line = {
                    args: [a[0], a[1]]
                };
                metrics.arc = createArc(a, v1, b, v2, radius);
                metrics.inited = true;
            };
            ArcTo.prototype.extendFillBox = function (box, sx, sy, args, metrics) {
                this.init(metrics, sx, sy, args);
                box.l = Math.min(box.l, sx);
                box.r = Math.max(box.r, sx);
                box.t = Math.min(box.t, sy);
                box.b = Math.max(box.b, sy);
                var mline = metrics.line, marc = metrics.arc;
                _lineTo.extendFillBox(box, mline.sx, mline.sy, mline.args);
                _arc.extendFillBox(box, marc.sx, marc.sy, marc.args, marc.metrics);
            };
            ArcTo.prototype.extendStrokeBox = function (box, sx, sy, args, pars, metrics) {
                this.init(metrics, sx, sy, args);
                var hs = pars.strokeThickness / 2;
                box.l = Math.min(box.l, sx - hs);
                box.r = Math.max(box.r, sx + hs);
                box.t = Math.min(box.t, sy - hs);
                box.b = Math.max(box.b, sy + hs);
                var mline = metrics.line, marc = metrics.arc;
                _lineTo.extendStrokeBox(box, mline.sx, mline.sy, mline.args, pars);
                _arc.extendStrokeBox(box, marc.sx, marc.sy, marc.args, marc.metrics, pars);
            };
            ArcTo.prototype.getStartVector = function (sx, sy, args, metrics) {
                this.init(metrics, sx, sy, args);
                return _lineTo.getStartVector(sx, sy, metrics.line.args);
            };
            ArcTo.prototype.getEndVector = function (sx, sy, args, metrics) {
                this.init(metrics, sx, sy, args);
                var marc = metrics.arc;
                return _arc.getEndVector(marc.sx, marc.sy, marc.args, marc.metrics);
            };
            return ArcTo;
        })();
        segments.ArcTo = ArcTo;
        function createArc(a, v1, b, v2, radius) {
            var c = getPerpendicularIntersections(a, v1, b, v2);
            var cc = !la.vec2.isClockwiseTo(v1, v2);
            var sa = Math.atan2(a[1] - c[1], a[0] - c[0]);
            if (sa < 0)
                sa = (2 * Math.PI) + sa;
            var ea = Math.atan2(b[1] - c[1], b[0] - c[0]);
            if (ea < 0)
                ea = (2 * Math.PI) + ea;
            return {
                sx: a[0],
                sy: a[1],
                args: [c[0], c[1], radius, sa, ea, cc],
                metrics: {}
            };
        }
        function getTangentPoint(theta, radius, s, d, invert) {
            var len = Math.sqrt(d[0] * d[0] + d[1] * d[1]);
            var f = radius / Math.tan(theta / 2);
            var t = f / len;
            if (invert)
                t = 1 - t;
            return la.vec2.create(s[0] + t * d[0], s[1] + t * d[1]);
        }
        function getPerpendicularIntersections(s1, d1, s2, d2) {
            var p1 = la.vec2.orthogonal(la.vec2.create(d1[0], d1[2]));
            var p2 = la.vec2.orthogonal(la.vec2.create(d2[0], d2[2]));
            return la.vec2.intersection(s1, p1, s2, p2);
        }
    })(segments = gfx.segments || (gfx.segments = {}));
})(gfx || (gfx = {}));
var gfx;
(function (gfx) {
    var segments;
    (function (segments) {
        var BezierCurveTo = (function () {
            function BezierCurveTo() {
            }
            BezierCurveTo.prototype.draw = function (ctx, args) {
                var cp1x = args[0];
                var cp1y = args[1];
                var cp2x = args[2];
                var cp2y = args[3];
                var x = args[4];
                var y = args[5];
                ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
            };
            BezierCurveTo.prototype.extendFillBox = function (box, sx, sy, args) {
                var cp1x = args[0];
                var cp1y = args[1];
                var cp2x = args[2];
                var cp2y = args[3];
                var x = args[4];
                var y = args[5];
                var m = getMaxima(sx, cp1x, cp2x, x, sy, cp1y, cp2y, y);
                if (m.x[0] != null) {
                    box.l = Math.min(box.l, m.x[0]);
                    box.r = Math.max(box.r, m.x[0]);
                }
                if (m.x[1] != null) {
                    box.l = Math.min(box.l, m.x[1]);
                    box.r = Math.max(box.r, m.x[1]);
                }
                if (m.y[0] != null) {
                    box.t = Math.min(box.t, m.y[0]);
                    box.b = Math.max(box.b, m.y[0]);
                }
                if (m.y[1] != null) {
                    box.t = Math.min(box.t, m.y[1]);
                    box.b = Math.max(box.b, m.y[1]);
                }
                box.l = Math.min(box.l, x);
                box.r = Math.max(box.r, x);
                box.t = Math.min(box.t, y);
                box.b = Math.max(box.b, y);
            };
            BezierCurveTo.prototype.extendStrokeBox = function (box, sx, sy, args, pars) {
                var cp1x = args[0];
                var cp1y = args[1];
                var cp2x = args[2];
                var cp2y = args[3];
                var x = args[4];
                var y = args[5];
                var hs = pars.strokeThickness / 2.0;
                var m = getMaxima(sx, cp1x, cp2x, x, sy, cp1y, cp2y, y);
                if (m.x[0] != null) {
                    box.l = Math.min(box.l, m.x[0] - hs);
                    box.r = Math.max(box.r, m.x[0] + hs);
                }
                if (m.x[1] != null) {
                    box.l = Math.min(box.l, m.x[1] - hs);
                    box.r = Math.max(box.r, m.x[1] + hs);
                }
                if (m.y[0] != null) {
                    box.t = Math.min(box.t, m.y[0] - hs);
                    box.b = Math.max(box.b, m.y[0] + hs);
                }
                if (m.y[1] != null) {
                    box.t = Math.min(box.t, m.y[1] - hs);
                    box.b = Math.max(box.b, m.y[1] + hs);
                }
                box.l = Math.min(box.l, x);
                box.r = Math.max(box.r, x);
                box.t = Math.min(box.t, y);
                box.b = Math.max(box.b, y);
            };
            BezierCurveTo.prototype.getStartVector = function (sx, sy, args) {
                var cp1x = args[0];
                var cp1y = args[1];
                return [
                    3 * (cp1x - sx),
                    3 * (cp1y - sy)
                ];
            };
            BezierCurveTo.prototype.getEndVector = function (sx, sy, args) {
                var cp2x = args[2];
                var cp2y = args[3];
                var x = args[4];
                var y = args[5];
                return [
                    3 * (x - cp2x),
                    3 * (y - cp2y)
                ];
            };
            return BezierCurveTo;
        })();
        segments.BezierCurveTo = BezierCurveTo;
        function getMaxima(x1, x2, x3, x4, y1, y2, y3, y4) {
            return {
                x: cod(x1, x2, x3, x4),
                y: cod(y1, y2, y3, y4)
            };
        }
        function cod(a, b, c, d) {
            var u = 2 * a - 4 * b + 2 * c;
            var v = b - a;
            var w = -a + 3 * b + d - 3 * c;
            var rt = Math.sqrt(u * u - 4 * v * w);
            var cods = [null, null];
            if (isNaN(rt))
                return cods;
            var t, ot;
            t = (-u + rt) / (2 * w);
            if (t >= 0 && t <= 1) {
                ot = 1 - t;
                cods[0] = (a * ot * ot * ot) + (3 * b * t * ot * ot) + (3 * c * ot * t * t) + (d * t * t * t);
            }
            t = (-u - rt) / (2 * w);
            if (t >= 0 && t <= 1) {
                ot = 1 - t;
                cods[1] = (a * ot * ot * ot) + (3 * b * t * ot * ot) + (3 * c * ot * t * t) + (d * t * t * t);
            }
            return cods;
        }
    })(segments = gfx.segments || (gfx.segments = {}));
})(gfx || (gfx = {}));
var gfx;
(function (gfx) {
    var segments;
    (function (segments) {
        var ClosePath = (function () {
            function ClosePath() {
            }
            ClosePath.prototype.draw = function (ctx, args) {
                ctx.closePath();
            };
            ClosePath.prototype.extendFillBox = function (box, sx, sy, args) {
            };
            ClosePath.prototype.extendStrokeBox = function (box, sx, sy, args, pars) {
            };
            ClosePath.prototype.getStartVector = function (sx, sy, args) {
                return undefined;
            };
            ClosePath.prototype.getEndVector = function (sx, sy, args) {
                return undefined;
            };
            return ClosePath;
        })();
        segments.ClosePath = ClosePath;
    })(segments = gfx.segments || (gfx.segments = {}));
})(gfx || (gfx = {}));
var gfx;
(function (gfx) {
    var segments;
    (function (segments) {
        var Ellipse = (function () {
            function Ellipse() {
            }
            Ellipse.prototype.draw = function (ctx, args) {
                var x = args[0];
                var y = args[1];
                var rx = args[2];
                var ry = args[3];
                var rotation = args[4];
                var sa = args[5];
                var ea = args[6];
                var ac = args[7];
                ctx.ellipse(x, y, rx, ry, rotation, sa, ea, ac);
            };
            Ellipse.prototype.extendFillBox = function (box, sx, sy, args, metrics) {
                var x = args[0];
                var y = args[1];
                var rx = args[2];
                var ry = args[3];
                var rotation = args[4];
                var sa = args[5];
                var ea = args[6];
                var ac = args[7] === true;
                console.warn("extendFillBox", "Currently not accounting for rotation or start/end angle.");
                box.l = Math.min(box.l, x);
                box.r = Math.max(box.r, x + rx + rx);
                box.t = Math.min(box.t, y);
                box.b = Math.max(box.b, y + ry + ry);
            };
            Ellipse.prototype.extendStrokeBox = function (box, sx, sy, args, pars, metrics) {
                var x = args[0];
                var y = args[1];
                var rx = args[2];
                var ry = args[3];
                var rotation = args[4];
                var sa = args[5];
                var ea = args[6];
                var ac = args[7] === true;
                console.warn("extendStrokeBox", "Currently not accounting for rotation or start/end angle.");
                var hs = pars.strokeThickness / 2.0;
                box.l = Math.min(box.l, x - hs);
                box.r = Math.max(box.r, x + rx + rx + hs);
                box.t = Math.min(box.t, y - hs);
                box.b = Math.max(box.b, y + ry + ry + hs);
            };
            Ellipse.prototype.getStartVector = function (sx, sy, args, metrics) {
                console.warn("getStartVector", "Currently not accounting for rotation or start/end angle.");
                return undefined;
            };
            Ellipse.prototype.getEndVector = function (sx, sy, args, metrics) {
                console.warn("getEndVector", "Currently not accounting for rotation or start/end angle.");
                return undefined;
            };
            return Ellipse;
        })();
        segments.Ellipse = Ellipse;
    })(segments = gfx.segments || (gfx.segments = {}));
})(gfx || (gfx = {}));
var gfx;
(function (gfx) {
    var segments;
    (function (segments) {
        var MoveTo = (function () {
            function MoveTo() {
            }
            MoveTo.prototype.draw = function (ctx, args) {
                var x = args[0];
                var y = args[1];
                ctx.moveTo(x, y);
            };
            MoveTo.prototype.extendFillBox = function (box, sx, sy, args) {
                var x = args[0];
                var y = args[1];
                box.l = Math.min(box.l, x);
                box.r = Math.max(box.r, x);
                box.t = Math.min(box.t, y);
                box.b = Math.max(box.b, y);
            };
            MoveTo.prototype.extendStrokeBox = function (box, sx, sy, args, pars) {
                this.extendFillBox(box, sx, sy, args);
            };
            MoveTo.prototype.getStartVector = function (sx, sy, args) {
                return undefined;
            };
            MoveTo.prototype.getEndVector = function (sx, sy, args) {
                return undefined;
            };
            return MoveTo;
        })();
        segments.MoveTo = MoveTo;
    })(segments = gfx.segments || (gfx.segments = {}));
})(gfx || (gfx = {}));
var gfx;
(function (gfx) {
    var segments;
    (function (segments) {
        var QuadraticCurveTo = (function () {
            function QuadraticCurveTo() {
            }
            QuadraticCurveTo.prototype.draw = function (ctx, args) {
                var cpx = args[0];
                var cpy = args[1];
                var x = args[2];
                var y = args[3];
                ctx.quadraticCurveTo(cpx, cpy, x, y);
            };
            QuadraticCurveTo.prototype.extendFillBox = function (box, sx, sy, args) {
                var cpx = args[0];
                var cpy = args[1];
                var x = args[2];
                var y = args[3];
                var m = getMaxima(sx, cpx, x, sy, cpy, y);
                if (m.x != null) {
                    box.l = Math.min(box.l, m.x);
                    box.r = Math.max(box.r, m.x);
                }
                if (m.y != null) {
                    box.t = Math.min(box.t, m.y);
                    box.b = Math.max(box.b, m.y);
                }
                box.l = Math.min(box.l, x);
                box.r = Math.max(box.r, x);
                box.t = Math.min(box.t, y);
                box.b = Math.max(box.b, y);
            };
            QuadraticCurveTo.prototype.extendStrokeBox = function (box, sx, sy, args, pars) {
                var cpx = args[0];
                var cpy = args[1];
                var x = args[2];
                var y = args[3];
                var hs = pars.strokeThickness / 2.0;
                var m = getMaxima(sx, cpx, x, sy, cpy, y);
                if (m.x) {
                    box.l = Math.min(box.l, m.x - hs);
                    box.r = Math.max(box.r, m.x + hs);
                }
                if (m.y) {
                    box.t = Math.min(box.t, m.y - hs);
                    box.b = Math.max(box.b, m.y + hs);
                }
                box.l = Math.min(box.l, x);
                box.r = Math.max(box.r, x);
                box.t = Math.min(box.t, y);
                box.b = Math.max(box.b, y);
            };
            QuadraticCurveTo.prototype.getStartVector = function (sx, sy, args) {
                var cpx = args[0];
                var cpy = args[1];
                return [
                    2 * (cpx - sx),
                    2 * (cpy - sy)
                ];
            };
            QuadraticCurveTo.prototype.getEndVector = function (sx, sy, args) {
                var cpx = args[0];
                var cpy = args[1];
                var x = args[2];
                var y = args[3];
                return [
                    2 * (x - cpx),
                    2 * (y - cpy)
                ];
            };
            return QuadraticCurveTo;
        })();
        segments.QuadraticCurveTo = QuadraticCurveTo;
        function getMaxima(x1, x2, x3, y1, y2, y3) {
            return {
                x: cod(x1, x2, x3),
                y: cod(y1, y2, y3)
            };
        }
        function cod(a, b, c) {
            var t = (a - b) / (a - 2 * b + c);
            if (t < 0 || t > 1)
                return null;
            return (a * Math.pow(1 - t, 2)) + (2 * b * (1 - t) * t) + (c * Math.pow(t, 2));
        }
    })(segments = gfx.segments || (gfx.segments = {}));
})(gfx || (gfx = {}));
var gfx;
(function (gfx) {
    var segments;
    (function (segments) {
        var Rect = (function () {
            function Rect() {
            }
            Rect.prototype.draw = function (ctx, args) {
                var x = args[0];
                var y = args[1];
                var w = args[2];
                var h = args[3];
                ctx.rect(x, y, w, h);
            };
            Rect.prototype.extendFillBox = function (box, sx, sy, args, metrics) {
                var x = args[0];
                var y = args[1];
                var w = args[2];
                var h = args[3];
                box.l = Math.min(box.l, x);
                box.r = Math.max(box.r, x + w);
                box.t = Math.min(box.t, y);
                box.b = Math.max(box.b, y + h);
            };
            Rect.prototype.extendStrokeBox = function (box, sx, sy, args, pars, metrics) {
                var x = args[0];
                var y = args[1];
                var w = args[2];
                var h = args[3];
                var hs = pars.strokeThickness / 2.0;
                box.l = Math.min(box.l, x - hs);
                box.r = Math.max(box.r, x + w + hs);
                box.t = Math.min(box.t, y - hs);
                box.b = Math.max(box.b, y + h + hs);
            };
            Rect.prototype.getStartVector = function (sx, sy, args, metrics) {
                return undefined;
            };
            Rect.prototype.getEndVector = function (sx, sy, args, metrics) {
                return undefined;
            };
            return Rect;
        })();
        segments.Rect = Rect;
    })(segments = gfx.segments || (gfx.segments = {}));
})(gfx || (gfx = {}));
var gfx;
(function (gfx) {
    var segments;
    (function (segments) {
        segments.all = [];
        segments.all[gfx.PathOpType.closePath] = new segments.ClosePath();
        segments.all[gfx.PathOpType.moveTo] = new segments.MoveTo();
        segments.all[gfx.PathOpType.lineTo] = new segments.LineTo();
        segments.all[gfx.PathOpType.bezierCurveTo] = new segments.BezierCurveTo();
        segments.all[gfx.PathOpType.quadraticCurveTo] = new segments.QuadraticCurveTo();
        segments.all[gfx.PathOpType.arc] = new segments.Arc();
        segments.all[gfx.PathOpType.arcTo] = new segments.ArcTo();
        segments.all[gfx.PathOpType.ellipse] = new segments.Ellipse();
        segments.all[gfx.PathOpType.rect] = new segments.Rect();
    })(segments = gfx.segments || (gfx.segments = {}));
})(gfx || (gfx = {}));
var gfx;
(function (gfx) {
    var parse;
    (function (parse) {
        var buffer;
        (function (buffer_1) {
            var Parser = (function () {
                function Parser() {
                }
                Parser.prototype.parse = function (path, data) {
                    var buffer = toBuffer(data);
                    return undefined;
                };
                return Parser;
            })();
            buffer_1.Parser = Parser;
            function parseNumber(tracker) {
                var start = tracker.offset;
                var data = tracker.data;
                var len = data.length;
                if (isNaN(data, tracker.offset)) {
                    tracker.offset += 3;
                    return NaN;
                }
                var negate = false;
                if (data[tracker.offset] === 0x2D) {
                    negate = true;
                    tracker.offset++;
                }
                else if (data[tracker.offset] === 0x2B) {
                    tracker.offset++;
                }
                if (isInfinity(data, tracker.offset)) {
                    tracker.offset += 8;
                    return negate ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;
                }
                parseInteger(tracker);
                var cur = data[tracker.offset];
                if (cur === 0x2E) {
                    tracker.offset++;
                    if (!parseMantissa(tracker))
                        throw new Error("Invalid number");
                }
                if (!parseSignificand(tracker))
                    throw new Error("Invalid number");
                return parseFloat(getSlice(data, start, tracker.offset - start));
            }
            buffer_1.parseNumber = parseNumber;
            function toBuffer(data) {
                if (data instanceof Uint8Array)
                    return data;
                if (typeof TextEncoder === "function")
                    return new TextEncoder().encode(data);
            }
            function isNaN(data, i) {
                return data[i + 0] === 0x4E
                    && data[i + 1] === 0x61
                    && data[i + 2] === 0x4E;
            }
            function isInfinity(data, i) {
                return data[i + 0] === 0x49
                    && data[i + 1] === 0x6E
                    && data[i + 2] === 0x66
                    && data[i + 3] === 0x69
                    && data[i + 4] === 0x6E
                    && data[i + 5] === 0x69
                    && data[i + 6] === 0x74
                    && data[i + 7] === 0x79;
            }
            function parseInteger(tracker) {
                var start = tracker.offset;
                var data = tracker.data;
                var cur;
                while ((cur = data[tracker.offset]) != null && cur >= 0x30 && cur <= 0x39) {
                    tracker.offset++;
                }
                return tracker.offset !== start;
            }
            function parseMantissa(tracker) {
                var start = tracker.offset;
                var data = tracker.data;
                var cur;
                while ((cur = data[tracker.offset]) != null && cur >= 0x30 && cur <= 0x39) {
                    tracker.offset++;
                }
                return tracker.offset !== start;
            }
            function parseSignificand(tracker) {
                var data = tracker.data;
                if (data[tracker.offset] !== 0x45 && data[tracker.offset] !== 0x65)
                    return true;
                tracker.offset++;
                var cur = data[tracker.offset];
                if (cur === 0x2D || cur === 0x2B)
                    tracker.offset++;
                return parseInteger(tracker);
            }
            function getSlice(data, offset, length) {
                var buf = new Array(length);
                for (var i = 0; i < length; i++) {
                    buf[i] = data[offset + i];
                }
                return String.fromCharCode.apply(null, buf);
            }
        })(buffer = parse.buffer || (parse.buffer = {}));
    })(parse = gfx.parse || (gfx.parse = {}));
})(gfx || (gfx = {}));
var gfx;
(function (gfx) {
    var parse;
    (function (parse_1) {
        var matching;
        (function (matching) {
            var Parser = (function () {
                function Parser() {
                }
                Parser.prototype.parse = function (path, data) {
                    if (typeof data === "string")
                        parse(path, data, data.length);
                    console.warn("Input parse data was not a string.", data);
                    return path;
                };
                return Parser;
            })();
            matching.Parser = Parser;
            function parse(path, str, len) {
                var index = 0;
                var fillRule = gfx.FillRule.EvenOdd;
                go();
                path.fillRule = fillRule || gfx.FillRule.EvenOdd;
                function go() {
                    var cp = { x: 0, y: 0 };
                    var cp1, cp2, cp3;
                    var start = { x: 0, y: 0 };
                    var cbz = false;
                    var qbz = false;
                    var cbzp = { x: 0, y: 0 };
                    var qbzp = { x: 0, y: 0 };
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
                                    fillRule = gfx.FillRule.EvenOdd;
                                else if (c === '1')
                                    fillRule = gfx.FillRule.NonZero;
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
                                cp = { x: x, y: cp.y };
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
                                cp = { x: cp.x, y: y };
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
                                    }
                                    else
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
                                    }
                                    else
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
                                    var sweep = gfx.SweepDirection.Counterclockwise;
                                    if (parseDouble() !== 0)
                                        sweep = gfx.SweepDirection.Clockwise;
                                    if ((cp2 = parsePoint()) == null)
                                        break;
                                    if (relative) {
                                        cp2.x += cp.x;
                                        cp2.y += cp.y;
                                    }
                                    console.warn("ellipticalArc not implemented");
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
                function parsePoint() {
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
                    return { x: x, y: y };
                }
                function parseDouble() {
                    advance();
                    var isNegative = false;
                    if (match('-')) {
                        isNegative = true;
                        index++;
                    }
                    else if (match('+')) {
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
                    var code;
                    var c;
                    while (index < len) {
                        code = str.charCodeAt(index);
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
                function match(matchStr) {
                    var c1;
                    var c2;
                    for (var i = 0; i < matchStr.length && (index + i) < len; i++) {
                        c1 = matchStr.charAt(i);
                        c2 = str.charAt(index + i);
                        if (c1 !== c2)
                            return false;
                    }
                    return true;
                }
                function morePointsAvailable() {
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
        })(matching = parse_1.matching || (parse_1.matching = {}));
    })(parse = gfx.parse || (gfx.parse = {}));
})(gfx || (gfx = {}));
var gfx;
(function (gfx) {
    (function (FillRule) {
        FillRule[FillRule["EvenOdd"] = 0] = "EvenOdd";
        FillRule[FillRule["NonZero"] = 1] = "NonZero";
    })(gfx.FillRule || (gfx.FillRule = {}));
    var FillRule = gfx.FillRule;
    (function (SweepDirection) {
        SweepDirection[SweepDirection["Counterclockwise"] = 0] = "Counterclockwise";
        SweepDirection[SweepDirection["Clockwise"] = 1] = "Clockwise";
    })(gfx.SweepDirection || (gfx.SweepDirection = {}));
    var SweepDirection = gfx.SweepDirection;
    (function (PenLineCap) {
        PenLineCap[PenLineCap["Flat"] = 0] = "Flat";
        PenLineCap[PenLineCap["Square"] = 1] = "Square";
        PenLineCap[PenLineCap["Round"] = 2] = "Round";
        PenLineCap[PenLineCap["Triangle"] = 3] = "Triangle";
    })(gfx.PenLineCap || (gfx.PenLineCap = {}));
    var PenLineCap = gfx.PenLineCap;
    (function (PenLineJoin) {
        PenLineJoin[PenLineJoin["Miter"] = 0] = "Miter";
        PenLineJoin[PenLineJoin["Bevel"] = 1] = "Bevel";
        PenLineJoin[PenLineJoin["Round"] = 2] = "Round";
    })(gfx.PenLineJoin || (gfx.PenLineJoin = {}));
    var PenLineJoin = gfx.PenLineJoin;
})(gfx || (gfx = {}));
var gfx;
(function (gfx) {
    (function (PathOpType) {
        PathOpType[PathOpType["closePath"] = 0] = "closePath";
        PathOpType[PathOpType["moveTo"] = 1] = "moveTo";
        PathOpType[PathOpType["lineTo"] = 2] = "lineTo";
        PathOpType[PathOpType["bezierCurveTo"] = 3] = "bezierCurveTo";
        PathOpType[PathOpType["quadraticCurveTo"] = 4] = "quadraticCurveTo";
        PathOpType[PathOpType["arc"] = 5] = "arc";
        PathOpType[PathOpType["arcTo"] = 6] = "arcTo";
        PathOpType[PathOpType["ellipse"] = 7] = "ellipse";
        PathOpType[PathOpType["rect"] = 8] = "rect";
    })(gfx.PathOpType || (gfx.PathOpType = {}));
    var PathOpType = gfx.PathOpType;
    var Path = (function () {
        function Path(arg0) {
            if (arg0 instanceof Path) {
                this.$ops = JSON.parse(JSON.stringify(this.$ops));
            }
            else if (typeof arg0 === "string") {
                this.$ops = [];
                Path.parse.call(this, arg0);
            }
            else {
                this.$ops = [];
            }
        }
        Path.prototype.addPath = function (path, transform) {
            console.warn("addPath", "Not implemented");
        };
        Path.prototype.closePath = function () {
            this.$ops.push({
                type: PathOpType.closePath,
                args: Array.prototype.slice.call(arguments, 0)
            });
        };
        Path.prototype.moveTo = function (x, y) {
            this.$ops.push({
                type: PathOpType.moveTo,
                args: Array.prototype.slice.call(arguments, 0)
            });
        };
        Path.prototype.lineTo = function (x, y) {
            this.$ops.push({
                type: PathOpType.lineTo,
                args: Array.prototype.slice.call(arguments, 0)
            });
        };
        Path.prototype.bezierCurveTo = function (cp1x, cp1y, cp2x, cp2y, x, y) {
            this.$ops.push({
                type: PathOpType.bezierCurveTo,
                args: Array.prototype.slice.call(arguments, 0)
            });
        };
        Path.prototype.quadraticCurveTo = function (cpx, cpy, x, y) {
            this.$ops.push({
                type: PathOpType.quadraticCurveTo,
                args: Array.prototype.slice.call(arguments, 0)
            });
        };
        Path.prototype.arc = function (x, y, radius, startAngle, endAngle, anticlockwise) {
            this.$ops.push({
                type: PathOpType.arc,
                args: Array.prototype.slice.call(arguments, 0),
                metrics: {}
            });
        };
        Path.prototype.arcTo = function (x1, y1, x2, y2, radius) {
            this.$ops.push({
                type: PathOpType.arcTo,
                args: Array.prototype.slice.call(arguments, 0),
                metrics: {}
            });
        };
        Path.prototype.ellipse = function (x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise) {
            this.$ops.push({
                type: PathOpType.ellipse,
                args: Array.prototype.slice.call(arguments, 0)
            });
        };
        Path.prototype.rect = function (x, y, width, height) {
            this.$ops.push({
                type: PathOpType.rect,
                args: Array.prototype.slice.call(arguments, 0)
            });
        };
        Path.prototype.draw = function (ctx) {
            for (var i = 0, ops = this.$ops, len = ops.length; i < len; i++) {
                var op = ops[i];
                var name_1 = PathOpType[op.type];
                var func = ctx[name_1];
                if (!func)
                    throw new Error("Invalid path operation type. [" + op.type + "]");
                func.apply(this, op.args);
            }
        };
        Path.parse = function (d) {
            var parser = gfx.parse.getParser();
            var _this = this;
            var inst = _this instanceof Path ? _this : new Path();
            return parser.parse(inst, d);
        };
        return Path;
    })();
    gfx.Path = Path;
})(gfx || (gfx = {}));

//# sourceMappingURL=gfx.js.map
