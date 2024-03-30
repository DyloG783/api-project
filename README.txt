Security Implementations:

Authentication: 
- Using 'bcrypt' package to salt and hash passwords.
- Using 'cookie-parser' package to sign JWTs with environment variable secret.
- Using 'jsonwebtoken' package for client side authentication.

Authorization: 
- Using 'jsonwebtoken' package for refresh tokens, access tokens, and role based authorization.

Input Validation: Validate and sanitize all input received from clients to prevent injection attacks such as SQL injection, XSS (Cross-Site Scripting), and CSRF (Cross-Site Request Forgery).

CSRF: 
- Using CSRF tokens

CORS: 
Using 'cors' package to restrict which http methods the api allows, plus forcing localhost domain only to be accepted.

Rate Limiting: 
Using 'express-rate-limit' package to limit ip addresses to 1000 requests per day.

Logging and Monitoring: 
Using 'Morgan' package for logging request data.

Security Headers: Utilize security headers such as Content Security Policy (CSP), X-Content-Type-Options, X-Frame-Options, and X-XSS-Protection to mitigate common web security vulnerabilities.

--

fix tests: stop server running after execution

convert to TS

create nice reademe

add to github + resume

---

expand integration tests

- add csrf middleware to all routes in main app.js
- how to move csrf middleware out of auth controller?
    - try move csrf token to main app and export to be used in middleware???


unit test middle ware
only happy path controller tests...

unit test;
- controllers (mock db?)
- routes (mock controllers)?
