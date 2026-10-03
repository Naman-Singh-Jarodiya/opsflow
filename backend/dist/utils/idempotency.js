import crypto from 'node:crypto';
export function createRequestHash(method, path, body) {
    const payload = JSON.stringify({
        method,
        path,
        body,
    });
    return crypto
        .createHash('sha256')
        .update(payload)
        .digest('hex');
}
export function getIdempotencyKey(value) {
    if (typeof value !== 'string') {
        return null;
    }
    const key = value.trim();
    if (!key || key.length > 255) {
        return null;
    }
    return key;
}
//# sourceMappingURL=idempotency.js.map