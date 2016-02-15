namespace demo.random {
    export function point(constraints: number[]): number[] {
        return [
            randomInt(0, constraints[0]),
            randomInt(0, constraints[1])
        ];
    }

    export function randomInt(low: number, high: number): number {
        return Math.floor(Math.random() * (high - low) + low);
    }

    export function flag(): boolean {
        return Math.round(Math.random()) === 1;
    }
}