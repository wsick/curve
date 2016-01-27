namespace demo {
    import vec2 = la.vec2;

    export class Mover {
        private $canvas: HTMLCanvasElement;
        private $dragger: Dragger;
        private $grabber: IGrabeable;
        private $onRun: () => void;

        init(canvas: HTMLCanvasElement, grabber: IGrabeable): this {
            this.$canvas = canvas;
            this.$grabber = grabber;
            this.$dragger = new Dragger(this.onDown, null, this.onDrag, this.onMove)
                .init(canvas);
            return this;
        }

        onRun(func: () => void) {
            this.$onRun = func;
            return this;
        }

        onDown = (p: Float32Array): boolean => {
            return this.$grabber.grab(p[0], p[1]);
        };

        onDrag = (p: Float32Array) => {
            this.$grabber.move(p[0], p[1]);
            this.$onRun && this.$onRun();
        };

        onMove = (p: Float32Array) => {
            let canGrab = this.$grabber.canGrab(p[0], p[1]);
            this.$canvas.style.cursor = canGrab ? "pointer" : "";
        };
    }
}