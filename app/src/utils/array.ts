export function moveItemInArray(arr: unknown[], from: number, to: number) {
    arr.splice(to, 0, arr.splice(from, 1)[0]);
    return arr;
}

export function randomItemFromArray(arr: unknown[]) {
    return arr[Math.floor(Math.random() * arr.length)];
}
