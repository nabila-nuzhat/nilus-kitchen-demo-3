/** 
 * the authentication controller will read req.validatedBody, which contains the validated and trimmed input, instead of trusting raw request data.
 * 
 * Creates middleware that validates request body data using a Zod schema.
 * @param {import("zod").ZodType} schema - The Zod schema used to validate req.body.
 * @returns {(req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => void}
 * 
 *  Express middleware that returns a 400 response if validation fails,
 * or attaches the validated data to req.validatedBody and calls next().
 * ----------------------------------------------------
 * @param, @returns appears in comment autometically. we can choose to use this JSDoc comment. It explains what schema is and what the validate() function returns.
 * ---------------------------------------------
 * ---------------------------------------------
 * SPECIAL NOTE: Claude Summmary:
 * Zod works differently. It checks the whole body against a schema and can find many problems at once, returning them as an array of issue objects (result.error.issues). Because the result is an array with extra internal details, you need some way to turn it into a response. .map and .join are that step.
 * 
 * extra code of using "map", "join" buys:
    A clean response shape. Without .map, you would send Zod’s raw issue objects (with code, minimum, validation, and so on) to the client. That is noisy and exposes library internals.
    Field-level errors. A form can show “Title is required” under the title input, and “Invalid email” under the email input.
    Reuse. It is written once in the shared middleware, so no route repeats it.

 * 
 * dashboard form can then highlight the exact row and input that is wrong, instead of showing one vague error. .map produces all of these errors in one response, so the owner can fix everything in one go.
 * 
If your front end only shows a single error message, none of the field mapping is needed.


 */
export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({ // look for simpler version
        message: "Validation failed",
        errors: result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    req.validatedBody = result.data;

    next();
  };
}
