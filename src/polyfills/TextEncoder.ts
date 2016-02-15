interface TextEncoder {
    encode(str: string): Uint8Array;
    encoding: string;
}
declare var TextEncoder: {
    prototype: TextEncoder;
    new(): TextEncoder;
};

(function (global: any) {
    if (typeof global.TextEncoder === "function")
        return;

    global.TextEncoder = class TextEncoder {
        constructor() {
            Object.defineProperties(this, {
                "encoding": {value: "utf-8", writable: false}
            });
        }

        encode(str: string): Uint8Array {
            var buf = new ArrayBuffer(str.length);
            var arr = new Uint8Array(buf);
            for (var i = 0; i < arr.length; i++) {
                arr[i] = str.charCodeAt(i);
            }
            return arr;
        }
    };
})(this);