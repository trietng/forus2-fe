export function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function isValidHttpUrl(url: string, callback?: (url: string) => [boolean, string]): [boolean, string] {
    let urlObj;
    
    try {
        urlObj = new URL(url);
    } catch (_) {
        return [false, "Not a valid URL."];
    }

    let isHttp = urlObj.protocol === "http:" || urlObj.protocol === "https:";

    if (!isHttp) {
        return [false, "URL must be HTTP or HTTPS."];
    }

    if (callback) {
        return callback(url);
    }

    return [true, ""];
}