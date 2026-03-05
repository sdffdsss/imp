export const isType = (type) => {
    return (data) => {
        return Object.prototype.toString.call(data) === `[object ${type}]`;
    };
};
