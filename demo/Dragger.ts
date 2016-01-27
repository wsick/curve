namespace demo {
    import vec2 = la.vec2;

    export class Dragger {
        private $el: HTMLElement;
        private $offset: Float32Array;
        private isDragging: boolean;

        constructor(private $onDown: (p: Float32Array) => boolean,
                    private $onUp?: (p: Float32Array) => void,
                    private $onDrag?: (p: Float32Array) => void,
                    private $onMove?: (p: Float32Array) => void) {

        }

        init(el: HTMLElement): this {
            this.$el = el;
            el.addEventListener("mousedown", (e) => this.onMouseDown(window.event ? <any>window.event : e));
            el.addEventListener("mouseup", (e) => this.onMouseUp(window.event ? <any>window.event : e));
            el.addEventListener("mousemove", (e) => this.onMouseMove(window.event ? <any>window.event : e));
            return this;
        }

        getPoint(e): Float32Array {
            var offset = this.$offset = this.$offset || calcOffset(this.$el);
            return vec2.create(
                e.clientX + window.pageXOffset - offset[0],
                e.clientY + window.pageYOffset - offset[1]);
        }

        onMouseDown(e) {
            this.isDragging = !!this.$onDown(this.getPoint(e));
        }

        onMouseUp(e) {
            this.isDragging = false;
            this.$onUp && this.$onUp(this.getPoint(e));
        }

        onMouseMove(e) {
            var p = this.getPoint(e);
            if (this.isDragging) {
                this.$onDrag && this.$onDrag(p);
            } else {
                this.$onMove && this.$onMove(p);
            }
        }
    }

    function calcOffset(el: HTMLElement): Float32Array {
        var left = 0;
        var top = 0;
        var cur: HTMLElement = el;
        if (cur.offsetParent) {
            do {
                left += cur.offsetLeft;
                top += cur.offsetTop;
            } while (cur = <HTMLElement>cur.offsetParent);
        }
        return vec2.create(left, top);
    }
}