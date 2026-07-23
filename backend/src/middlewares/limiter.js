import rateLimit from "express-rate-limit";

const limiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    maxHeight: 100,
    message: {
        status: 429,
        error: "Too many request"
    }
})

export default limiter;