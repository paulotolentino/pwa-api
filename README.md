# Backend API with Express

This project is a backend API built with Node.js and Express. It uses Node.js version 20. Using other versions may result in unexpected behavior.

## Prerequisites

- Node.js v20
- npm (Node Package Manager)

## Getting Started

Follow the instructions below to set up and run the project.

### 1. Install Dependencies

First, install the necessary dependencies. Open your terminal and run:

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the root directory of the project. Use the `.env.example` file as a reference for the required environment variables.

### 3. Generate VAPID Keys

To generate VAPID keys for push notifications, run the following command in the terminal:

```bash
npx web-push generate-vapid-keys
```

This will generate a pair of public and private VAPID keys. Add them to your `.env` file.

### 4. Running the Server

With all dependencies installed and the `.env` file configured, you can run the project using either of the following methods:

#### Option 1: Development Mode (with Nodemon)

Run the server in development mode using Nodemon, which will automatically restart the server when a file is saved. Execute the following command in the terminal:

```bash
npm run start:dev
```

#### Option 2: Production Mode (with Node)

Alternatively, run the server using Node. This is suitable for production environments. Execute the following command in the terminal:

```bash
npm start
```

## Available Routes

The API provides the following routes:

### 1. GET `/push/get-vapid-public-key`

- **Description**: Retrieves the public VAPID key.
- **Response**: Returns the public key required for push notifications.

### 2. POST `/push/subscribe`

- **Description**: Subscribes a device to receive push notifications.
- **Request Body**: The body should contain a `subscription` object generated by the device.
- **Response**: Confirms the subscription.

### 3. POST `/push/send-notification-to-list`

- **Description**: Sends a notification to a specific list of subscriptions.
- **Request Body**: An object containing `subscriptionList` (an array of subscriptions), `title`, and `body` of the notification.
  ```json
  {
    "subscriptionList": [...],
    "title": "Notification Title",
    "body": "Notification Body"
  }
  ```
- **Response**: Sends the notification to all provided subscriptions.

### 4. POST `/push/broadcast`

- **Description**: Sends a broadcast notification to all subscriptions saved in memory.
- **Request Body**: An object containing `title` and `body` of the notification.
  ```json
  {
    "title": "Broadcast Title",
    "body": "Broadcast Body"
  }
  ```
- **Response**: Sends the notification to all saved subscriptions.
