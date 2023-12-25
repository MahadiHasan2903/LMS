import { redirect } from "next/navigation";
import UserAuth from "./userAuth";
import { useSelector } from "react-redux";

export default function AdminProtected({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useSelector((state: any) => state.auth);

  if (user) {
    const isAdmin = user.role === "admin";
    return isAdmin ? children : redirect("/");
  }
}
