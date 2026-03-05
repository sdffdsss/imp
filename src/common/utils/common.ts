export function safeJsonParse(jsonStr) {
    try {
        return JSON.parse(jsonStr);
    } catch (e) {
        console.error(e);
        return {};
    }
}
