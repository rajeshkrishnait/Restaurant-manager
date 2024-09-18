

# Restaurant Manager

This is a **Restaurant Management** system built using **React.js** on the frontend and **Firebase** for the backend. The application is designed to streamline the day-to-day operations of a restaurant, from managing menus to handling orders.

## Features

- **User Authentication**: Users can sign up and log in using Firebase Authentication.
- **Menu Management**: Add, edit, and delete items on the restaurant's menu.
- **Order Management**: View and manage customer orders in real-time.
- **Real-time Updates**: Orders and menu items update in real-time using Firebase's real-time database.
- **Responsive Design**: The app is mobile-friendly and adjusts its layout for different screen sizes.
  
## Technologies Used

### Frontend:
- **React.js**: A JavaScript library for building user interfaces.
- **Chakra UI**: For responsive and accessible design.
- **React Router**: For navigation within the app.
- **SCSS**: For custom styling.
  
### Backend:
- **Firebase Authentication**: For secure user login and registration.
- **Firebase Realtime Database**: For storing menu items and handling orders.
- **Firebase Hosting**: For hosting the frontend.
  
## Live Demo

You can view the live demo of the application [here](#).

## Getting Started

### Prerequisites

To run this project locally, you need to have the following installed:

- **Node.js** (v12 or later)
- **npm** or **yarn**

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/rajeshkrishnait/Restaurant-manager.git
   cd Restaurant-manager
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Firebase Setup**:
   - Create a Firebase project on [Firebase Console](https://console.firebase.google.com/).
   - Enable Firebase Authentication and Realtime Database.
   - Add a web app to your Firebase project and copy the configuration.
   - In the project, create a `.env` file and add your Firebase configuration like this:
     ```bash
     REACT_APP_FIREBASE_API_KEY=your-api-key
     REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
     REACT_APP_FIREBASE_PROJECT_ID=your-project-id
     REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
     REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
     REACT_APP_FIREBASE_APP_ID=your-app-id
     REACT_APP_FIREBASE_DATABASE_URL=your-database-url
     ```

4. **Run the application**:
   ```bash
   npm start
   ```

   The app will be available at `http://localhost:3000`.

### Firebase Deployment

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase Hosting:
   ```bash
   firebase init
   ```

   - Select "Hosting: Configure files for Firebase Hosting".
   - Choose your Firebase project.
   - Set `build` as your public directory.
   - Choose **No** for single-page app rewrite (if React Router is used, choose **Yes**).
   
4. Deploy the app:
   ```bash
   npm run build
   firebase deploy
   ```

Your app will be deployed and hosted on Firebase.

## Folder Structure

- **src**: Contains the source code for the frontend.
  - **components**: Reusable UI components (e.g., Navbar, MenuItem, OrderCard).
  - **pages**: The main pages of the app (e.g., Home, Menu, Orders).
  - **services**: Firebase service functions for authentication and database.
  - **context**: Context providers for managing global state (e.g., auth, orders).
  - **styles**: Global and component-specific SCSS styles.
  
## Future Enhancements

- **Payment Integration**: Add support for online payments.
- **Analytics Dashboard**: Track sales, orders, and customer trends over time.
- **Notifications**: Notify staff in real-time when new orders are placed.
- **Admin Panel**: More advanced features for managing the restaurant, including staff management.

## Contributing

Contributions are welcome! If you have any ideas for improvements or encounter any issues, feel free to open an issue or submit a pull request.

### Steps to Contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature-name`).
3. Make your changes and commit (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/your-feature-name`).
5. Open a Pull Request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
