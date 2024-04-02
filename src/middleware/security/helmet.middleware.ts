import helmet from 'helmet';

const policy = {
    contentSecurityPolicy: {
        directives: {
            "script-src": ["'self'"],
        },
    },
}

const appSecurityHeaders = helmet(policy);

export default appSecurityHeaders;