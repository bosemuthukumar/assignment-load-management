import { FiBarChart2, FiBox, FiPlus } from "react-icons/fi";

export const getAdminMenuItems = (navigate) => [
  {
    name: "Dashboard",
    iconComponent: FiBarChart2,
    path: "/admin/dashboard",
    onClick: () => navigate("/admin/dashboard"),
  },
  {
    name: "Loads",
    iconComponent: FiBox,
    path: "/loads",
    onClick: () => navigate("/loads"),
  },
  {
    name: "Create Load",
    iconComponent: FiPlus,
    path: "/create-load",
    onClick: () => navigate("/create-load"),
  },
];

export const getUserMenuItems = (navigate) => [
  {
    name: "Dashboard",
    iconComponent: FiBarChart2,
    path: "/user/dashboard",
    onClick: () => navigate("/user/dashboard"),
  },
  {
    name: "Loads",
    iconComponent: FiBox,
    path: "/loads",
    onClick: () => navigate("/loads"),
  },
  {
    name: "Create Load",
    iconComponent: FiPlus,
    path: "/create-load",
    onClick: () => navigate("/create-load"),
  },
];
