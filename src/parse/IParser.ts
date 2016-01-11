///<reference path="ParseTypes.ts"/>

namespace curve.parse {
    export interface IParser {
        parse(runner: ISegmentRunner, data: string|Uint8Array);
    }

    export var style = ParseStyles.CharMatching;

    export function getParser(): IParser {
        if (style === ParseStyles.Buffer)
            return new buffer.Parser();
        else if (style === ParseStyles.Dom)
            return new dom.Parser();
        return new matching.Parser();
    }
}