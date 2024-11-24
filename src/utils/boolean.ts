export function nand(a: any, b: any): boolean {
    return (Boolean(a) && !Boolean(b)) || (!Boolean(a) && Boolean(b));
}