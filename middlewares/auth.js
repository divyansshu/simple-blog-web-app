const { validateToken } = require("../services/authentication");

function checkForAuthentication(cookieName) {
    return function(req, res, next) {
        const tokenCookieValue = req.cookies[cookieName];
        if(!tokenCookieValue) {
           return next();
        }

        try {
            const userPayload = validateToken(tokenCookieValue);
            req.user = userPayload;
            return next();
        } catch (error) {
            console.log("Token validation error:", error);
            return next();
            
        }
    }

}

module.exports = {checkForAuthentication};