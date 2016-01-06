namespace gfx.segments {
    export class Ellipse implements ISegment {
        draw(ctx: CanvasRenderingContext2D, args: any[]) {
            var x: number = args[0];
            var y: number = args[1];
            var rx: number = args[2];
            var ry: number = args[3];
            var rotation: number = args[4];
            var sa: number = args[5];
            var ea: number = args[6];
            var ac: boolean = args[7];
            ctx.ellipse(x, y, rx, ry, rotation, sa, ea, ac);
        }

        extendFillBox(box: IBoundingBox, sx: number, sy: number, args: any[], metrics?: any) {
            var x: number = args[0];
            var y: number = args[1];
            var rx: number = args[2];
            var ry: number = args[3];
            var rotation: number = args[4];
            var sa: number = args[5];
            var ea: number = args[6];
            var ac: boolean = args[7] === true;

            console.warn("extendFillBox", "Currently not accounting for rotation or start/end angle.");
            //TODO: Account for rotation, start angle, end angle (anticlockwise)

            box.l = Math.min(box.l, x);
            box.r = Math.max(box.r, x + rx + rx);
            box.t = Math.min(box.t, y);
            box.b = Math.max(box.b, y + ry + ry);
        }

        extendStrokeBox(box: IBoundingBox, sx: number, sy: number, args: any[], pars: IStrokeParameters, metrics?: any) {
            var x: number = args[0];
            var y: number = args[1];
            var rx: number = args[2];
            var ry: number = args[3];
            var rotation: number = args[4];
            var sa: number = args[5];
            var ea: number = args[6];
            var ac: boolean = args[7] === true;

            console.warn("extendStrokeBox", "Currently not accounting for rotation or start/end angle.");
            //TODO: Account for rotation, start angle, end angle (anticlockwise)

            var hs = pars.strokeThickness / 2.0;
            box.l = Math.min(box.l, x - hs);
            box.r = Math.max(box.r, x + rx + rx + hs);
            box.t = Math.min(box.t, y - hs);
            box.b = Math.max(box.b, y + ry + ry + hs);
        }

        getStartVector(sx: number, sy: number, args: any[], metrics?: any): number[] {
            console.warn("getStartVector", "Currently not accounting for rotation or start/end angle.");
            return undefined;
        }

        getEndVector(sx: number, sy: number, args: any[], metrics?: any): number[] {
            console.warn("getEndVector", "Currently not accounting for rotation or start/end angle.");
            return undefined;
        }
    }
}