var curve;
(function (curve) {
    curve.version = '0.1.0';
})(curve || (curve = {}));
var curve;
(function (curve) {
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
})(curve || (curve = {}));
var curve;
(function (curve) {
    var proto = CanvasRenderingContext2D.prototype;
    if (!proto.setFillRule) {
        proto.setFillRule = function (arg) {
            this.fillRule = arg;
        };
    }
})(curve || (curve = {}));
(function (global) {
    if (typeof global.TextEncoder === "function")
        return;
    global.TextEncoder = (function () {
        function TextEncoder() {
            Object.defineProperties(this, {
                "encoding": { value: "utf-8", writable: false }
            });
        }
        TextEncoder.prototype.encode = function (str) {
            var buf = new ArrayBuffer(str.length);
            var arr = new Uint8Array(buf);
            for (var i = 0; i < arr.length; i++) {
                arr[i] = str.charCodeAt(i);
            }
            return arr;
        };
        return TextEncoder;
    })();
})(this);
var curve;
(function (curve) {
    var bounds;
    (function (bounds) {
        var extenders;
        (function (extenders) {
            var vec2 = la.vec2;
            var Arc = (function () {
                function Arc() {
                    this.isMove = false;
                }
                Arc.prototype.init = function (sx, sy, args) {
                    var x = args[0];
                    var y = args[1];
                    var radius = args[2];
                    var sa = args[3];
                    var ea = args[4];
                    var cc = args[5];
                    sx = x + (radius * Math.cos(sa));
                    sy = y + (radius * Math.sin(sa));
                    var ex = x + (radius * Math.cos(ea));
                    var ey = y + (radius * Math.sin(ea));
                    var l = x - radius;
                    var cl = arcContainsPoint(sx, sy, ex, ey, l, y, cc);
                    var r = x + radius;
                    var cr = arcContainsPoint(sx, sy, ex, ey, r, y, cc);
                    var t = y - radius;
                    var ct = arcContainsPoint(sx, sy, ex, ey, x, t, cc);
                    var b = y + radius;
                    var cb = arcContainsPoint(sx, sy, ex, ey, x, b, cc);
                    return {
                        sx: sx,
                        sy: sy,
                        l: l,
                        cl: cl,
                        r: r,
                        cr: cr,
                        t: t,
                        ct: ct,
                        b: b,
                        cb: cb,
                        endPoint: vec2.create(ex, ey),
                        startVector: getStartVector(x, y, cc, sx, sy),
                        endVector: getEndVector(x, y, cc, ex, ey)
                    };
                };
                Arc.prototype.extendFillBox = function (box, sx, sy, args, metrics) {
                    var sa = args[3];
                    var ea = args[4];
                    if (ea === sa)
                        return;
                    var ep = metrics.endPoint, ex = ep[0], ey = ep[1];
                    box.l = Math.min(box.l, sx, ex);
                    box.r = Math.max(box.r, sx, ex);
                    box.t = Math.min(box.t, sy, ey);
                    box.b = Math.max(box.b, sy, ey);
                    if (metrics.cl)
                        box.l = Math.min(box.l, metrics.l);
                    if (metrics.cr)
                        box.r = Math.max(box.r, metrics.r);
                    if (metrics.ct)
                        box.t = Math.min(box.t, metrics.t);
                    if (metrics.cb)
                        box.b = Math.max(box.b, metrics.b);
                };
                Arc.prototype.extendStrokeBox = function (box, sx, sy, args, metrics, pars) {
                    var sa = args[3];
                    var ea = args[4];
                    if (ea === sa)
                        return;
                    var ep = metrics.endPoint, ex = ep[0], ey = ep[1];
                    box.l = Math.min(box.l, sx, ex);
                    box.r = Math.max(box.r, sx, ex);
                    box.t = Math.min(box.t, sy, ey);
                    box.b = Math.max(box.b, sy, ey);
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
                    var sv = vec2.reverse(vec2.clone(metrics.startVector));
                    var ss = getCapSpread(sx, sy, pars.strokeThickness, cap, sv);
                    var es = getCapSpread(ex, ey, pars.strokeThickness, cap, metrics.endVector);
                    box.l = Math.min(box.l, ss.x1, ss.x2, es.x1, es.x2);
                    box.r = Math.max(box.r, ss.x1, ss.x2, es.x1, es.x2);
                    box.t = Math.min(box.t, ss.y1, ss.y2, es.y1, es.y2);
                    box.b = Math.max(box.b, ss.y1, ss.y2, es.y1, es.y2);
                };
                return Arc;
            })();
            extenders.Arc = Arc;
            function getStartVector(x, y, cc, sx, sy) {
                var rx = sx - x, ry = sy - y;
                if (cc)
                    return vec2.create(ry, -rx);
                return vec2.create(-ry, rx);
            }
            function getEndVector(x, y, cc, ex, ey) {
                var rx = ex - x, ry = ey - y;
                if (cc)
                    return vec2.create(ry, -rx);
                return vec2.create(-ry, rx);
            }
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
                    case curve.PenLineCap.Round:
                        return {
                            x1: x - hs,
                            x2: x + hs,
                            y1: y - hs,
                            y2: y + hs
                        };
                        break;
                    case curve.PenLineCap.Square:
                        var ed = vec2.normalize(vec2.clone(vector));
                        var edo = vec2.orthogonal(vec2.clone(ed));
                        return {
                            x1: x + hs * (ed[0] + edo[0]),
                            x2: x + hs * (ed[0] - edo[0]),
                            y1: y + hs * (ed[1] + edo[1]),
                            y2: y + hs * (ed[1] - edo[1])
                        };
                        break;
                    case curve.PenLineCap.Flat:
                    default:
                        var edo = vec2.orthogonal(vec2.normalize(vec2.clone(vector)));
                        return {
                            x1: x + hs * edo[0],
                            x2: x + hs * -edo[0],
                            y1: y + hs * edo[1],
                            y2: y + hs * -edo[1]
                        };
                        break;
                }
            }
        })(extenders = bounds.extenders || (bounds.extenders = {}));
    })(bounds = curve.bounds || (curve.bounds = {}));
})(curve || (curve = {}));
var curve;
(function (curve) {
    var bounds;
    (function (bounds) {
        var extenders;
        (function (extenders) {
            var vec2 = la.vec2;
            var LineTo = (function () {
                function LineTo() {
                    this.isMove = false;
                }
                LineTo.prototype.init = function (sx, sy, args) {
                    var x = args[0];
                    var y = args[1];
                    return {
                        startVector: vec2.create(x - sx, y - sy),
                        endVector: vec2.create(x - sx, y - sy),
                        endPoint: vec2.create(x, y)
                    };
                };
                LineTo.prototype.extendFillBox = function (box, sx, sy, args, metrics) {
                    var x = args[0];
                    var y = args[1];
                    box.l = Math.min(box.l, x);
                    box.r = Math.max(box.r, x);
                    box.t = Math.min(box.t, y);
                    box.b = Math.max(box.b, y);
                };
                LineTo.prototype.extendStrokeBox = function (box, sx, sy, args, metrics, pars) {
                    this.extendFillBox(box, sx, sy, args, metrics);
                };
                return LineTo;
            })();
            extenders.LineTo = LineTo;
        })(extenders = bounds.extenders || (bounds.extenders = {}));
    })(bounds = curve.bounds || (curve.bounds = {}));
})(curve || (curve = {}));
var curve;
(function (curve) {
    var bounds;
    (function (bounds) {
        var extenders;
        (function (extenders) {
            var vec2 = la.vec2;
            var _arc = new extenders.Arc();
            var _lineTo = new extenders.LineTo();
            var ArcTo = (function () {
                function ArcTo() {
                    this.isMove = false;
                }
                ArcTo.prototype.init = function (sx, sy, args) {
                    var x1 = args[0];
                    var y1 = args[1];
                    var x2 = args[2];
                    var y2 = args[3];
                    var radius = args[4];
                    var v1 = vec2.create(x1 - sx, y1 - sy);
                    var v2 = vec2.create(x2 - x1, y2 - y1);
                    var inner_theta = Math.PI - vec2.angleBetween(v1, v2);
                    var a = getTangentPoint(inner_theta, radius, vec2.create(sx, sy), v1, true);
                    var b = getTangentPoint(inner_theta, radius, vec2.create(x1, y1), v2, false);
                    var line = createLine(sx, sy, a[0], a[1]);
                    var arc = createArc(a, v1, b, v2, radius);
                    return {
                        line: line,
                        arc: arc,
                        startVector: line.metrics.startVector,
                        endVector: arc.metrics.endVector,
                        endPoint: arc.metrics.endPoint
                    };
                };
                ArcTo.prototype.extendFillBox = function (box, sx, sy, args, metrics) {
                    _lineTo.extendFillBox(box, sx, sy, metrics.line.args, metrics.line.metrics);
                    var ep = metrics.line.metrics.endPoint;
                    _arc.extendFillBox(box, ep[0], ep[1], metrics.arc.args, metrics.arc.metrics);
                };
                ArcTo.prototype.extendStrokeBox = function (box, sx, sy, args, metrics, pars) {
                    _lineTo.extendStrokeBox(box, sx, sy, metrics.line.args, metrics.line.metrics, pars);
                    var ep = metrics.line.metrics.endPoint;
                    _arc.extendStrokeBox(box, ep[0], ep[1], metrics.arc.args, metrics.arc.metrics, pars);
                };
                return ArcTo;
            })();
            extenders.ArcTo = ArcTo;
            function createLine(sx, sy, x, y) {
                var args = [x, y];
                return {
                    args: args,
                    metrics: _lineTo.init(sx, sy, args)
                };
            }
            function createArc(a, v1, b, v2, radius) {
                var c = getPerpendicularIntersections(a, v1, b, v2);
                var cc = !la.vec2.isClockwiseTo(v1, v2);
                var sa = Math.atan2(a[1] - c[1], a[0] - c[0]);
                if (sa < 0)
                    sa = (2 * Math.PI) + sa;
                var ea = Math.atan2(b[1] - c[1], b[0] - c[0]);
                if (ea < 0)
                    ea = (2 * Math.PI) + ea;
                var args = [c[0], c[1], radius, sa, ea, cc];
                return {
                    args: args,
                    metrics: _arc.init(a[0], a[1], args)
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
                var p1 = vec2.orthogonal(vec2.clone(d1));
                var p2 = vec2.orthogonal(vec2.clone(d2));
                return vec2.intersection(s1, p1, s2, p2);
            }
        })(extenders = bounds.extenders || (bounds.extenders = {}));
    })(bounds = curve.bounds || (curve.bounds = {}));
})(curve || (curve = {}));
var curve;
(function (curve) {
    var bounds;
    (function (bounds) {
        var extenders;
        (function (extenders) {
            var vec2 = la.vec2;
            var BezierCurveTo = (function () {
                function BezierCurveTo() {
                    this.isMove = false;
                }
                BezierCurveTo.prototype.init = function (sx, sy, args) {
                    var cp1x = args[0];
                    var cp1y = args[1];
                    var cp2x = args[2];
                    var cp2y = args[3];
                    var x = args[4];
                    var y = args[5];
                    return {
                        endPoint: vec2.create(x, y),
                        startVector: vec2.create(3 * (cp1x - sx), 3 * (cp1y - sy)),
                        endVector: vec2.create(3 * (x - cp2x), 3 * (y - cp2y))
                    };
                };
                BezierCurveTo.prototype.extendFillBox = function (box, sx, sy, args, metrics) {
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
                BezierCurveTo.prototype.extendStrokeBox = function (box, sx, sy, args, metrics, pars) {
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
                return BezierCurveTo;
            })();
            extenders.BezierCurveTo = BezierCurveTo;
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
        })(extenders = bounds.extenders || (bounds.extenders = {}));
    })(bounds = curve.bounds || (curve.bounds = {}));
})(curve || (curve = {}));
var curve;
(function (curve) {
    var bounds;
    (function (bounds) {
        var extenders;
        (function (extenders) {
            var ClosePath = (function () {
                function ClosePath() {
                    this.isMove = false;
                }
                ClosePath.prototype.init = function () {
                    return {
                        endPoint: undefined,
                        startVector: undefined,
                        endVector: undefined
                    };
                };
                ClosePath.prototype.extendFillBox = function (box, sx, sy, args, metrics) {
                };
                ClosePath.prototype.extendStrokeBox = function (box, sx, sy, args, metrics, pars) {
                };
                return ClosePath;
            })();
            extenders.ClosePath = ClosePath;
        })(extenders = bounds.extenders || (bounds.extenders = {}));
    })(bounds = curve.bounds || (curve.bounds = {}));
})(curve || (curve = {}));
var curve;
(function (curve) {
    var bounds;
    (function (bounds) {
        var extenders;
        (function (extenders) {
            var Ellipse = (function () {
                function Ellipse() {
                    this.isMove = false;
                }
                Ellipse.prototype.init = function (sx, sy, args) {
                    return undefined;
                };
                Ellipse.prototype.extendFillBox = function (box, sx, sy, args, metrics) {
                };
                Ellipse.prototype.extendStrokeBox = function (box, sx, sy, args, metrics, pars) {
                };
                return Ellipse;
            })();
            extenders.Ellipse = Ellipse;
        })(extenders = bounds.extenders || (bounds.extenders = {}));
    })(bounds = curve.bounds || (curve.bounds = {}));
})(curve || (curve = {}));
var curve;
(function (curve) {
    var bounds;
    (function (bounds) {
        var extenders;
        (function (extenders) {
            var vec2 = la.vec2;
            var MoveTo = (function () {
                function MoveTo() {
                    this.isMove = true;
                }
                MoveTo.prototype.init = function (sx, sy, args) {
                    var x = args[0];
                    var y = args[1];
                    return {
                        startVector: null,
                        endVector: null,
                        endPoint: vec2.create(x, y)
                    };
                };
                MoveTo.prototype.extendFillBox = function (box, sx, sy, args, metrics) {
                    var x = args[0];
                    var y = args[1];
                    box.l = Math.min(box.l, x);
                    box.r = Math.max(box.r, x);
                    box.t = Math.min(box.t, y);
                    box.b = Math.max(box.b, y);
                };
                MoveTo.prototype.extendStrokeBox = function (box, sx, sy, args, metrics, pars) {
                    this.extendFillBox(box, sx, sy, args, metrics);
                };
                return MoveTo;
            })();
            extenders.MoveTo = MoveTo;
        })(extenders = bounds.extenders || (bounds.extenders = {}));
    })(bounds = curve.bounds || (curve.bounds = {}));
})(curve || (curve = {}));
var curve;
(function (curve) {
    var bounds;
    (function (bounds) {
        var extenders;
        (function (extenders) {
            var vec2 = la.vec2;
            var QuadraticCurveTo = (function () {
                function QuadraticCurveTo() {
                    this.isMove = false;
                }
                QuadraticCurveTo.prototype.init = function (sx, sy, args) {
                    var cpx = args[0];
                    var cpy = args[1];
                    var x = args[2];
                    var y = args[3];
                    return {
                        endPoint: vec2.create(x, y),
                        startVector: vec2.create(2 * (cpx - sx), 2 * (cpy - sy)),
                        endVector: vec2.create(2 * (x - cpx), 2 * (y - cpy))
                    };
                };
                QuadraticCurveTo.prototype.extendFillBox = function (box, sx, sy, args, metrics) {
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
                QuadraticCurveTo.prototype.extendStrokeBox = function (box, sx, sy, args, metrics, pars) {
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
                return QuadraticCurveTo;
            })();
            extenders.QuadraticCurveTo = QuadraticCurveTo;
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
        })(extenders = bounds.extenders || (bounds.extenders = {}));
    })(bounds = curve.bounds || (curve.bounds = {}));
})(curve || (curve = {}));
var curve;
(function (curve) {
    var bounds;
    (function (bounds) {
        var arc = new bounds.extenders.Arc();
        var arcTo = new bounds.extenders.ArcTo();
        var bezierCurveTo = new bounds.extenders.BezierCurveTo();
        var closePath = new bounds.extenders.ClosePath();
        var ellipse = new bounds.extenders.Ellipse();
        var lineTo = new bounds.extenders.LineTo();
        var moveTo = new bounds.extenders.MoveTo();
        var quadraticCurveTo = new bounds.extenders.QuadraticCurveTo();
        var ExtenderSelector = (function () {
            function ExtenderSelector() {
            }
            ExtenderSelector.prototype.setFillRule = function (fillRule) {
            };
            ExtenderSelector.prototype.closePath = function () {
                this.current = closePath;
                this.args = arguments;
            };
            ExtenderSelector.prototype.moveTo = function (x, y) {
                this.current = moveTo;
                this.args = arguments;
            };
            ExtenderSelector.prototype.lineTo = function (x, y) {
                this.current = lineTo;
                this.args = arguments;
            };
            ExtenderSelector.prototype.bezierCurveTo = function (cp1x, cp1y, cp2x, cp2y, x, y) {
                this.current = bezierCurveTo;
                this.args = arguments;
            };
            ExtenderSelector.prototype.quadraticCurveTo = function (cpx, cpy, x, y) {
                this.current = quadraticCurveTo;
                this.args = arguments;
            };
            ExtenderSelector.prototype.arc = function (x, y, radius, startAngle, endAngle, anticlockwise) {
                this.current = arc;
                this.args = arguments;
            };
            ExtenderSelector.prototype.arcTo = function (x1, y1, x2, y2, radius) {
                this.current = arcTo;
                this.args = arguments;
            };
            ExtenderSelector.prototype.ellipse = function (x, y, radiusX, radiusY, rotation, startAngle, endAngle, antiClockwise) {
                this.current = ellipse;
                this.args = arguments;
            };
            return ExtenderSelector;
        })();
        bounds.ExtenderSelector = ExtenderSelector;
    })(bounds = curve.bounds || (curve.bounds = {}));
})(curve || (curve = {}));
var curve;
(function (curve) {
    var compiler;
    (function (compiler_1) {
        function compile(arg0) {
            var compiler = PathCompiler.instance;
            compiler.compiled.length = 0;
            if (typeof arg0 === "string") {
                var parser = curve.parse.getParser();
                parser.parse(compiler, arg0);
            }
            else if (typeof arg0.exec === "function") {
                arg0.exec(compiler);
            }
            return compiler.compiled;
        }
        compiler_1.compile = compile;
        var PathCompiler = (function () {
            function PathCompiler() {
                this.compiled = [];
            }
            PathCompiler.prototype.setFillRule = function (fillRule) {
                this.compiled.push({ t: CompiledOpType.setFillRule, a: [fillRule] });
            };
            PathCompiler.prototype.closePath = function () {
                this.compiled.push({ t: CompiledOpType.closePath, a: [] });
            };
            PathCompiler.prototype.moveTo = function (x, y) {
                this.compiled.push({ t: CompiledOpType.moveTo, a: [x, y] });
            };
            PathCompiler.prototype.lineTo = function (x, y) {
                this.compiled.push({ t: CompiledOpType.lineTo, a: [x, y] });
            };
            PathCompiler.prototype.bezierCurveTo = function (cp1x, cp1y, cp2x, cp2y, x, y) {
                this.compiled.push({ t: CompiledOpType.bezierCurveTo, a: [cp1x, cp1y, cp2x, cp2y, x, y] });
            };
            PathCompiler.prototype.quadraticCurveTo = function (cpx, cpy, x, y) {
                this.compiled.push({ t: CompiledOpType.quadraticCurveTo, a: [cpx, cpy, x, y] });
            };
            PathCompiler.prototype.arc = function (x, y, radius, startAngle, endAngle, anticlockwise) {
                this.compiled.push({ t: CompiledOpType.arc, a: [x, y, radius, startAngle, endAngle, anticlockwise] });
            };
            PathCompiler.prototype.arcTo = function (x1, y1, x2, y2, radius) {
                this.compiled.push({ t: CompiledOpType.arcTo, a: [x1, y1, x2, y2, radius] });
            };
            PathCompiler.prototype.ellipse = function (x, y, radiusX, radiusY, rotation, startAngle, endAngle, antiClockwise) {
                this.compiled.push({
                    t: CompiledOpType.ellipse,
                    a: [x, y, radiusX, radiusY, rotation, startAngle, endAngle, antiClockwise]
                });
            };
            PathCompiler.instance = new PathCompiler();
            return PathCompiler;
        })();
    })(compiler = curve.compiler || (curve.compiler = {}));
})(curve || (curve = {}));
var curve;
(function (curve) {
    var compiler;
    (function (compiler) {
        function decompile(runner, compiled) {
            for (var i = 0; !!compiled && i < compiled.length; i++) {
                var seg = compiled[i];
                var typeStr = void 0;
                if (typeof seg.t !== "number" || !(typeStr = CompiledOpType[seg.t])) {
                    console.warn("Unknown compiled path command: " + seg.t + ", " + seg.a);
                    continue;
                }
                var func = runner[typeStr];
                func && func.apply(runner, seg.a);
            }
        }
        compiler.decompile = decompile;
    })(compiler = curve.compiler || (curve.compiler = {}));
})(curve || (curve = {}));
var CompiledOpType;
(function (CompiledOpType) {
    CompiledOpType[CompiledOpType["setFillRule"] = 1] = "setFillRule";
    CompiledOpType[CompiledOpType["closePath"] = 2] = "closePath";
    CompiledOpType[CompiledOpType["moveTo"] = 3] = "moveTo";
    CompiledOpType[CompiledOpType["lineTo"] = 4] = "lineTo";
    CompiledOpType[CompiledOpType["bezierCurveTo"] = 5] = "bezierCurveTo";
    CompiledOpType[CompiledOpType["quadraticCurveTo"] = 6] = "quadraticCurveTo";
    CompiledOpType[CompiledOpType["arc"] = 7] = "arc";
    CompiledOpType[CompiledOpType["arcTo"] = 8] = "arcTo";
    CompiledOpType[CompiledOpType["ellipse"] = 9] = "ellipse";
})(CompiledOpType || (CompiledOpType = {}));
var curve;
(function (curve) {
    var ellipticalArc;
    (function (ellipticalArc) {
        var vec2 = la.vec2;
        var PI2 = 2 * Math.PI;
        function genEllipse(runner, x1, y1, x2, y2, fa, fs, rx, ry, phi) {
            if (rx === 0 || ry === 0) {
                runner.lineTo(x2, y2);
                return;
            }
            var ap = vec2.midpoint(vec2.create(x1, y1), vec2.create(x2, y2));
            vec2.rotate(ap, -phi);
            var rx2 = rx * rx;
            var ry2 = ry * ry;
            var apx2 = ap[0] * ap[0];
            var apy2 = ap[1] * ap[1];
            var factor = Math.sqrt(((rx2 * ry2) - (rx2 * apy2) - (ry2 * apx2)) / ((rx2 * apy2) + (ry2 * apx2)));
            if (fa === fs) {
                factor *= -1;
            }
            var cp = vec2.create(rx * ap[1] / ry, -ry * ap[0] / rx);
            cp[0] *= factor;
            cp[1] *= factor;
            var c = vec2.rotate(vec2.clone(cp), phi);
            c[0] += (x1 + x2) / 2.0;
            c[1] += (y1 + y2) / 2.0;
            var u = vec2.create((ap[0] - cp[0]) / rx, (ap[1] - cp[1]) / ry);
            var v = vec2.create((-ap[0] - cp[0]) / rx, (-ap[1] - cp[1]) / ry);
            var sa = vec2.angleBetween(vec2.create(1, 0), u);
            var dt = vec2.angleBetween(u, v) % PI2;
            if (fs === 0 && dt > 0) {
                dt -= PI2;
            }
            else if (fs === 1 && dt < 0) {
                dt += PI2;
            }
            runner.ellipse(c[0], c[1], rx, ry, phi, sa, sa + dt, (1 - fs) === 1);
        }
        ellipticalArc.genEllipse = genEllipse;
    })(ellipticalArc = curve.ellipticalArc || (curve.ellipticalArc = {}));
})(curve || (curve = {}));
var curve;
(function (curve) {
    var parse;
    (function (parse) {
        (function (ParseStyles) {
            ParseStyles[ParseStyles["Dom"] = 1] = "Dom";
            ParseStyles[ParseStyles["Buffer"] = 2] = "Buffer";
            ParseStyles[ParseStyles["CharMatching"] = 3] = "CharMatching";
        })(parse.ParseStyles || (parse.ParseStyles = {}));
        var ParseStyles = parse.ParseStyles;
    })(parse = curve.parse || (curve.parse = {}));
})(curve || (curve = {}));
var curve;
(function (curve) {
    var parse;
    (function (parse) {
        parse.style = parse.ParseStyles.CharMatching;
        function getParser() {
            if (parse.style === parse.ParseStyles.Buffer)
                return new parse.buffer.Parser();
            else if (parse.style === parse.ParseStyles.Dom)
                return new parse.dom.Parser();
            return new parse.matching.Parser();
        }
        parse.getParser = getParser;
    })(parse = curve.parse || (curve.parse = {}));
})(curve || (curve = {}));
var curve;
(function (curve) {
    var bounds;
    (function (bounds) {
        var fill;
        (function (fill) {
            var FillBounds = (function () {
                function FillBounds(path) {
                    this.l = 0;
                    this.t = 0;
                    this.r = 0;
                    this.b = 0;
                    this.$calc = false;
                    Object.defineProperties(this, {
                        "path": { value: path, writable: false }
                    });
                }
                FillBounds.prototype.ensure = function () {
                    if (!this.$calc)
                        this.calculate();
                    return this;
                };
                FillBounds.prototype.calculate = function () {
                    var _this = this;
                    this.$calc = false;
                    this.l = Number.POSITIVE_INFINITY;
                    this.t = Number.POSITIVE_INFINITY;
                    this.r = Number.NEGATIVE_INFINITY;
                    this.b = Number.NEGATIVE_INFINITY;
                    var sx, sy;
                    var selector = new bounds.ExtenderSelector();
                    this.path.exec(selector, function () {
                        var cur = selector.current;
                        var metrics = cur.init(sx, sy, selector.args);
                        cur.extendFillBox(_this, sx, sy, selector.args, metrics);
                        sx = metrics.endPoint[0];
                        sy = metrics.endPoint[1];
                    });
                    this.$calc = true;
                    return this;
                };
                return FillBounds;
            })();
            fill.FillBounds = FillBounds;
        })(fill = bounds.fill || (bounds.fill = {}));
    })(bounds = curve.bounds || (curve.bounds = {}));
})(curve || (curve = {}));
var curve;
(function (curve) {
    (function (PenLineCap) {
        PenLineCap[PenLineCap["Flat"] = 0] = "Flat";
        PenLineCap[PenLineCap["Square"] = 1] = "Square";
        PenLineCap[PenLineCap["Round"] = 2] = "Round";
        PenLineCap[PenLineCap["Triangle"] = 3] = "Triangle";
    })(curve.PenLineCap || (curve.PenLineCap = {}));
    var PenLineCap = curve.PenLineCap;
    (function (PenLineJoin) {
        PenLineJoin[PenLineJoin["Miter"] = 0] = "Miter";
        PenLineJoin[PenLineJoin["Bevel"] = 1] = "Bevel";
        PenLineJoin[PenLineJoin["Round"] = 2] = "Round";
    })(curve.PenLineJoin || (curve.PenLineJoin = {}));
    var PenLineJoin = curve.PenLineJoin;
})(curve || (curve = {}));
var curve;
(function (curve) {
    var bounds;
    (function (bounds) {
        var stroke;
        (function (stroke) {
            var vec2 = la.vec2;
            function extendEndCap(box, metrics, pars) {
                var cap = pars.strokeStartLineCap || pars.strokeEndLineCap || 0;
                var func = cappers[cap] || cappers[curve.PenLineCap.Flat];
                func(box, metrics, pars.strokeThickness);
            }
            stroke.extendEndCap = extendEndCap;
            var cappers = [];
            cappers[curve.PenLineCap.Round] = function (box, metrics, thickness) {
                var _a = metrics.endPoint, ex = _a[0], ey = _a[1];
                var hs = thickness / 2.0;
                box.l = Math.min(box.l, ex - hs);
                box.r = Math.max(box.r, ex + hs);
                box.t = Math.min(box.t, ey - hs);
                box.b = Math.max(box.b, ey + hs);
            };
            cappers[curve.PenLineCap.Square] = function (box, metrics, thickness) {
                var ed = vec2.clone(metrics.endVector);
                if (!ed || !ed[0] || !ed[1])
                    return;
                vec2.normalize(ed);
                var edo = vec2.orthogonal(vec2.clone(ed));
                var _a = metrics.endPoint, ex = _a[0], ey = _a[1];
                var hs = thickness / 2.0;
                var x1 = ex + hs * (ed[0] + edo[0]);
                var x2 = ex + hs * (ed[0] - edo[0]);
                var y1 = ey + hs * (ed[1] + edo[1]);
                var y2 = ey + hs * (ed[1] - edo[1]);
                box.l = Math.min(box.l, x1, x2);
                box.r = Math.max(box.r, x1, x2);
                box.t = Math.min(box.t, y1, y2);
                box.b = Math.max(box.b, y1, y2);
            };
            cappers[curve.PenLineCap.Flat] = function (box, metrics, thickness) {
                var edo = vec2.clone(metrics.endVector);
                if (!edo || !edo[0] || !edo[1])
                    return;
                vec2.orthogonal(vec2.normalize(edo));
                var _a = metrics.endPoint, ex = _a[0], ey = _a[1];
                var hs = thickness / 2.0;
                var x1 = ex + hs * edo[0];
                var x2 = ex + hs * -edo[0];
                var y1 = ey + hs * edo[1];
                var y2 = ey + hs * -edo[1];
                box.l = Math.min(box.l, x1, x2);
                box.r = Math.max(box.r, x1, x2);
                box.t = Math.min(box.t, y1, y2);
                box.b = Math.max(box.b, y1, y2);
            };
        })(stroke = bounds.stroke || (bounds.stroke = {}));
    })(bounds = curve.bounds || (curve.bounds = {}));
})(curve || (curve = {}));
var curve;
(function (curve) {
    var bounds;
    (function (bounds) {
        var stroke;
        (function (stroke) {
            var vec2 = la.vec2;
            function extendLineJoin(box, sx, sy, metrics, lastMetrics, pars) {
                var hs = pars.strokeThickness / 2.0;
                if (pars.strokeLineJoin === curve.PenLineJoin.Round) {
                    box.l = Math.min(box.l, sx - hs);
                    box.r = Math.max(box.r, sx + hs);
                    box.t = Math.min(box.t, sy - hs);
                    box.b = Math.max(box.b, sy + hs);
                    return;
                }
                var tips = (pars.strokeLineJoin === curve.PenLineJoin.Miter)
                    ? findMiterTips(sx, sy, metrics, lastMetrics, hs, pars.strokeMiterLimit)
                    : findBevelTips(sx, sy, metrics, lastMetrics, hs);
                if (!tips)
                    return;
                var x1 = tips[0][0], y1 = tips[0][1], x2 = tips[1][0], y2 = tips[1][1];
                box.l = Math.min(box.l, x1, x2);
                box.r = Math.max(box.r, x1, x2);
                box.t = Math.min(box.t, y1, y2);
                box.b = Math.max(box.b, y1, y2);
            }
            stroke.extendLineJoin = extendLineJoin;
            function findMiterTips(sx, sy, metrics, lastMetrics, hs, miterLimit) {
                var av = vec2.clone(lastMetrics.endVector);
                var bv = vec2.clone(metrics.startVector);
                if (!av || !bv)
                    return null;
                vec2.reverse(av);
                var tau = vec2.angleBetween(av, bv) / 2;
                if (isNaN(tau))
                    return null;
                var miterRatio = 1 / Math.sin(tau);
                if (miterRatio > miterLimit)
                    return findBevelTips(sx, sy, metrics, lastMetrics, hs);
                var cv = vec2.isClockwiseTo(av, bv) ? vec2.clone(av) : vec2.clone(bv);
                vec2.normalize(vec2.reverse(vec2.rotate(cv, tau)));
                var miterLen = hs * miterRatio;
                var tip = vec2.create(sx + miterLen * cv[0], sy + miterLen * cv[1]);
                return [tip, tip];
            }
            function findBevelTips(sx, sy, metrics, lastMetrics, hs) {
                var av = vec2.clone(lastMetrics.endVector);
                var bv = vec2.clone(metrics.startVector);
                if (!av || !bv)
                    return;
                vec2.normalize(vec2.reverse(av));
                vec2.normalize(bv);
                var avo = vec2.clone(av), bvo = vec2.clone(bv);
                if (vec2.isClockwiseTo(av, bv)) {
                    avo = vec2.orthogonal(av);
                    bvo = vec2.reverse(vec2.orthogonal(bv));
                }
                else {
                    avo = vec2.reverse(vec2.orthogonal(av));
                    bvo = vec2.orthogonal(bv);
                }
                return [
                    vec2.create(sx - hs * avo[0], sy - hs * avo[1]),
                    vec2.create(sx - hs * bvo[0], sy - hs * bvo[1])
                ];
            }
        })(stroke = bounds.stroke || (bounds.stroke = {}));
    })(bounds = curve.bounds || (curve.bounds = {}));
})(curve || (curve = {}));
var curve;
(function (curve) {
    var bounds;
    (function (bounds) {
        var stroke;
        (function (stroke) {
            var vec2 = la.vec2;
            function extendStartCap(box, sx, sy, metrics, pars) {
                var cap = pars.strokeStartLineCap || pars.strokeEndLineCap || 0;
                var func = cappers[cap] || cappers[curve.PenLineCap.Flat];
                func(box, sx, sy, metrics, pars.strokeThickness);
            }
            stroke.extendStartCap = extendStartCap;
            var cappers = [];
            cappers[curve.PenLineCap.Round] = function (box, sx, sy, metrics, thickness) {
                var hs = thickness / 2.0;
                box.l = Math.min(box.l, sx - hs);
                box.r = Math.max(box.r, sx + hs);
                box.t = Math.min(box.t, sy - hs);
                box.b = Math.max(box.b, sy + hs);
            };
            cappers[curve.PenLineCap.Square] = function (box, sx, sy, metrics, thickness) {
                var sd = vec2.clone(metrics.startVector);
                if (!sd || !sd[0] || !sd[1])
                    return;
                vec2.reverse(vec2.normalize(sd));
                var sdo = vec2.orthogonal(vec2.clone(sd));
                var hs = thickness / 2.0;
                var x1 = sx + hs * (sd[0] + sdo[0]);
                var x2 = sx + hs * (sd[0] - sdo[0]);
                var y1 = sy + hs * (sd[1] + sdo[1]);
                var y2 = sy + hs * (sd[1] - sdo[1]);
                box.l = Math.min(box.l, x1, x2);
                box.r = Math.max(box.r, x1, x2);
                box.t = Math.min(box.t, y1, y2);
                box.b = Math.max(box.b, y1, y2);
            };
            cappers[curve.PenLineCap.Flat] = function (box, sx, sy, metrics, thickness) {
                var sdo = vec2.clone(metrics.startVector);
                if (!sdo || !sdo[0] || !sdo[1])
                    return;
                vec2.orthogonal(vec2.normalize(sdo));
                var hs = thickness / 2.0;
                var x1 = sx + hs * sdo[0];
                var x2 = sx + hs * -sdo[0];
                var y1 = sy + hs * sdo[1];
                var y2 = sy + hs * -sdo[1];
                box.l = Math.min(box.l, x1, x2);
                box.r = Math.max(box.r, x1, x2);
                box.t = Math.min(box.t, y1, y2);
                box.b = Math.max(box.b, y1, y2);
            };
        })(stroke = bounds.stroke || (bounds.stroke = {}));
    })(bounds = curve.bounds || (curve.bounds = {}));
})(curve || (curve = {}));
var curve;
(function (curve) {
    var bounds;
    (function (bounds) {
        var stroke;
        (function (stroke) {
            var StartCapExtender = (function () {
                function StartCapExtender() {
                }
                StartCapExtender.prototype.extend = function () {
                };
                return StartCapExtender;
            })();
            stroke.StartCapExtender = StartCapExtender;
        })(stroke = bounds.stroke || (bounds.stroke = {}));
    })(bounds = curve.bounds || (curve.bounds = {}));
})(curve || (curve = {}));
var curve;
(function (curve) {
    var bounds;
    (function (bounds) {
        var stroke;
        (function (stroke) {
            var StrokeBounds = (function () {
                function StrokeBounds(path) {
                    this.l = 0;
                    this.t = 0;
                    this.r = 0;
                    this.b = 0;
                    this.$calc = false;
                    Object.defineProperties(this, {
                        "path": { value: path, writable: false }
                    });
                }
                StrokeBounds.prototype.ensure = function () {
                    if (!this.$calc)
                        this.calculate();
                    return this;
                };
                StrokeBounds.prototype.calculate = function () {
                    var _this = this;
                    this.$calc = false;
                    this.l = Number.POSITIVE_INFINITY;
                    this.t = Number.POSITIVE_INFINITY;
                    this.r = Number.NEGATIVE_INFINITY;
                    this.b = Number.NEGATIVE_INFINITY;
                    var sx, sy, last, lastMetrics;
                    var selector = new bounds.ExtenderSelector();
                    this.path.exec(selector, function () {
                        var cur = selector.current;
                        var metrics = cur.init(sx, sy, selector.args);
                        if (!cur.isMove && last.isMove) {
                            stroke.extendStartCap(_this, sx, sy, metrics, _this.pars);
                        }
                        else if (lastMetrics) {
                            stroke.extendLineJoin(_this, sx, sy, metrics, lastMetrics, _this.pars);
                        }
                        cur.extendStrokeBox(_this, sx, sy, selector.args, metrics, _this.pars);
                        sx = metrics.endPoint[0];
                        sy = metrics.endPoint[1];
                        last = cur;
                        lastMetrics = metrics;
                    });
                    if (lastMetrics)
                        stroke.extendEndCap(this, lastMetrics, this.pars);
                    this.$calc = true;
                    return this;
                };
                return StrokeBounds;
            })();
            stroke.StrokeBounds = StrokeBounds;
        })(stroke = bounds.stroke || (bounds.stroke = {}));
    })(bounds = curve.bounds || (curve.bounds = {}));
})(curve || (curve = {}));
var curve;
(function (curve) {
    var parse;
    (function (parse) {
        var buffer;
        (function (buffer_1) {
            var Parser = (function () {
                function Parser() {
                }
                Parser.prototype.parse = function (runner, data) {
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
    })(parse = curve.parse || (curve.parse = {}));
})(curve || (curve = {}));
var curve;
(function (curve) {
    var parse;
    (function (parse) {
        var dom;
        (function (dom) {
            var domsvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            var dompath = document.createElementNS("http://www.w3.org/2000/svg", "path");
            var Parser = (function () {
                function Parser() {
                }
                Parser.prototype.parse = function (runner, data) {
                    if (typeof data !== "string") {
                        console.warn("Input parse data was not a string.", data);
                        return;
                    }
                    dompath.setAttribute("d", data);
                    var segments = dompath.pathSegList, cur = [0, 0];
                    for (var i = 0, len = segments.numberOfItems; i < len; i++) {
                        parseSegment(runner, segments.getItem(i), cur);
                    }
                };
                return Parser;
            })();
            dom.Parser = Parser;
            function parseSegment(runner, segment, cur) {
                switch (segment.pathSegType) {
                    case SVGPathSeg.PATHSEG_ARC_ABS:
                        var arc1 = segment;
                        curve.ellipticalArc.genEllipse(runner, cur[0], cur[1], arc1.x, arc1.y, arc1.largeArcFlag ? 1 : 0, arc1.sweepFlag ? 1 : 0, arc1.r1, arc1.r2, arc1.angle);
                        cur[0] = arc1.x;
                        cur[1] = arc1.y;
                        break;
                    case SVGPathSeg.PATHSEG_ARC_REL:
                        var arc2 = segment;
                        curve.ellipticalArc.genEllipse(runner, cur[0], cur[1], cur[0] + arc2.x, cur[1] + arc2.y, arc2.largeArcFlag ? 1 : 0, arc2.sweepFlag ? 1 : 0, arc2.r1, arc2.r2, arc2.angle);
                        cur[0] += arc2.x;
                        cur[1] += arc2.y;
                        break;
                    case SVGPathSeg.PATHSEG_CLOSEPATH:
                        runner.closePath();
                        break;
                    case SVGPathSeg.PATHSEG_CURVETO_CUBIC_ABS:
                        var curve1 = segment;
                        runner.bezierCurveTo(curve1.x1, curve1.y1, curve1.x2, curve1.y2, curve1.x, curve1.y);
                        cur[0] = curve1.x;
                        cur[1] = curve1.y;
                        break;
                    case SVGPathSeg.PATHSEG_CURVETO_CUBIC_REL:
                        var curve2 = segment;
                        runner.bezierCurveTo(cur[0] + curve2.x1, cur[1] + curve2.y1, cur[0] + curve2.x2, cur[1] + curve2.y2, cur[0] + curve2.x, cur[1] + curve2.y);
                        cur[0] += curve2.x;
                        cur[1] += curve2.y;
                        break;
                    case SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_ABS:
                        var curve3 = segment;
                        smoothCubic(runner, curve3.x2, curve3.y2, curve3.x, curve3.y, cur);
                        break;
                    case SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_REL:
                        var curve4 = segment;
                        smoothCubic(runner, cur[0] + curve4.x2, cur[1] + curve4.y2, cur[0] + curve4.x, cur[1] + curve4.y, cur);
                        break;
                    case SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_ABS:
                        var curve5 = segment;
                        runner.quadraticCurveTo(curve5.x1, curve5.y1, curve5.x, curve5.y);
                        cur[0] = curve5.x;
                        cur[1] = curve5.y;
                        break;
                    case SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_REL:
                        var curve6 = segment;
                        runner.quadraticCurveTo(cur[0] + curve6.x1, cur[1] + curve6.y1, cur[0] + curve6.x, cur[1] + curve6.y);
                        cur[0] += curve6.x;
                        cur[1] += curve6.y;
                        break;
                    case SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_SMOOTH_ABS:
                        var curve7 = segment;
                        smoothQuadratic(runner, curve7.x, curve7.y, cur);
                        break;
                    case SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_SMOOTH_REL:
                        var curve8 = segment;
                        smoothQuadratic(runner, cur[0] + curve8.x, cur[1] + curve8.y, cur);
                        break;
                    case SVGPathSeg.PATHSEG_LINETO_ABS:
                        var line1 = segment;
                        cur[0] = line1.x;
                        cur[1] = line1.y;
                        runner.lineTo(cur[0], cur[1]);
                        break;
                    case SVGPathSeg.PATHSEG_LINETO_HORIZONTAL_ABS:
                        var line2 = segment;
                        cur[0] = line2.x;
                        runner.lineTo(cur[0], cur[1]);
                        break;
                    case SVGPathSeg.PATHSEG_LINETO_HORIZONTAL_REL:
                        var line3 = segment;
                        cur[0] += line3.x;
                        runner.lineTo(cur[0], cur[1]);
                        break;
                    case SVGPathSeg.PATHSEG_LINETO_REL:
                        var line4 = segment;
                        cur[0] += line4.x;
                        cur[1] += line4.y;
                        runner.lineTo(cur[0], cur[1]);
                        break;
                    case SVGPathSeg.PATHSEG_LINETO_VERTICAL_ABS:
                        var line5 = segment;
                        cur[1] = line5.y;
                        runner.lineTo(cur[0], cur[1]);
                        break;
                    case SVGPathSeg.PATHSEG_LINETO_VERTICAL_REL:
                        var line6 = segment;
                        cur[1] += line6.y;
                        runner.lineTo(cur[0], cur[1]);
                        break;
                    case SVGPathSeg.PATHSEG_MOVETO_ABS:
                        var move1 = segment;
                        cur[0] = move1.x;
                        cur[1] = move1.y;
                        runner.moveTo(cur[0], cur[1]);
                        break;
                    case SVGPathSeg.PATHSEG_MOVETO_REL:
                        var move2 = segment;
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
            function smoothCubic(runner, x2, y2, x, y, cur) {
                var cx = cur[0], cy = cur[1];
                console.warn("Smooth cubic", "Not implemented");
            }
            function smoothQuadratic(runner, x, y, cur) {
                var cx = cur[0], cy = cur[1];
                console.warn("Smooth quadratic", "Not implemented");
            }
        })(dom = parse.dom || (parse.dom = {}));
    })(parse = curve.parse || (curve.parse = {}));
})(curve || (curve = {}));
var curve;
(function (curve) {
    var parse;
    (function (parse_1) {
        var matching;
        (function (matching) {
            var Parser = (function () {
                function Parser() {
                }
                Parser.prototype.parse = function (runner, data) {
                    if (typeof data === "string")
                        parse(runner, data, data.length);
                    else
                        console.warn("Input parse data was not a string.", data);
                };
                return Parser;
            })();
            matching.Parser = Parser;
            function parse(runner, str, len) {
                var index = 0;
                go();
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
                                    runner.setFillRule(FillRule.EvenOdd);
                                else if (c === '1')
                                    runner.setFillRule(FillRule.NonZero);
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
                                runner.moveTo(cp1.x, cp1.y);
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
                                    runner.lineTo(cp1.x, cp1.y);
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
                                    runner.lineTo(cp1.x, cp1.y);
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
                                runner.lineTo(cp.x, cp.y);
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
                                runner.lineTo(cp.x, cp.y);
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
                                    runner.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, cp3.x, cp3.y);
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
                                    runner.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, cp3.x, cp3.y);
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
                                    runner.quadraticCurveTo(cp1.x, cp1.y, cp2.x, cp2.y);
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
                                    runner.quadraticCurveTo(cp1.x, cp1.y, cp2.x, cp2.y);
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
                                    var is_large = parseDouble() !== 0 ? 1 : 0;
                                    var sweep = SweepDirection.Counterclockwise;
                                    if (parseDouble() !== 0)
                                        sweep = SweepDirection.Clockwise;
                                    if ((cp2 = parsePoint()) == null)
                                        break;
                                    if (relative) {
                                        cp2.x += cp.x;
                                        cp2.y += cp.y;
                                    }
                                    var phi = angle * Math.PI / 180.0;
                                    curve.ellipticalArc.genEllipse(runner, cp.x, cp.y, cp2.x, cp2.y, is_large, sweep, phi, cp1.x, cp1.y);
                                    cp.x = cp2.x;
                                    cp.y = cp2.y;
                                    advance();
                                }
                                cbz = qbz = false;
                                break;
                            case 'z':
                            case 'Z':
                                runner.closePath();
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
    })(parse = curve.parse || (curve.parse = {}));
})(curve || (curve = {}));
var FillRule;
(function (FillRule) {
    FillRule[FillRule["EvenOdd"] = 0] = "EvenOdd";
    FillRule[FillRule["NonZero"] = 1] = "NonZero";
})(FillRule || (FillRule = {}));
var SweepDirection;
(function (SweepDirection) {
    SweepDirection[SweepDirection["Counterclockwise"] = 0] = "Counterclockwise";
    SweepDirection[SweepDirection["Clockwise"] = 1] = "Clockwise";
})(SweepDirection || (SweepDirection = {}));
var curve;
(function (curve) {
    var Path = (function () {
        function Path(arg0) {
            this.$ops = [];
            if (arg0 instanceof Path) {
                arg0.exec(this);
            }
            else if (Array.isArray(arg0)) {
                new curve.compiler.decompile(this, arg0);
            }
            else if (typeof arg0 === "string") {
                var parser = curve.parse.getParser();
                parser.parse(this, arg0);
            }
        }
        Path.prototype.exec = function (runner, step) {
            for (var ops = this.$ops, i = 0; ops && i < ops.length; i++) {
                ops[i](runner);
                step && step();
            }
        };
        Path.prototype.draw = function (ctx) {
            this.exec(ctx);
        };
        Path.prototype.addPath = function (path) {
            path.exec(this);
        };
        Path.prototype.setFillRule = function (fillRule) {
            this.$ops.push(function (exec) { return exec.setFillRule(fillRule); });
        };
        Path.prototype.closePath = function () {
            this.$ops.push(function (exec) { return exec.closePath(); });
        };
        Path.prototype.moveTo = function (x, y) {
            this.$ops.push(function (exec) { return exec.moveTo(x, y); });
        };
        Path.prototype.lineTo = function (x, y) {
            this.$ops.push(function (exec) { return exec.lineTo(x, y); });
        };
        Path.prototype.bezierCurveTo = function (cp1x, cp1y, cp2x, cp2y, x, y) {
            this.$ops.push(function (exec) { return exec.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y); });
        };
        Path.prototype.quadraticCurveTo = function (cpx, cpy, x, y) {
            this.$ops.push(function (exec) { return exec.quadraticCurveTo(cpx, cpy, x, y); });
        };
        Path.prototype.arc = function (x, y, radius, startAngle, endAngle, anticlockwise) {
            this.$ops.push(function (exec) { return exec.arc(x, y, radius, startAngle, endAngle, anticlockwise); });
        };
        Path.prototype.arcTo = function (x1, y1, x2, y2, radius) {
            this.$ops.push(function (exec) { return exec.arcTo(x1, y1, x2, y2, radius); });
        };
        Path.prototype.ellipse = function (x, y, radiusX, radiusY, rotation, startAngle, endAngle, antiClockwise) {
            this.$ops.push(function (exec) { return exec.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, antiClockwise); });
        };
        Path.parse = function (runner, data) {
            var parser = curve.parse.getParser();
            parser.parse(runner, data);
        };
        return Path;
    })();
    curve.Path = Path;
})(curve || (curve = {}));
var curve;
(function (curve) {
    function serialize(path) {
        var serializer = new Serializer();
        path.exec(serializer);
        return serializer.data;
    }
    curve.serialize = serialize;
    var Serializer = (function () {
        function Serializer() {
            this.data = "";
        }
        Serializer.prototype.setFillRule = function (fillRule) {
            this.prepend().data += "F" + fillRule;
        };
        Serializer.prototype.closePath = function () {
            this.prepend().data += "Z";
        };
        Serializer.prototype.moveTo = function (x, y) {
            this.prepend().data += "M" + x + "," + y;
        };
        Serializer.prototype.lineTo = function (x, y) {
            this.prepend().data += "L" + x + "," + y;
        };
        Serializer.prototype.bezierCurveTo = function (cp1x, cp1y, cp2x, cp2y, x, y) {
            this.prepend().data += "C" + cp1x + "," + cp1y + "," + cp2x + "," + cp2y + "," + x + "," + y;
        };
        Serializer.prototype.quadraticCurveTo = function (cpx, cpy, x, y) {
            this.prepend().data += "Q" + cpx + "," + cpy + "," + x + "," + y;
        };
        Serializer.prototype.arc = function (x, y, radius, startAngle, endAngle, anticlockwise) {
        };
        Serializer.prototype.arcTo = function (x1, y1, x2, y2, radius) {
        };
        Serializer.prototype.ellipse = function (x, y, radiusX, radiusY, rotation, startAngle, endAngle, antiClockwise) {
            console.warn("serialize.ellipse", "Not implemented");
        };
        Serializer.prototype.prepend = function () {
            if (this.data)
                this.data += " ";
            return this;
        };
        return Serializer;
    })();
})(curve || (curve = {}));

//# sourceMappingURL=curve.js.map
