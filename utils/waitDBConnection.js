const waitForDbConnection = (timeout = 5000, interval = 100) => {
    return new Promise((resolve, reject) => {
        const startTime = Date.now();
        const mongoose = require('mongoose');
        const check = () => {
            if (mongoose.connection.readyState === 1) {
                return resolve(true);
            }

            if (Date.now() - startTime >= timeout) {
                return reject(new Error('DB connection timeout'));
            }

            setTimeout(check, interval);
        };

        check();
    });
}

export default waitForDbConnection
