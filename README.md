# About

This portfolio project is a demonstration of creating a NodeJs server using the popular Express framework!

The focus is on testing and security, not real user experince. The application is a simple API which allows public users to view products. Registered users of particular roles are authorised to take actions like create, update, or delete products.

- TS running off built output
- Integration aand Unit testing with Mocks in jsonwebtoken
- basic application but with a focus on security, and testing.

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

- Using 'helmet' package to restrict resources to only come from this domain

  - Content Security Policy (CSP)
  - X-Content-Type-Options, X-Frame-Options
  - X-XSS-Protection

- Input Validation
  - Using 'zod' package to validate and sanitise user input against potential malicious characters ie `:;"'<>$`.

---

create nice reademe

add to github + resume
