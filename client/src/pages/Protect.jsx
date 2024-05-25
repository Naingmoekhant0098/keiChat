import React from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { Navigate } from "react-router-dom";
const Protect = () => {
  const { currentUser } = useSelector((user) => user.user);
  return currentUser ? <Outlet /> : <Navigate to={"/"} />;
};

export default Protect;
