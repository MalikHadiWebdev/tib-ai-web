import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import PatientPage from "./pages/PatientPage";
import AdminPage from "./pages/AdminPage";
import MainLayout from "./layouts/MainLayout";
import { useAppContext } from "./context/AppContext";

function App() {
  const { appState } = useAppContext();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<PatientPage />} />
          <Route path="admin" element={<AdminPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
