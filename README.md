# PayBack - Expense Management Application

PayBack is a powerful and user-friendly web and mobile application designed to simplify expense tracking for groups and individuals. Whether you're sharing rent, splitting a dinner bill, or managing travel costs with friends, PayBack provides an easy way to keep track of who owes what, ensuring everyone is on the same page.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Mobile App (React Native)](#mobile-app-react-native)
- [Contributing](#contributing)


## Features

- **User Authentication**: Secure sign-up and login for users using JWT tokens.
- **Group Expense Management**: Create groups for tracking shared expenses. Each group can have multiple members.
- **Expense Tracking**: Add expenses to the group, specifying the amount, description, and who paid. 
- **Automatic Expense Splitting**: PayBack automatically calculates how much each user owes or is owed based on expenses added.
- **Real-Time Balances**: View a real-time dashboard showing the balance for each group member.
- **Debt Reconciliation**: Easily see who owes whom and how much. PayBack also provides suggestions for clearing debts.
- **Expense Categories**: Organize expenses into categories (e.g., Food, Transport, Accommodation) for easy tracking and reporting.
- **Expense History**: View and manage all previous expenses added to the group.
- **Multi-Device Support**: A web interface for the main application and a mobile app built with React Native for on-the-go usage.
- **Reporting**: Generate downloadable reports in CSV format, summarizing expenses and balances for each user.

## Technologies Used

- **Frontend (Web)**:
  - **React**: Used for building the user interface of the web application.
  - **React Router**: Manages navigation within the web app.
  - **Axios**: For making API requests to the backend.
  - **Redux**: For managing the application state, particularly user authentication and group data.

- **Frontend (Mobile)**:
  - **React Native**: Cross-platform mobile application for iOS and Android.
  - **React Navigation**: Used to navigate between screens in the mobile app.
  - **Redux**: Used for managing the mobile app state.

- **Backend**:
  - **Node.js**: Server-side runtime for the backend.
  - **Express.js**: Web framework used to build the API.
  - **JWT (JSON Web Tokens)**: Used for authentication and securing API routes.


- **Authentication**:
  - **bcryptjs**: For securely hashing user passwords.

- **Hosting**:
  - The web app is hosted on **Netlify** (frontend) and the backend is hosted on **Heroku**.
  
## Installation

### Prerequisites

Before running the project, make sure you have the following installed:
- **Node.js** (version 14.x or higher)
- **npm** (Node Package Manager)
- **MongoDB** (local instance or access to MongoDB Atlas)

### Backend Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/olhabiziura/payback.git
   cd payback
   ```

2. Install the backend dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   Create a `.env` file in the root of the project and add the following environment variables:

   ```
   MONGO_URI=your_mongo_database_uri
   JWT_SECRET=your_jwt_secret_key
   ```

4. Start the backend server:

   ```bash
   npm start
   ```

   The backend will be available at `http://localhost:5000`.

### Frontend Setup (Web)

1. Navigate to the frontend folder:

   ```bash
   cd frontend
   ```

2. Install the frontend dependencies:

   ```bash
   npm install
   ```

3. Start the frontend server:

   ```bash
   npm start
   ```

   The frontend will be available at `http://localhost:3000`.

### Mobile App (React Native)

1. Navigate to the mobile app folder:

   ```bash
   cd mobile-app
   ```

2. Install the mobile app dependencies:

   ```bash
   npm install
   ```

3. Run the mobile app:

   For **Android**, run:

   ```bash
   react-native run-android
   ```

   For **iOS**, run:

   ```bash
   react-native run-ios
   ```

### Database Setup

If you're using **MongoDB Atlas**, ensure that your database is configured and accessible. If you are using a local instance of MongoDB, make sure it is running on your local machine.

## Usage

Once the application is up and running, here’s how to use it:

### Web Interface

1. **Sign up or log in**: Create a new account or log in if you already have one.
2. **Create or Join a Group**: As a user, you can either create a new group or join an existing one using a group invite link.
3. **Add Expenses**: Within a group, users can add expenses by specifying the amount, description, and the person who paid.
4. **Track Balances**: PayBack automatically calculates the debts and credits for each user, showing how much they owe or are owed.
5. **Generate Reports**: Users can generate downloadable reports in CSV format for their groups, summarizing all expenses and balances.

### Mobile App (React Native)

The mobile app has a similar functionality to the web version, but is optimized for use on the go. The app is designed to be fully responsive and can be used to track expenses in real time.
.

## Contributing

We welcome contributions to the PayBack project! If you'd like to improve the app, please fork the repository and submit a pull request. Ensure your changes are well-tested and adhere to the project’s coding standards.

### How to Contribute

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature-name`.
3. Commit your changes: `git commit -am 'Add new feature'`.
4. Push to your branch: `git push origin feature-name`.
5. Create a pull request.



