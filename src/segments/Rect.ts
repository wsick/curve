namespace gfx.segments {
    export class Rect implements ISegment {
        draw(ctx: CanvasRenderingContext2D, args: any[]) {
            var x: number = args[0];
            var y: number = args[1];
            var w: number = args[2];
            var h: number = args[3];
            ctx.rect(x, y, w, h);
        }

        extendFillBox(box: IBoundingBox, sx: number, sy: number, args: any[], metrics?: any) {
            var x: number = args[0];
            var y: number = args[1];
            var w: number = args[2];
            var h: number = args[3];
            box.l = Math.min(box.l, x);
            box.r = Math.max(box.r, x + w);
            box.t = Math.min(box.t, y);
            box.b = Math.max(box.b, y + h);
        }

        extendStrokeBox(box: IBoundingBox, sx: number, sy: number, args: any[], pars: IStrokeParameters, metrics?: any) {
            var x: number = args[0];
            var y: number = args[1];
            var w: number = args[2];
            var h: number = args[3];
            var hs = pars.strokeThickness / 2.0;
            box.l = Math.min(box.l, x - hs);
            box.r = Math.max(box.r, x + w + hs);
            box.t = Math.min(box.t, y - hs);
            box.b = Math.max(box.b, y + h + hs);
        }

        getStartVector(sx: number, sy: number, args: any[], metrics?: any): number[] {
            return undefined;
        }

        getEndVector(sx: number, sy: number, args: any[], metrics?: any): number[] {
            return undefined;
        }
    }
}