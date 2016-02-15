namespace demo {
    export class Timeline {
        private $box: HTMLDivElement;
        private $filler: HTMLDivElement;
        private $time = 0;
        private $dragger: Dragger;
        private $onRun: () => void;

        init(box: HTMLDivElement, filler: HTMLDivElement) {
            this.$dragger = new Dragger(this.onDown, null, this.onDrag);
            this.$dragger.init(box);
            this.$box = box;
            this.$filler = filler;
            return this;
        }

        onRun(func: () => void) {
            this.$onRun = func;
            return this;
        }

        getTime(): number {
            return this.$time;
        }

        setTime() {
            this.$time = Math.max(0, Math.min(1, this.$filler.clientWidth / this.$box.clientWidth));
            this.$onRun && this.$onRun();
        }

        onDown = (p: Float32Array): boolean => {
            this.$filler.style.width = `${p[0]}px`;
            this.setTime();
            return true;
        };

        onDrag = (p: Float32Array) => {
            this.$filler.style.width = `${p[0]}px`;
            this.setTime();
        };
    }
}