/** Generates a SHA-512 hash from the given input and returns the hash in a hex string format. */
export async function sha512(value: unknown) {
    const encoder = new TextEncoder();
    const data = encoder.encode(JSON.stringify(value));

    const buffer = await window.crypto.subtle.digest('SHA-512', data);

    return Array.from(new Uint8Array(buffer))
        .map((byte) => byte.toString(16).padStart(2, '0'))
        .join('');
}
