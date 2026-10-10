const { Retell } = require('retell-sdk');
const { RETELL_API_KEY, RETELL_PHONE_NUMBER } = require('../config/env');
const { generatePrompt } = require('./promptService');

const retell = new Retell({ apiKey: RETELL_API_KEY });

/**
 * Provisions a dynamic LLM and Agent, and dispatches a phone call to the customer.
 */
async function dispatchCall(customerName, customerPhone) {
    if (!RETELL_API_KEY) throw new Error("RETELL_API_KEY is missing from environment variables.");
    
    // 1. Generate customized prompt
    const prompt = generatePrompt(customerName, "Priya", "Female");

    // 2. Provision Managed LLM 
    const llm = await retell.llm.create({
        model: "gpt-4o",
        general_prompt: prompt,
        model_temperature: 0.1 // Strict adherence to instructions
    });

    // 3. Create the Voice Agent
    const agent = await retell.agent.create({
        llm_websocket_url: llm.llm_websocket_url,
        agent_name: "Home Credit LAP Agent",
        voice_id: "11labs-Rachel", // Professional female voice
        language: "en-IN",         // Indian English
        ambient_sound: "office"
    });

    // 4. Fire the outbound call
    const call = await retell.call.createPhoneCall({
        from_number: RETELL_PHONE_NUMBER,
        to_number: customerPhone,
        agent_id: agent.agent_id
    });

    return call;
}

module.exports = { dispatchCall };
