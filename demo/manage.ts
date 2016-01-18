namespace demo {
    var $canvas: HTMLCanvasElement;
    var $data: HTMLInputElement;
    var $cur: curve.Path;

    export function setCanvas(canvas: HTMLCanvasElement) {
        $canvas = canvas;
    }

    export function setDataInput(data: HTMLInputElement) {
        $data = data;
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

        bounds.draw(ctx, $cur, stroke.pars);
        if (create.isSingleType())
            guide.drawSingle(ctx, $cur);
        else
            guide.drawMultiple(ctx, $cur);

        $data.value = curve.serialize($cur);

        return demo;
    }
}