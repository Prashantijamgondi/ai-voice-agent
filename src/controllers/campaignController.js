const retellService = require('../services/retellService');

// In a real application, you would import a Database ORM here
// const db = require('../db');

/**
 * HTTP POST /api/campaign/dispatch
 * Receives CRM webhook payload and initiates an automated call.
 */
async function triggerOutboundCall(req, res) {
    try {
        const { customerName, customerPhone } = req.body;
        
        if (!customerName || !customerPhone) {
            return res.status(400).json({ error: "Missing required fields: customerName and customerPhone" });
        }
        
        console.log(`[API] Received request to call ${customerName} at ${customerPhone}`);
        
        const callResponse = await retellService.dispatchCall(customerName, customerPhone);
        
        // Mock saving call to database mapping
        // await db.Calls.create({ customerPhone, callId: callResponse.call_id, status: 'initiated' });

        return res.status(200).json({ 
            success: true, 
            message: "Call successfully dispatched.",
            callId: callResponse.call_id 
        });
        
    } catch (error) {
        console.error("[API Error] Failed to dispatch call:", error);
        return res.status(500).json({ error: "Failed to dispatch call", details: error.message });
    }
}

/**
 * HTTP POST /api/webhooks/retell
 * Captures call transcripts and analysis from Retell when a call ends.
 */
async function handleRetellWebhook(req, res) {
    try {
        const payload = req.body;
        
        // NOTE: In production, verify the webhook signature here to ensure it came from Retell AI.
        
        if (payload.event === 'call_analyzed') {
            const callData = payload.call;
            
            console.log(`\n[Webhook] Call Completed! ID: ${callData.call_id}`);
            console.log(`Duration: ${callData.duration_ms / 1000}s | Reason: ${callData.disconnection_reason}`);
            
            // Log Transcript
            console.log("--- FINAL TRANSCRIPT ---");
            console.log(callData.transcript);
            console.log("------------------------\n");

            // Mock saving transcript to Database
            // await db.Calls.update(
            //    { transcript: callData.transcript, status: 'completed' },
            //    { where: { callId: callData.call_id } }
            // );
        }

        // Always acknowledge webhooks quickly
        return res.status(200).send('Webhook processed');
    } catch (error) {
        console.error("[Webhook Error]:", error);
        return res.status(500).send('Webhook error');
    }
}

module.exports = { triggerOutboundCall, handleRetellWebhook };
