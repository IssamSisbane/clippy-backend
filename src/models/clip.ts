export enum TttEnum {
    Day = "1d",
    Week = "7d",
    Month = "30d",
}

export enum ClipTypeEnum {
    Text = "text",
    Image = "image",
    File = "file",
}

export interface Clip {
    path: string,
    title: string,
    content: string,
    type: ClipTypeEnum,
    timeToLive: TttEnum,
}

export function verifyClip(object: any): boolean {
    return object.path !== undefined
        && object.title !== undefined
        && object.content !== undefined
        && object.type !== undefined
        && object.timeToLive !== undefined;
}