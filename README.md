# About

This portfolio project is a demonstration of creating a NodeJs server using the popular Express framework!

The focus is on testing and security, not real user experince. I want to showcase the usage of many reccomended security considerations, with thorough integration, and unit tests to add confidence to this working implementation.

The application itself is a simple API which allows public users to view products. Registered users of particular roles are authorised to take actions like create, update, or delete products.

## Technologies and tools used

- This is a TypeScript project which outputs to standard JavaScript which the server runs off.
- Mongoose ODM in conjunction with MongoDB is used for data storage.
  - the ~production database is a cloud based Mongo db.
  - the test database is local.
- Passwords are hashed and salted with the popular Bcrypt package.
- JWT are used for client side authentication.
- Security features are discribed in more detail below.

## Testing

Testing is managed by Jest, and Supertest!

- Integration testing with Supertest allows non mocked end-to-end flow quality assurance.
- Unit testing with Jest mocks allows controllers and middleware to be tested seperately from the database or third party packages.

---

# Security Implementations

## Authentication

- Using 'bcrypt' package to salt and hash passwords.
- Using 'cookie-parser' package to sign JWTs with environment variable secret.
- Using 'jsonwebtoken' package for client side authentication.

## Authorization

- Using 'jsonwebtoken' package for refresh tokens, access tokens, and role based authorization.

## CSRF

- Using CSRF tokens to help mitigate CSRF attacks.

## CORS

- Using 'cors' package to restrict which http methods the api allows, plus forcing localhost domain only to be accepted in this usecase.

## Rate Limiting

- Using 'express-rate-limit' package to limit ip addresses to 1000 requests per day.

## Logging and Monitoring

- Using 'morgan' package for basic local logging of request data.

## Security Headers

- Using 'helmet' package to restrict resources to only come from this domain.
  - Content Security Policy (CSP).
  - X-Content-Type-Options, X-Frame-Options.
  - X-XSS-Protection.

## Input Validation

- Using 'zod' package to validate and sanitise user input against potential malicious characters ie `:;"'<>$` as well as for general validation for databse compatibility.

---

> If you want to run this you will need to clone the repo and add these constants (ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, MONGOOSE_CLOUD_CONNECTION, MONGOOSE_DEV_CONNECTION) to a .env file in the root directory. Scripts are defined in package.json!
