import { createBrowserRouter } from "react-router-dom";
import HomePage from "@/page/HomePage";
import { ProtectedRoutes } from "./protected-routes";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    element: <ProtectedRoutes />,
    children: [
      
    ],
  },
]);