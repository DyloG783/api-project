import cors from 'cors';

const corsOptions = {
    origin: "http:localhost:3000",
    methods: ["GET", "PUT", "POST", "Delete"]
}

const appCors = cors(corsOptions);

export default appCors;