/** NOTE:
 * It creates the account, sends the verification email, verifies the token and handles login.
 * 
 * How the email-verification connection works
    The critical line is:
    await sendVerificationEmail(user.email, verificationToken);
 * 
 * It calls the email service(emailService.js). The raw token is sent through the link, while the database stores its hash.
 * 
 * //  Normalization means converting data into one standard, consistent form before you compare or store it.
 * 
 * SALT: cost factor:
    10 is acceptable. OWASP (the Open Worldwide Application Security Project) treats it as a commonly used minimum for bcrypt.
    12 is a better default for a business dashboard that holds customer and order data. The extra ~200 ms only happens at login and register, so users barely notice it.
        If hosting is a cheap, low-CPU server, test it. A cost that is too high plus many simultaneous logins can overload the server, because hashing is CPU-heavy.
 * 
 * 
 * .save(): What does .save() actually save? LATER STUDY

        user.save() is an instance method on a Mongoose Document (a JavaScript object wrapping one MongoDB record). It returns Promise<Document>.

        Mongoose does dirty tracking: it remembers which fields you changed after loading the document, and saves only those. It does not rewrite the whole record. For your code it sends roughly:

        js
        updateOne(
        { _id: user._id },
        {
            $set:   { isEmailVerified: true },
            $unset: { emailVerificationTokenHash: 1, emailVerificationExpiresAt: 1 }
        }
        )
        $set writes a field value.
        $unset deletes the field from the document.

        The final record in MongoDB has isEmailVerified: true and no token fields. Also, .save():

        runs schema validation first, so invalid data is rejected;
        runs middleware hooks (such as pre("save"));
        updates updatedAt if your schema uses timestamps: true
        The document in memory also reflects the same final state afterwards
 * 
 * 
 * 
 * 

    
 */



import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createHash, randomBytes } from "node:crypto";

import User from "../models/User.js";
import { sendVerificationEmail } from "../services/emailService.js";


    // helper function
function hashToken(token) {
  return createHash("sha256").update(token).digest("hex"); // createHash("sha256") returns a Hash object. 
  // // .update(token) feeds in the data and returns the same Hash object. // // .digest("hex") finalizes it and returns a string. // // ?????????????? Why SHA-256 and not bcrypt here? Tokens are 256 bits of random data, so they can’t be guessed. A fast hash is safe for that. SHA-256 is also deterministic (the same input always gives the same output), so you can search the database by hashToken(token). bcrypt adds a random salt, so the same input gives different outputs and you could not look it up this way.
}

// Register an owner account. 
export async function register(req, res, next) {
  try {
    const { name, email, password } = req.validatedBody; // read input // // object destructuring. validatedBody is a custom property set by your Zod middleware, so the data is already checked and typed as { name: string, email: string, password: string }.

    const normalizedEmail = email.toLowerCase(); 

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists",
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

 /**create the verification token */
    // The raw token goes into the email. // // Only its hash is stored in MongoDB.
    const verificationToken = randomBytes(32).toString("hex"); // randomBytes(32) gives 32 bytes from a CSPRNG (cryptographically secure pseudo-random number generator). // // .toString("hex") converts each byte to 2 hex characters, giving a 64-character string. // // This is not Math.random(), because that is predictable and unsafe for security.

/** save the user */
    const user = await User.create({
      name,
      email: normalizedEmail,
      passwordHash,
      isEmailVerified: false,
      emailVerificationTokenHash: hashToken(verificationToken),
      emailVerificationExpiresAt: new Date(
        Date.now() + 30 * 60 * 1000 // Date.now() returns a number (milliseconds since 1970). // // 30 * 60 * 1000 = 1,800,000 ms = 30 minutes. // // new Date(...) wraps it as a Date object, which Mongo stores as a date type.
        // // // The email gets the raw token and the database keeps only the hash.
      ),
      role: "owner",
    });

/**send the email, with rollback */
    try { 
      await sendVerificationEmail(
        user.email,
        verificationToken
      );
    } catch (emailError) { // // This is a compensating action (undoing an earlier step when a later step fails) Without it, the user row would exist but the person could never verify. Their email would be locked, and every retry would return 409. throw emailError re-throws, so the outer catch forwards it to next(error).
      // Do not leave an unusable account if email sending fails.
      await User.deleteOne({ _id: user._id });
      throw emailError;
    }

    return res.status(201).json({ // respond: 201 Created is the right status for “a new resource was made”.
      message:
        "Account created. Check your email for the verification link.",
    });
  } catch (error) {
    next(error);
  }
}

// Verify the email address using the emailed token.
export async function verifyEmail(req, res, next) {
  try {
    const { token } = req.query;

    if (
      typeof token !== "string" || 
      !/^[a-f0-9]{64}$/i.test(token) // // typeof breakdown: req.query.token can be a string, string[], an object, or undefined. A request like ?token[$ne]=x becomes an object. Passing that to MongoDB is a NoSQL injection attack, and typeof blocks it. 
      // // The regex (regular expression) ^[a-f0-9]{64}$ means “exactly 64 hex characters”. ^ and $ anchor the start and end, and the i flag makes it case-insensitive. This matches exactly what randomBytes(32).toString("hex") produces.
    ) {
      return res.status(400).json({
        message: "Invalid verification token",
      });
    }

/** find the user by hash, with expiry in the query */
    const user = await User.findOne({
      emailVerificationTokenHash: hashToken(token),
      emailVerificationExpiresAt: { $gt: new Date() }, // //.......$gt is a MongoDB query operator meaning greater than. The expiry check happens inside the database query.
    }).select( 
      "+emailVerificationTokenHash +emailVerificationExpiresAt"
    ); // // .select("+field") includes fields that the schema hides by default with select: false. This is an inference from your code, so check your User model.

    if (!user) {
      return res.status(400).json({
        message: "Verification link is invalid or expired", // // If the hash is wrong, expired, or already used, you get null, and the code returns one generic message for all three cases.
      }); 
    }

/** update and make the token single-use */
    user.isEmailVerified = true;
    user.emailVerificationTokenHash = undefined;
    user.emailVerificationExpiresAt = undefined; 

    await user.save(); // // // // Setting a field to undefined makes Mongoose send a $unset operation that removes it from the document. The link cannot be reused after this.

    return res.status(200).json({
      message: "Email verified successfully. You can now log in.",
    });
  } catch (error) {
    next(error);
  }
}

/** Log in after the email has been verified. */
   // // The password hash is hidden by default so it can’t leak into other queries.
export async function login(req, res, next) {
  try {
    const { email, password } = req.validatedBody;

    const user = await User.findOne({
      email: email.toLowerCase(),
    }).select("+passwordHash"); // // find the user and include the hidden hash

    if (!user) {
      return res.status(401).json({ // // unknown email gives 401
        message: "Invalid email or password", // // // // 401 Unauthorized means authentication failed. The message is the same as for a wrong password, which is deliberate. It prevents user enumeration, where attackers learn which emails are registered from different error messages.
      });
    }

/** compare the password */
    const passwordMatches = await bcrypt.compare(
      password,
      user.passwordHash 
      // // // // bcrypt reads the salt and cost factor from the stored hash, re-hashes the submitted password with them, and compares the results. It returns a boolean.
    );

/** check verification after the password */
    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({
        message: "Please verify your email before logging in", 
          // // // // The order matters. Only someone with the correct password learns whether the email is unverified. The status is 403 Forbidden, meaning “identity known, but not allowed”.
      });
    }

/** issue the JWT */
    // // // sub (subject) is a registered claim, a standard JWT field naming who the token is about. 
    // // // user._id is a MongoDB ObjectId, so .toString() converts it to a 24-character hex string.
    // // // process.env.JWT_SECRET is the signing key, loaded from environment variables and never hardcoded.
    // // // The default algorithm is HS256 (HMAC with SHA-256).
    // // The result is a string in the form header.payload.signature, each part Base64URL-encoded.
    // // A JWT is signed, not encrypted. Anyone can read the payload but nobody can alter it without the secret, so never put sensitive data in it.
    // // The server stays stateless. It doesn’t store sessions and only verifies the signature on later requests.
    // // Only chosen fields (id, name, email, role) go back, never the whole document, so passwordHash can’t leak.
    const accessToken = jwt.sign(
      { sub: user._id.toString() }, 
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    return res.status(200).json({ // // send a safe response
      message: "Login successful",
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
}
