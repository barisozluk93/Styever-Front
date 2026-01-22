export function parseBoolean(
    value: string | boolean | null | undefined
): boolean {
    if (typeof value === "boolean") return value;
    if (!value) return false;

    return value.toLowerCase() === "true";
}