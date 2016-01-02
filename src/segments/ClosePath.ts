namespace gfx.segments {
    export class ClosePath implements ISegment {
        draw(ctx: CanvasRenderingContext2D, args: any[]) {
            ctx.closePath();
        }

        extendFillBox(box: IBoundingBox, sx: number, sy: number, args: any[]) {
        }

        extendStrokeBox(box: IBoundingBox, sx: number, sy: number, args: any[], pars: IStrokeParameters) {
        }

        getStartVector(sx: number, sy: number, args: any[]): number[] {
            return undefined;
        }

        getEndVector(sx: number, sy: number, args: any[]): number[] {
            return undefined;
        }

    }
}