export async function readAsDataURLAsync(blob: Blob) {
    return new Promise<string | ArrayBuffer | null | undefined>((resolve, reject) => {
        const fr = new FileReader();
        fr.onload = (event) => resolve(event.target?.result);
        fr.onerror = reject;
        fr.readAsDataURL(blob);
    });
}