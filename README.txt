Security Implementations:

Authentication: 
- Using 'bcrypt' package to salt and hash passwords.
- Using 'cookie-parser' package to sign JWTs with environment variable secret.
- Using 'jsonwebtoken' package for client side authentication.

Authorization: 
- Using 'jsonwebtoken' package for refresh tokens and access tokens which the latter are used to authorize protected routes.
- Using 'jsonwebtoken' package for role based authorization.

Input Validation: Validate and sanitize all input received from clients to prevent injection attacks such as SQL injection, XSS (Cross-Site Scripting), and CSRF (Cross-Site Request Forgery).

CSRF: 

CORS: 
Using 'cors' package to restrict which http methods the api allows

Rate Limiting: 
Using 'express-rate-limit' package to limit ip addresses to 1000 requests per day

Logging and Monitoring: 
Using 'Morgan' package for logging request data

Security Headers: Utilize security headers such as Content Security Policy (CSP), X-Content-Type-Options, X-Frame-Options, and X-XSS-Protection to mitigate common web security vulnerabilities.

--

fix tests: stop server running after execution
    - get logout test working

convert to TS

create nice reademe

add to github + resume

---

