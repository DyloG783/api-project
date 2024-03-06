add security
Authorization: Enforce access controls to ensure that authenticated users have the appropriate permissions to access specific resources within the API. Role-based access control (RBAC) or attribute-based access control (ABAC) can be used for this purpose.

HTTPS: Always use HTTPS to encrypt data transmitted between the client and the server. This helps prevent man-in-the-middle attacks and ensures data confidentiality and integrity.

Input Validation: Validate and sanitize all input received from clients to prevent injection attacks such as SQL injection, XSS (Cross-Site Scripting), and CSRF (Cross-Site Request Forgery).

Rate Limiting: Implement rate limiting to prevent abuse of the API by limiting the number of requests that a client can make within a specific time frame. This helps protect against DoS (Denial of Service) attacks and ensures fair usage of resources.

Use of Tokens: Issue short-lived access tokens and refresh tokens for authentication, and implement token revocation mechanisms to invalidate tokens if compromised or no longer needed.

Secure Data Storage: Store sensitive data securely, using encryption and hashing techniques where necessary. Avoid storing passwords in plaintext and use strong hashing algorithms (e.g., bcrypt) for password hashing.

API Versioning: Implement versioning in the API to ensure backward compatibility and allow clients to migrate to newer versions without disruption.

Logging and Monitoring: Log API activities and monitor for suspicious behavior or unauthorized access attempts. Implement logging at various levels to track API usage, errors, and security events.

Security Headers: Utilize security headers such as Content Security Policy (CSP), X-Content-Type-Options, X-Frame-Options, and X-XSS-Protection to mitigate common web security vulnerabilities.



fix tests: stop server running after execution

convert to TS

create nice reademe

add to github + resume

---

Run JEST tests: npx jest (can't run all test suites as it tries to start server multiple times on same port)