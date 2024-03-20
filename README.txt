Security Implementations:

Authentication: 
- Using 'bcrypt' package to salt and hash passwords.
- Using 'cookie-parser' package to sign JWTs with environment variable secret.
- Using 'jsonwebtoken' package for client side authentication.

Authorization: add roles for higher routes. Enforce access controls to ensure that authenticated users have the appropriate permissions to access specific resources within the API. Role-based access control (RBAC) or attribute-based access control (ABAC) can be used for this purpose.

Input Validation: Validate and sanitize all input received from clients to prevent injection attacks such as SQL injection, XSS (Cross-Site Scripting), and CSRF (Cross-Site Request Forgery).

CSRF: 

CORS: 
Using 'cors' package to restrict which http methods the api allows

Rate Limiting: 
Using 'express-rate-limit' package to limit ip addresses to 1000 requests per day

Use of Tokens: Issue short-lived access tokens and refresh tokens for authentication, and implement token revocation mechanisms to invalidate tokens if compromised or no longer needed.

Logging and Monitoring: 
Using 'Morgan' package for logging request data

Security Headers: Utilize security headers such as Content Security Policy (CSP), X-Content-Type-Options, X-Frame-Options, and X-XSS-Protection to mitigate common web security vulnerabilities.

--

fix tests: stop server running after execution

convert to TS

create nice reademe

host free Vercel

add to github + resume

---

Run JEST tests: npx jest [filename] (can't run all test suites as it tries to start server multiple times on same port)


https://www.youtube.com/watch?v=favjC6EKFgw&list=PL0Zuz27SZ-6P4vnjQ_PJ5iRYsqJkQhtUu&index=6 (33:38)

Why am I not geting:  const authHeader = req.headers['authorization']; tuts all have this seemingly set by default