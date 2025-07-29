export async function sha512(value: unknown) {
    const encoder = new TextEncoder();
    const data = encoder.encode(JSON.stringify(value));

    return await window.crypto.subtle.digest('SHA-512', data);
}
