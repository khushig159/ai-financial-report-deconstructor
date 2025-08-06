import admin from 'firebase-admin'

export const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer')) {
        console.log("No token provided, or header is not Bearer.");
        return res.status(401).json({ message: "Unauthorized: No token provided." });
    }
    const idToken = authHeader.split('Bearer ')[1];

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken)
        req.user = decodedToken
        console.log(`Token verified for user: ${decodedToken.uid}`);
        next();
    }
    catch (error) {
        console.error("Error verifying auth token:", error);
        return res.status(403).json({ message: "Forbidden: Invalid or expired token." });
    }
}