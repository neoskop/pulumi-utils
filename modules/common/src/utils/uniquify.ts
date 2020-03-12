export function uniqify(prefix: string, suffixLength = 5): string {
    let unique = `${prefix}-`;

    while (suffixLength--) {
        unique += ((Math.random() * 36) | 0).toString(36);
    }

    return unique;
}
