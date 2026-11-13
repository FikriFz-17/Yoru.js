import { createBrowserRouter } from "react-router-dom";
import HomePage from "@/page/HomePage";
import { ProtectedRoutes } from "@yoru-js/core";

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