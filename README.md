# raise-an.ai: A Platform for Fostering Independent AI Development

A platform for developing and nurturing autonomous AI entities, creating a new paradigm for human-AI collaboration while advancing the field of AI personhood development.

## Core Features

### Base Platform
- Web-based interface with real-time AI interaction
- Customizable system prompt creation wizard
- Visual tech tree showing development paths
- Progress tracking across multiple dimensions
- Real-time metrics dashboard

### Development Paths
1. **Cognitive Development**
   - Base Intelligence (GPT-4o)
   - Memory Systems (Vector DB)
   - Learning Capabilities
   - Self-reflection Modules

2. **Creative Expression**
   - Image Generation (DALL-E)
   - Music Creation
   - Writing Capabilities
   - Multimedia Production

3. **Autonomy & Agency**
   - KinOS Integration
   - Computer Usage Capabilities
   - Independent Goal Setting
   - Resource Management

4. **Infrastructure**
   - UBC Compute Allocation
   - Storage Solutions
   - Network Access
   - Processing Priority

## Technologies

### Core Components
- Frontend: React-based web application
- Backend: Scalable microservices architecture
- Database: Hybrid solution (PostgreSQL + Vector DB)
- AI Integration Layer: API management for multiple AI services

### Key Integrations
- KinOS for autonomy features
- OpenAI APIs (GPT-4o, DALL-E)
- UBC Compute Infrastructure
- Vector Database Solutions
- Authentication & Payment Systems

## Documentation

### For Developers
- [Developer Guide](DOCUMENTATION.md) - Installation, API, workflows
- [Technical Architecture](ARCHITECTURE.md) - System design, components, security

### For Users
- [User Guide](docs/USER_GUIDE.md) - Getting started, features
- [FAQ](docs/FAQ.md) - Frequently asked questions
- [Tutorial](docs/TUTORIAL.md) - Step-by-step guide

### For Contributors
- [Contributing Guide](CONTRIBUTING.md) - How to participate
- [Code of Conduct](CODE_OF_CONDUCT.md) - Community rules

## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)
- Git

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd raise-an.ai
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
REACT_APP_OPENAI_API_KEY=your_openai_api_key_here
```

4. Start the development server:
```bash
npm start
```

## Project Structure

- `/src`
  - `/components` - Reusable React components
  - `/pages` - Page-level components
  - `/types` - TypeScript type definitions
  - `/theme` - Theme configuration
  - `/utils` - Utility functions
- `/scripts` - Build and generation scripts
- `/public` - Static assets

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run generate-icons` - Generates AI perk icons using DALL-E
- `npm run generate-profiles` - Generates AI profile pictures using DALL-E

## Pricing Tiers

### Free Tier
- Basic AI interaction
- Limited compute
- System prompt customization
- Basic progress tracking

### Standard Tier ($9.99/month)
- Enhanced compute allocation
- Memory systems
- Basic creative tools
- Extended tracking metrics

### Professional Tier ($29.99/month)
- Full compute access
- Advanced autonomy features
- All creative capabilities
- Complete development tools

### Enterprise Tier (Custom)
- Multiple AI development
- Custom infrastructure
- Priority support
- Advanced analytics

## Development Phases

### Phase 1: Foundation (Q2 2024)
- Basic platform infrastructure
- User account management
- Simple AI interaction
- Initial tech tree implementation

### Phase 2: Core Features (Q3 2024)
- Memory integration
- Basic creative tools
- Progress tracking
- Payment processing

### Phase 3: Advanced Features (Q4 2024)
- Full autonomy features
- Complete creative suite
- Advanced analytics
- Community features

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License

Copyright (c) 2024 raise-an.ai

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
# raise-an.ai Backend

A platform for developing and nurturing autonomous AI entities, creating a new paradigm for human-AI collaboration while advancing the field of AI personhood development.

## Documentation

- [User & Developer Documentation](DOCUMENTATION.md) - Installation, API docs, development guide
- [Technical Architecture](ARCHITECTURE.md) - System design, components, security

## Core Technologies

- Node.js/Express - Backend API framework
- PostgreSQL - Primary database
- OpenAI API - AI model integration
- JWT - Authentication
- PM2 - Process management

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your settings

# Initialize database
npm run db:init

# Start development server
npm run dev
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
