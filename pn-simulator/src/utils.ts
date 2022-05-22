export function filterRecordOnKeys(
    obj: Record<string, any>, predicate: (k: string) => Boolean
): Record<string, any> {
    return Object.keys(obj)
        .filter((key: string) => predicate(key))
        .reduce((accumulator: Record<string, any>, key: string) => {
            return Object.assign(accumulator,
                {[key]: (obj[key])})
        }, {});
}

