# AI Evolution Simulator

A React-based simulation platform for managing and evolving AI entities.

## Features

- AI Entity Management - Create, monitor and evolve AI entities
- Resource Management - Balance compute, energy and knowledge resources
- Evolution Tracking - Monitor AI development across multiple stages
- Interactive UI - Rich, responsive interface for managing your AI entities
- DALL-E Integration - Generate unique profile pictures and icons

## Technologies

- React
- TypeScript
- Material-UI
- OpenAI API (DALL-E)

## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)
- Git

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd ai-evolution-simulator
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

## Development

### Adding New AI Entities

1. Define the entity in `src/types/myais.ts`
2. Add mock data in `src/pages/MyAIsPage.tsx`
3. Generate profile picture using the profile generation script

### Modifying the Theme

Theme constants are located in `src/theme/myais.ts`. Update the values to modify the appearance of components.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License

Copyright (c) 2024 AI Evolution Simulator

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
