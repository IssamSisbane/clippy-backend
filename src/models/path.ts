export interface Path {
    id: string;
    emoji: string;
    state: string;
}

export function verifyPath(object: any): boolean {
    return object.id != undefined && object.emoji != undefined;
}