export function getData() {
    return new Promise((resolve) => {
        resolve('data');
    });
}

export function saveData() {
    return new Promise((resolve) => {
        resolve('success');
    });
}
