namespace curve.compiler {
    export function decompile(runner: ISegmentRunner, compiled: ICompiledSegment[]) {
        for (var i = 0; !!compiled && i < compiled.length; i++) {
            let seg = compiled[i];
            let typeStr: string;
            if (typeof seg.t !== "number" || !(typeStr = CompiledOpType[seg.t])) {
                console.warn(`Unknown compiled path command: ${seg.t}, ${seg.a}`);
                continue;
            }
            var func = runner[typeStr];
            func && func.apply(runner, seg.a);
        }
    }
}