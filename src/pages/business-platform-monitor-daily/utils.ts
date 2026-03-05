export const getSearchParms = (keyList: string[]): Record<string, any> => {
    const searchParams = new URLSearchParams(window.location.search);
    const parmas = {};
    keyList.forEach((key) => {
        parmas[key] = searchParams.get(key);
    });
    return parmas;
};
