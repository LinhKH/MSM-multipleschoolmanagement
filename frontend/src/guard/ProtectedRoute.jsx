import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useContext, useEffect, useState } from "react";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { authenticated, user } = useContext(AuthContext);
  const [checked, setChecked] = useState(false);
  // const userRole = "SCHOOL";
  // const authenticated = true;

  useEffect(() => {
    setChecked(true);
  }, []);

  if (checked && !authenticated) {
    return <Navigate to="/login" />;
  }

  if (checked && (!user || !allowedRoles.includes(user.role))) {
    return <Navigate to="/login" />;
  }
  if (checked) {
    return children;
  }
}
