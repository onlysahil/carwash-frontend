// src/App.jsx
import {AuthProvider} from "./context/AuthContext";
import BookingProvider from "./context/BookingContext";
import AppRouter from "./router/AppRouter";

import "./styles/globals.css";
import "./styles/variables.css";

function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <AppRouter />
      </BookingProvider>
    </AuthProvider>
  );
}

export default App;
