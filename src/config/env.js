require('dotenv').config();

module.exports = {
    PORT: process.env.PORT || 3000,
    RETELL_API_KEY: process.env.RETELL_API_KEY,
    RETELL_PHONE_NUMBER: process.env.RETELL_PHONE_NUMBER
};
