import jwt from 'jsonwebtoken';
function getJwtSecret() {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET is not configured');
    }
    return secret;
}
function isTokenPayload(value) {
    if (typeof value !== 'object' || value === null) {
        return false;
    }
    const payload = value;
    return (typeof payload.sub === 'string' &&
        typeof payload.email === 'string' &&
        typeof payload.role === 'string');
}
export function authenticate(req, res, next) {
    const authorization = req.headers.authorization;
    if (!authorization?.startsWith('Bearer ')) {
        res.status(401).json({
            success: false,
            message: 'Authentication required',
        });
        return;
    }
    const token = authorization.substring(7);
    try {
        const payload = jwt.verify(token, getJwtSecret());
        if (!isTokenPayload(payload)) {
            res.status(401).json({
                success: false,
                message: 'Invalid authentication token',
            });
            return;
        }
        req.user = {
            id: payload.sub,
            email: payload.email,
            role: payload.role,
        };
        next();
    }
    catch {
        res.status(401).json({
            success: false,
            message: 'Invalid or expired authentication token',
        });
    }
}
//# sourceMappingURL=auth.middleware.js.map