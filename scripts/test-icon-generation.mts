import fs from 'fs/promises';
import path from 'path';
import yaml from 'js-yaml';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import { fileURLToPath } from 'url';

// Initialize environment variables
dotenv.config();

// Basic type definitions
type Perk = {
  name: string;
  tag: string;
  description: string;
  shortDescription?: string;
  longDescription?: string;
};

async function testFileSystem() {
    console.log('\n=== Testing File System ===');
    try {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        console.log('Current directory:', __dirname);
        
        const testDir = path.join(process.cwd(), 'test-icons');
        console.log('Creating test directory:', testDir);
        await fs.mkdir(testDir, { recursive: true });
        console.log('Directory created successfully');
        
        await fs.writeFile(path.join(testDir, 'test.txt'), 'test');
        console.log('Test file written successfully');
        
        await fs.unlink(path.join(testDir, 'test.txt'));
        await fs.rmdir(testDir);
        console.log('Cleanup successful');
        
        return true;
    } catch (error) {
        console.error('File system test failed:', error);
        return false;
    }
}

async function testYamlParsing() {
    console.log('\n=== Testing YAML Parsing ===');
    try {
        const testYaml = `
test:
  name: "Test"
  description: "Test description"
  items:
    - name: "Item 1"
      tag: "TEST"
      description: "Test item"
`;
        const parsed = yaml.load(testYaml);
        console.log('YAML parsing successful:', parsed);
        return true;
    } catch (error) {
        console.error('YAML parsing test failed:', error);
        return false;
    }
}

async function testOpenAI() {
    console.log('\n=== Testing OpenAI Connection ===');
    try {
        if (!process.env.OPENAI_API_KEY) {
            throw new Error('OPENAI_API_KEY not found in environment');
        }
        console.log('API Key found');
        
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
        
        console.log('Testing API connection...');
        const models = await openai.models.list();
        console.log('OpenAI connection successful, available models:', models.data.length);
        
        return true;
    } catch (error) {
        console.error('OpenAI test failed:', error);
        return false;
    }
}

async function testTechTreeReading() {
    console.log('\n=== Testing Tech Tree Reading ===');
    try {
        const techTreePath = path.join(process.cwd(), 'content', 'tech', 'tech-tree.yml');
        console.log('Reading tech tree from:', techTreePath);
        
        const content = await fs.readFile(techTreePath, 'utf8');
        console.log('File read successful, content length:', content.length);
        
        const parsed = yaml.load(content);
        console.log('YAML parsing successful');
        console.log('Found phases:', Object.keys(parsed));
        
        return true;
    } catch (error) {
        console.error('Tech tree reading test failed:', error);
        return false;
    }
}

async function testImageGeneration() {
    console.log('\n=== Testing Image Generation ===');
    try {
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
        
        const testPerk: Perk = {
            name: "Test Perk",
            tag: "🔧 TECHNICAL",
            description: "A test perk for validation"
        };
        
        console.log('Generating test image...');
        const response = await openai.images.generate({
            model: "dall-e-3",
            prompt: "A simple test icon in World of Warcraft style",
            n: 1,
            size: "1024x1024",
            response_format: "b64_json"
        });
        
        if (response.data[0].b64_json) {
            console.log('Image generation successful');
            return true;
        } else {
            throw new Error('No image data received');
        }
    } catch (error) {
        console.error('Image generation test failed:', error);
        return false;
    }
}

// Run all tests
async function runAllTests() {
    console.log('Starting component tests...');
    
    const results = {
        fileSystem: await testFileSystem(),
        yamlParsing: await testYamlParsing(),
        openAI: await testOpenAI(),
        techTree: await testTechTreeReading(),
        imageGeneration: await testImageGeneration()
    };
    
    console.log('\n=== Test Results ===');
    Object.entries(results).forEach(([test, passed]) => {
        console.log(`${test}: ${passed ? '✅ PASSED' : '❌ FAILED'}`);
    });
    
    if (Object.values(results).every(result => result)) {
        console.log('\nAll tests passed successfully! ✨');
    } else {
        console.log('\nSome tests failed. Please check the logs above. ⚠️');
    }
}

// Execute tests with proper error handling
runAllTests().catch(error => {
    console.error('Fatal error during testing:', error);
    process.exit(1);
});
