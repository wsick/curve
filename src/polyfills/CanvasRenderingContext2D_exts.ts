interface CanvasRenderingContext2D {
    fill(path: curve.Path, fillRule?: string): void;
    stroke(path: curve.Path): void;
    clip(path: curve.Path, fillRule?: string): void;
}

namespace curve {
    var proto: CanvasRenderingContext2D = CanvasRenderingContext2D.prototype;

    var _fill = proto.fill;
    proto.fill = function (arg: any) {
        if (arg instanceof Path) {
            this.drawPath(arg);
            _fill.apply(this, Array.prototype.slice.call(arguments, 1));
        } else {
            _fill.apply(this, arguments);
        }
    };

    var _stroke = proto.stroke;
    proto.stroke = function (arg?: any) {
        if (arg instanceof Path) {
            this.drawPath(arg);
            _stroke.call(this);
        } else {
            _stroke.call(this)
        }
    };

    var _clip = proto.clip;
    proto.clip = function (arg: any) {
        if (arg instanceof Path) {
            this.drawPath(arg);
            _clip.apply(this, Array.prototype.slice.call(arguments, 1));
        } else {
            _clip.apply(this, arguments);
        }
    }
}