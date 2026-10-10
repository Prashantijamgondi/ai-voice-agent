const express = require('express');
const cors = require('cors');
const { triggerOutboundCall, handleRetellWebhook } = require('./controllers/campaignController');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes

// 1. CRM Integration Endpoint (Trigger Calls via POST)
app.post('/api/campaign/dispatch', triggerOutboundCall);

// 2. Webhook Endpoint for Retell AI
app.post('/api/webhooks/retell', handleRetellWebhook);

// Health Check
app.get('/api/health', (req, res) => res.status(200).json({ status: 'ok' }));

module.exports = app;
