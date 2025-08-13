# Overview

This is a full-stack digital concierge application built for luxury hotel guest services. The application features an AI-powered chat interface that helps guests with information about amenities, services, policies, and local attractions. It includes both text and voice input capabilities, with a knowledge base system for managing hotel assets and information.

The system is designed as a modern web application with a React frontend and Express backend, using TypeScript throughout for type safety and better development experience. The project has been configured for deployment on both Replit and Vercel platforms.

## Recent Changes (Aug 13, 2025)
- ✅ Fixed voice input functionality - speech recognition now properly sends transcribed messages
- ✅ Resolved conversation display distortion with proper message alignment and avatars
- ✅ Connected suggestion buttons to chat functionality for seamless user experience
- ✅ Prepared Vercel deployment with serverless API routes in `/api/` directory
- ✅ Created comprehensive deployment documentation for Vercel platform

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite for development and build tooling
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React Query (@tanstack/react-query) for server state management and API caching
- **UI Components**: Radix UI primitives with shadcn/ui component library for consistent, accessible design
- **Styling**: Tailwind CSS with CSS variables for theming support, including dark mode capabilities
- **Voice Integration**: Web Speech API for voice input and transcription functionality

## Backend Architecture  
- **Runtime**: Node.js with Express framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful endpoints for assets, search, conversations, and chat functionality
- **File Upload**: Multer middleware for handling multipart form data
- **Development**: Hot reloading with Vite integration for seamless full-stack development

## Data Storage Solutions
- **Database**: PostgreSQL configured with Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for database migrations and schema synchronization
- **Connection**: Neon serverless PostgreSQL adapter for cloud database connectivity
- **Fallback Storage**: In-memory storage implementation for development/testing scenarios

## Authentication and Authorization
- **Session Management**: PostgreSQL-based session storage using connect-pg-simple
- **User Schema**: Basic username/password authentication system with unique constraints
- Currently implements foundational user management structure

## API Structure
The application exposes several key endpoints:
- `/api/assets` - Retrieve all assets grouped by category
- `/api/assets/search` - Search functionality across asset content and metadata  
- `/api/chat` - AI-powered conversation handling with open-source AI service integration
- File upload endpoints for asset management

The API uses consistent error handling middleware and request/response logging for debugging and monitoring.

## Design Patterns
- **Component Composition**: React components built with composition patterns using Radix UI Slot
- **Custom Hooks**: Reusable logic encapsulated in custom hooks (useConversation, useSpeech, useToast)
- **Type Safety**: Shared TypeScript schemas between frontend and backend using Zod validation
- **Responsive Design**: Mobile-first approach with collapsible sidebar and adaptive layouts
- **Accessibility**: ARIA labels and keyboard navigation support throughout the interface

# External Dependencies

## AI Services  
- **Open-Source AI Service**: Custom lightweight AI service with pattern matching and rule-based responses
- Structured response format supporting both text and visual card content
- Placeholder for audio transcription (ready for Whisper.cpp or similar open-source models)
- **Lightweight Vector Store**: JSON-based TF-IDF vector store for semantic search and asset retrieval

## Database Services  
- **Neon**: Serverless PostgreSQL hosting for production database needs
- Drizzle ORM for type-safe database operations and query building
- PostgreSQL-compatible session storage for user authentication

## UI and Styling
- **Radix UI**: Comprehensive primitive component library for accessible UI elements
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **Lucide React**: Icon library for consistent iconography
- **Font Awesome**: Additional icon support for asset categorization

## Development Tools
- **Vite**: Modern build tool with hot module replacement and TypeScript support
- **Replit Integration**: Development environment plugins for runtime error handling
- React Query for efficient server state management and caching strategies

## Speech and Audio
- **Web Speech API**: Browser-native speech recognition for voice input functionality
- **React Hook Form**: Form validation and management with Zod schema integration
- Date-fns for timestamp formatting and date manipulation utilities