# LegalNest (GharBid) Project Summary

## 1. Project Overview
LegalNest (also referenced as GharBid in the frontend) is a comprehensive real estate bidding and property management platform. It facilitates interactions between property sellers and buyers through live auctions, direct inquiries, real-time chat, and deal management. The application uses a modern tech stack featuring a React-based frontend and a Node.js/Express backend, heavily integrated with AWS services for authentication, database, storage, and notifications. It also integrates Razorpay for payment processing.

## 2. Technology Stack
**Backend**:
- **Framework**: Node.js with Express.js
- **Database**: AWS DynamoDB
- **Authentication**: AWS Cognito, JWT
- **Storage & Services**: AWS S3 (for documents/images), AWS Location Service, AWS SNS
- **Payment Processing**: Razorpay
- **Real-Time**: Socket.io for live auctions and chat
- **Validation**: Zod
- **Other**: Winston (logging), Express Rate Limit, Helmet

**Frontend**:
- **Framework**: React 18, Vite, TypeScript
- **State Management**: Zustand, React Query (`@tanstack/react-query`)
- **Styling & UI**: Tailwind CSS, ShadCN UI (Radix UI), Lucide React
- **Map & Location**: MapLibre GL
- **Routing**: React Router DOM
- **Forms & Validation**: React Hook Form, Zod
- **Real-Time**: `socket.io-client`

## 3. Implemented Services & Core Features

### Backend Services (`backend/src/services`)
- **`auctionEngine.js`**: Core logic for managing live property auctions, bid validation, and timer countdowns.
- **`buyerService.js`**: Business logic for handling buyer-specific actions (e.g., retrieving saved properties, bids, and purchases).
- **`buyerNotificationService.js` & `notificationService.js`**: Handles push/email/SMS notifications using AWS SNS or sockets.
- **`chatService.js`**: Manages real-time messaging and deal negotiations between buyers and sellers.
- **`cognitoService.js`**: Integrates with AWS Cognito for user registration, login, and token verification.
- **`dynamoService.js`**: Abstraction layer for interacting with AWS DynamoDB tables.
- **`locationService.js`**: Uses AWS Location Service to provide geocoding and map-related functionalities.
- **`razorpayService.js`**: Integrates Razorpay API for handling transactions and payments securely.
- **`s3Service.js`**: Handles secure uploads of property images and user legal documents to AWS S3.

### Frontend Services (`frontend/src/services`)
- **`api.ts`**: Base Axios instance configured with interceptors for authentication.
- **`auctionService.ts`**: API calls related to fetching auction data, placing bids, and history.
- **`authService.ts`**: Functions for user sign-up, sign-in, token refresh, and Cognito integration.
- **`chatService.ts`**: API calls for fetching chat history, initiating chats, and scheduling meetings.
- **`inquiryService.ts`**: Service to handle property inquiries from buyers to sellers.
- **`paymentService.ts`**: API calls related to payment processing and Razorpay integration.
- **`propertyService.ts`**: Endpoints for CRUD operations on properties, filtering, and searching.
- **`sellerService.ts`**: Specific endpoints for sellers to manage properties, view auction dashboards, and handle documents.
- **`userService.ts`**: API calls for user profile management.

## 4. File Structure

### Backend File Structure
```text
backend/src/
├── app.js
├── server.js
├── config/              # AWS, Database, Redis, Env configuration
├── controllers/         # Request handlers (Auction, Auth, Buyer, Chat, Inquiry, Payment, Property, Seller, User)
├── middleware/          # Auth, RBAC, Error Handler, Rate Limit, Validation
├── models/
│   └── dynamodb/        # DB Models (Auction, Bid, Inquiry, Payment, Property, Purchase, SavedProperties, Transaction, UserDocs, User)
├── routes/
│   └── v1/              # API Route definitions (includes payment.routes.js)
├── services/            # Core business logic & AWS/Razorpay integrations (see section 3)
├── utils/               # Constants, Helpers, JWT utilities, Logger
├── validators/          # Zod validation schemas
└── websocket/           # Socket.io server, authentication, and event handlers
```

### Frontend File Structure
```text
frontend/src/
├── App.tsx
├── main.tsx
├── components/          # Reusable UI components
│   ├── auctions/        # AuctionCard, BidHistory, BidPanel, CountdownTimer, Leaderboard
│   ├── chat/            # ChatWindow, DealSystemCard, MeetingRequest, MessageBubble
│   ├── common/          # ErrorBoundary, Loader, Navbar, PrivateRoute, SearchBar
│   ├── layout/          # Buyer/Seller Layouts, Sidebars, Navbar, Footer
│   └── properties/      # PropertyCard, PropertyGrid, PropertyMap, ImageGallery
├── features/            # Feature-specific pages grouped by role
│   ├── buyer/           # Buyer Dashboard, Auctions, Bids, Saved Properties, Profile
│   └── seller/          # Seller Dashboard, Property Management, Document Upload, Identity Docs
├── hooks/               # Custom React hooks (useAuth, useSocket, useGeolocation)
├── pages/               # Top-level pages (Landing, Login, Register, Verify, AuctionRoom)
├── services/            # API interaction layer (includes paymentService.ts, see section 3)
├── store/               # Zustand global state (auth, auction, chat, filters)
├── styles/              # Global CSS (Tailwind)
├── types/               # TypeScript interfaces and type definitions
└── utils/               # Formatters, Validators, Socket initialization, Geohash helpers
```
