import React from "react";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <AuthProvider>
      <Toaster position="bottom-center" reverseOrder={false} />
      <AppRoutes />
    </AuthProvider>
  );
};

export default App;
