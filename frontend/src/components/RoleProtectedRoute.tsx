import {
  Navigate,
  Outlet,
} from "react-router-dom";

import {
  useAppSelector,
} from "../store/hooks";

type Props = {
  allowedRoles: string[];
};

export default function
RoleProtectedRoute({
  allowedRoles,
}: Props) {

  const user =
  useAppSelector(
    (state) => state.auth.user
  );
  

  if (
  
    !user ||
    !allowedRoles.includes(
      user.role
    )
  ) {

    return (
      <Navigate to="/" />
    );
  }

  return <Outlet />;
}