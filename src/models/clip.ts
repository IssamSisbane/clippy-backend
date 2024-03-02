export enum TttEnum {
    Day = "1d",
    Week = "7d",
    Month = "30d",
}

export interface Clip {
    path: string,
    title: string,
    content: string,
    file: string,
    timeToLive: TttEnum,
}

export function verifyClip(object: any): boolean {
    return object.path !== undefined
        && object.title !== undefined
        && object.content !== undefined
        && object.timeToLive !== undefined;
}