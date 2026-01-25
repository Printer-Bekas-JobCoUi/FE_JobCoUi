import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./state/auth";
import AdminLayout from "./layouts/AdminLayout";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Workers from "./pages/Workers";
import Employers from "./pages/Employers";
import Jobs from "./pages/Jobs";
import Contracts from "./pages/Contracts";
import Payments from "./pages/Payments";
import Ratings from "./pages/Ratings";
import NotFound from "./pages/NotFound";

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthed } = useAuth();
  if (!isAuthed) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <RequireAuth>
              <AdminLayout />
            </RequireAuth>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="buruh" element={<Workers />} />
          <Route path="pemberi-kerja" element={<Employers />} />
          <Route path="pekerjaan" element={<Jobs />} />
          <Route path="kontrak" element={<Contracts />} />
          <Route path="pembayaran" element={<Payments />} />
          <Route path="rating" element={<Ratings />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}
