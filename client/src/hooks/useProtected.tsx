import { redirect } from "next/navigation";
import UserAuth from "./userAuth";

export default function Protected({ children }: { children: React.ReactNode }) {
  const isAuthenticated = UserAuth();
  return isAuthenticated ? children : redirect("/");
}
