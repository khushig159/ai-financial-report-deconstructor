import admin from 'firebase-admin';

export const register = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        const userRecord = await admin.auth().createUser({
            email: email,
            password: password,
        });
        console.log("Successfully created new user:", userRecord.uid);
        res.status(201).json({
            message: "User created successfully!",
            uid: userRecord.uid
        });

    } catch (error) {
        console.error("Error creating new user:", error.code, error.message);
        let errorMessage = "Failed to create user.";
        if (error.code === 'auth/email-already-exists') {
            errorMessage = "The email address is already in use by another account.";
        }
        res.status(500).json({ message: errorMessage });
    }
};

// Placeholder function for user login
export const login = async (req, res) => {
    res.status(501).json({ message: "Login endpoint not yet implemented." });
};
