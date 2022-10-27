export const printUrl = (url: string, data: string[] | string) => {
    console.log('print urlllll', data);
    if (typeof data === 'string') {
        return url.replace(/{\w*}/gi, data);
    }

    let iterator = 0;
    return url.replace(/{\w*}/gi, () => data[iterator++]);
};

export function repeat<T>(num: number, whatTo: T): T[] {
    var arr = [];
    for (var i = 0; i < num; i++) {
        arr.push(whatTo);
    }
    return arr;
}
