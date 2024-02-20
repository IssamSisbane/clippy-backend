export enum TttEnum {
    "1d" = "1d",
    "7d" = "7d",
    "30d" = "30d",
}

export enum ClipTypeEnum {
    "text" = "text",
    "image" = "image",
    "file" = "file",
}

export interface Clip {
    path: string,
    title: string,
    content: string,
    type: ClipTypeEnum,
    ttll: TttEnum,
}