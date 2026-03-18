import { RouterProvider } from "react-router";
import { router } from "./routes";
import { AdminAuthProvider } from "./admin/auth";
import { Toaster } from "sonner";

export default function App() {
  return (
    <AdminAuthProvider>
      <RouterProvider router={router} />
      <Toaster richColors />
    </AdminAuthProvider>
  );
}
