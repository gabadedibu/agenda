import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/public/Home";
import Agendas from "./pages/public/Agendas";
import AgendaDetails from "./pages/public/AgendaDetails";
import Login from "./pages/auth/Login";

import AdminDashboard from "./pages/admin/AdminDashboard";
import Departments from "./pages/admin/Departments";
import PendingAgendas from "./pages/admin/PendingAgendas";

import HeadDashboard from "./pages/head/HeadDashboard";
import MyAgendas from "./pages/head/MyAgendas";
import CreateAgenda from "./pages/head/CreateAgenda";
import AddAgendaUpdate from "./pages/head/AddAgendaUpdate";
import HeadProfile from "./pages/head/HeadProfile";
import EditAgenda from "./pages/head/EditAgenda";
import AdminLayout from "./components/AdminLayout";
import HeadLayout from "./components/HeadLayout";
import AllAgendas from "./pages/admin/AllAgendas";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/agendas" element={<Agendas />} />
      <Route path="/agendas/:id" element={<AgendaDetails />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
<Route
  path="/head/agendas/:id/update"
  element={
    <ProtectedRoute allowedRoles={["department_head"]}>
      <AddAgendaUpdate />
    </ProtectedRoute>
  }
/>
      <Route
        path="/admin/departments"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Departments />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/pending-agendas"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <PendingAgendas />
          </ProtectedRoute>
        }
      />

      <Route
        path="/head"
        element={
          <ProtectedRoute allowedRoles={["department_head"]}>
            <HeadDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/head/agendas"
        element={
          <ProtectedRoute allowedRoles={["department_head"]}>
            <MyAgendas />
          </ProtectedRoute>
        }
      />

      <Route
        path="/head/create-agenda"
        element={
          <ProtectedRoute allowedRoles={["department_head"]}>
            <CreateAgenda />
          </ProtectedRoute>
        }
      />
      <Route
        path="/head/profile"
        element={
          <ProtectedRoute allowedRoles={["department_head"]}>
            <HeadProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/head/agendas/:id/edit"
        element={
          <ProtectedRoute allowedRoles={["department_head"]}>
            <EditAgenda />
          </ProtectedRoute>
        }
      />
      <Route
  path="/admin"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <AdminLayout />
    </ProtectedRoute>
  }
>
  <Route index element={<AdminDashboard />} />
  <Route path="departments" element={<Departments />} />
  <Route path="pending-agendas" element={<PendingAgendas />} />
</Route>

<Route
  path="/head"
  element={
    <ProtectedRoute allowedRoles={["department_head"]}>
      <HeadLayout />
    </ProtectedRoute>
  }
>
  <Route index element={<HeadDashboard />} />
  <Route path="agendas" element={<MyAgendas />} />
  <Route path="create-agenda" element={<CreateAgenda />} />
  <Route path="agendas/:id/update" element={<AddAgendaUpdate />} />
  <Route path="agendas/:id/edit" element={<EditAgenda />} />
  <Route path="profile" element={<HeadProfile />} />
</Route>
    </Routes>
    
  );
}