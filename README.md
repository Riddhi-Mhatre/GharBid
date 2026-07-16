# GharBid – Real Estate Marketplace & Auction Platform

## Overview

GharBid is a cloud-based real estate marketplace that allows users to buy, sell, and auction properties online. The platform provides secure property listings, legal document management, real-time bidding, location-based property search, and direct communication between buyers and sellers.

## Problem Statement

Traditional property transactions often involve multiple intermediaries, limited transparency, and inefficient communication. GharBid aims to simplify the process by providing a centralized digital platform for property discovery, auctions, document sharing, and buyer-seller interaction.

## Key Features

### Buyer Features

* User registration and authentication
* Browse and search properties
* View property details and legal documents
* Participate in live property auctions
* Real-time bid updates
* Chat with sellers
* Track purchased properties

### Seller Features

* List properties for sale or auction
* Upload property images and legal documents
* Manage property listings
* View auction status and bids
* Communicate with interested buyers
* Track sold properties

### Auction System

* Real-time bidding using WebSockets
* Automatic highest bid tracking
* Live auction updates
* Auction winner determination

### Additional Features

* Responsive mobile-friendly design
* Property location mapping
* Notifications and alerts
* User profile management
* Secure document storage

## Technology Stack

### Frontend

* React.js
* TypeScript
* Vite
* Tailwind CSS
* shadcn/ui
* React Router
* TanStack Query
* Axios

### Backend

* Node.js
* Express.js
* TypeScript
* JWT Authentication
* Socket.io

### Database

* Amazon DynamoDB


### Screenshot

* Landing Page
<img width="1920" height="1096" alt="image" src="https://github.com/user-attachments/assets/947c0946-c526-4412-9333-75f5ed7d8260" />


* Login Page
<img width="1920" height="1083" alt="image" src="https://github.com/user-attachments/assets/452dbed9-e3b8-4798-ad75-ad0dfdac9b04" />


* Buyer Dashboard
<img width="1920" height="1095" alt="image" src="https://github.com/user-attachments/assets/f7cec597-db21-44bf-ab9d-c30bcaf9fdce" />


* Properties View and details
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/555b510a-8f4c-479a-a5ff-7b217e2fe018" />

<img width="1920" height="1077" alt="image" src="https://github.com/user-attachments/assets/4b63bc30-3d1d-4e5b-b402-00cdf4dc2d1b" />

<img width="1920" height="1075" alt="image" src="https://github.com/user-attachments/assets/8e7828bb-e4f3-41cd-b501-60f421ed503c" />


* Seller Dashboard
<img width="1920" height="1075" alt="image" src="https://github.com/user-attachments/assets/0a6e5e4b-8475-4df5-a54b-95febbac3f8b" />


* Chats
<img width="1920" height="1092" alt="image" src="https://github.com/user-attachments/assets/d5166500-ede7-442e-ace2-627842cdf15c" />


* Live Auction
<img width="1920" height="1075" alt="image" src="https://github.com/user-attachments/assets/b3415010-d520-4dcb-90fe-71a6b5d0c124" />

<img width="1917" height="1077" alt="image" src="https://github.com/user-attachments/assets/e456557a-ff1f-4d86-8a5c-abaaac003350" />

<img width="1917" height="1087" alt="image" src="https://github.com/user-attachments/assets/d3140a44-fa17-49da-af39-3a9dae0cb689" />


* Mobile View
<img width="491" height="917" alt="image" src="https://github.com/user-attachments/assets/773d3e90-db81-421e-8807-58aed59ff3c9" />
<img width="496" height="915" alt="image" src="https://github.com/user-attachments/assets/9b1a3678-e03b-4572-b49b-47e08eed40d2" />

<img width="480" height="896" alt="image" src="https://github.com/user-attachments/assets/1a4d6446-3ff8-4ca5-a0d0-017b8b6c6a4f" />
<img width="492" height="922" alt="image" src="https://github.com/user-attachments/assets/5b16c931-b19a-4e24-ad10-dd7637a7b1bb" />


### AWS Services

* Amazon Cognito
* Amazon S3
* Amazon DynamoDB
* Amazon SNS
* AWS Location Service
* AWS Elastic Beanstalk
* AWS Amplify
* AWS Route 53
* AWS Certificate Manager (ACM)
* AWS CodePipeline
* Elastic Load Balancer

## Architecture

Frontend (AWS Amplify)
↓
Load Balancer
↓
Backend (AWS Elastic Beanstalk)
↓
DynamoDB / S3 / Cognito / SNS / AWS Location Service

<img width="1536" height="1024" alt="image" src="https://github.com/user-attachments/assets/00bf3598-75f1-40fa-b4eb-b77d6a536ff7" />


## Project Structure

```text
frontend/
backend/
```

## Installation

### Clone Repository

```bash
git clone 
cd gharbid
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Backend Setup

```bash
cd backend
npm install
npm nodemon server.js
```


## Future Enhancements

* AI-powered property recommendations
* Advanced property analytics
* Online agreement generation
* Integrated payment gateway
* Mobile application
* Virtual property tours
* Enhanced fraud detection

## Team Members

* Riddhi Mhatre
* Leena Harad
* Nidhi Jadhav

## License

This project was developed for educational and academic purposes.
