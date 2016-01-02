namespace gfx.parse {
    export interface IParser {
        parse(path: IPath, data: string|Uint8Array): IPath;
    }

    export var style = ParseStyles.CharMatching;

    export function getParser(): IParser {
        if (style === ParseStyles.Buffer)
            return new buffer.Parser();
        return new matching.Parser();
    }
}