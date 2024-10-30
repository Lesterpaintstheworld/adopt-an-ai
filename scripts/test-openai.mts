import OpenAI from 'openai';
import * as dotenv from 'dotenv';

dotenv.config();

async function testOpenAI() {
    console.log('Starting OpenAI test...');
    
    if (!process.env.OPENAI_API_KEY) {
        throw new Error('No OpenAI API key found in environment');
    }
    
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    });

    try {
        console.log('Testing OpenAI connection...');
        const models = await openai.models.list();
        console.log('Connection successful! Available models:', models.data.length);
    } catch (error) {
        console.error('OpenAI test failed:', error);
        throw error;
    }
}

// Use a proper promise chain with explicit error handling
testOpenAI()
    .then(() => {
        console.log('Test completed successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Test failed:', error);
        process.exit(1);
    });
