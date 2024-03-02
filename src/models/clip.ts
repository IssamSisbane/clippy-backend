const hour = 60 * 60;

export enum TttEnum {
    OneHour = 1 * hour,
    SixHours = 6 * hour,
    TwelveHours = 12 * hour,
    TwentyFourHours = 24 * hour,
}

export interface Clip {
    path: string,
    title: string,
    content: string,
    file: string,
    file_extension: string,
    ttl: TttEnum,
}

export function verifyClip(object: any): boolean {
    return object.path !== undefined
        && object.title !== undefined
        && object.content !== undefined
        && object.ttl !== undefined;
}