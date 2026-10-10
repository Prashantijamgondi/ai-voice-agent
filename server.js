const app = require('./src/app');
const { PORT } = require('./src/config/env');

app.listen(PORT, () => {
    console.log(`🚀 Production REST API Server running on port ${PORT}`);
    console.log(`\nAvailable Endpoints:`);
    console.log(`🟢 POST /api/campaign/dispatch  (Trigger outbound calls)`);
    console.log(`🟢 POST /api/webhooks/retell    (Receive call transcripts)`);
    console.log(`🟢 GET  /api/health             (Health check)`);
});
