import { RxDashboard } from "react-icons/rx";
import { AiOutlineLogout } from "react-icons/ai";

import { SideBarList } from "./SideBarList";
import { useAuth } from "../../hooks/useAuth";

const Sidebar = () => {
  const { logout } = useAuth();
  const sidebar = [
    {
      path: "/admin",
      name: "Dashboard",
      icon: <RxDashboard size={20} />,
    },
    {
      path: "/admin/page1",
      name: "Page 1",
      icon: <RxDashboard size={20} />,
    },
    {
      path: "/admin/page2",
      name: "Page 2",
      icon: <RxDashboard size={20} />,
    },
    {
      path: "/admin/page3",
      name: "Page 3",
      icon: <RxDashboard size={20} />,
    },
  ];

  return (
    <div className="flex flex-col w-full justify-between h-full">
      <div className="h-1/6 ">
        <h1 className="text-2xl text-center font-semibold text-primary">
          Admin
        </h1>
      </div>

      <ul className="flex flex-col gap-3 h-full w-full">
        {sidebar.map((item) => (
          <SideBarList path={item.path} key={item.path}>
            {item.icon}
            {item.name}
          </SideBarList>
        ))}
      </ul>

      <div className="flex justify-center items-center w-full">
        <button
          onClick={logout}
          className="py-3 px-5 rounded-lg flex items-center gap-3 text-lg hover:bg-secondary ease-in transition"
        >
          <AiOutlineLogout size={24} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
