# About

This portfolio project is a demonstration of creating a `NodeJS` server using the popular `Express` framework!

The focus of this API project is on testing and security, not real user experince. I want to showcase the usage of many recomended security considerations, with thorough integration, and unit testing to add confidence to this working implementation.

The application itself is a simple API which allows public users to view products. Registered users of particular roles are authorised to take actions like create, update, or delete products.

Security features such as CSRF token management, refreshing of tokens, or CORS would normally be configured to work with one or more domains for a font end to consume and partly manage, but in this use case they are configured to only work with `localhost` as the fronted is out-of-scope for this project.

## Technologies and tools used

- This is a `TypeScript` project which outputs to standard JavaScript which the server runs off.
- `Mongoose` ODM in conjunction with `MongoDB` is used for data storage.
  - the ~production database is a cloud based Mongo db.
  - the test database is local.
- Passwords are hashed and salted with the popular `Bcrypt` package.
- `JWT` used for client side authentication, and authorisation.
- Security features are discribed in more detail below.

## Testing

Testing is managed by `Jest`, and `Supertest`!

- Integration testing with Supertest allows non mocked end-to-end flow testing from request > middleware > response.
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

- Using CSRF tokens to help mitigate CSRF attacks. These are generated on login and are short lived. They are required for authorization of more protected routes.

## CORS

- Using 'cors' package to restrict which http methods the api allows, and ensuring `localhost` is the only domain resources are allowed to be shared with.

## Rate Limiting

- Using 'express-rate-limit' package to limit ip addresses to 1000 requests per day. This helps mitigate DoS/DDoS, and brute force attacks.

## Logging and Monitoring

- Using 'morgan' package for local logging of server usage. Even basic logging of request activity allows monitoring of server usage!

## Security Headers

- Using 'helmet' package to restrict resources to only come from the `localhost` domain.
  - Content Security Policy (CSP).
  - X-Content-Type-Options, X-Frame-Options.
  - X-XSS-Protection.

## Input Validation

- Using 'zod' package to validate and sanitise user input against potential malicious characters ie `:;"'<>$` as well as for general validation for database compatibility.

---

> If you want to run this you will need to clone the repo and add these following constants to a .env file in the root directory. (ACCESS_TOKEN_SECRET (any string will do), REFRESH_TOKEN_SECRET(any string will do), MONGOOSE_CLOUD_CONNECTION(cloud connection uri to a real mongo db), MONGOOSE_DEV_CONNECTION(local db connection string to a real mongo db)). Scripts to run or test the application are defined in package.json!
