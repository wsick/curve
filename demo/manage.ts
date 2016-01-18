namespace demo {
    var $canvas: HTMLCanvasElement;
    var $data: HTMLInputElement;
    var $bounds: HTMLInputElement;
    var $cur: curve.Path;

    export function setCanvas(canvas: HTMLCanvasElement) {
        $canvas = canvas;
    }

    export function setDataInput(data: HTMLInputElement) {
        $data = data;
    }

    export function setBoundsInput(bounds: HTMLInputElement) {
        $bounds = bounds;
    }

    export function run() {
        build();
        clear();
        draw();
    }

    export function clear() {
        var ctx = $canvas.getContext('2d');
        ctx.clearRect(0, 0, $canvas.width, $canvas.height);
    }

    export function build() {
        $cur = create.newCurve({w: $canvas.width, h: $canvas.height});
    }

    export function draw() {
        var ctx = $canvas.getContext('2d');

        ctx.beginPath();
        $cur.draw(ctx);
        stroke.set(ctx);
        ctx.stroke();

        var box = bounds.draw(ctx, $cur, stroke.pars);
        if (create.isSingleType())
            guide.drawSingle(ctx, $cur);
        else
            guide.drawMultiple(ctx, $cur);

        $data.value = curve.serialize($cur);
        $bounds.value = `l: ${box.l}, t: ${box.t}, r: ${box.r}, b: ${box.b}`;

        return demo;
    }
}