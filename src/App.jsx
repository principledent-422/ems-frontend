import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { LoginForm } from './components/auth/login-form';
import { SignupForm } from './components/auth/signup-form';
import DashboardLayout from "./components/dashboard/Layout";
import ProtectedRoute from "./components/routes/ProtectedRoute";
import { AdminCards } from "./components/dashboard/admin/AdminCards";
import UsersTable from "./components/dashboard/users/data-table";
import DepartmentsTable from "./components/dashboard/departments/data-table";
import Welcome from "./components/Welcome";
import { ThemeProvider } from "@/components/theme/theme-provider"
import TasksTable from "./components/dashboard/tasks/data-table";

function App() {

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Routes>
          {/* Protected Dashboard Routes */}
          <Route element={<ProtectedRoute />}>
            {/* Here  DashboardLayout is containing the sidebar which needs to be applied in all the sub routes*/}
            {/* In that  DashboardLayout there is something called Outlet coming in from react-router-dom which works similar to {childrens} that we do in while making the components*/}
            {/* So that DashboardLayout will be included in all the subroutes */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Welcome />} />
              <Route path="admin" element={<AdminCards />} />
              <Route path="users" element={<UsersTable />} />
              <Route path="departments" element={<DepartmentsTable />} />
              <Route path="tasks" element={<TasksTable />} />
            </Route>

            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>

          {/* Public Routes */}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
