/* eslint-disable react/prop-types */
import { useQuery } from "@tanstack/react-query";
import { FiEdit2 } from "react-icons/fi";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { fetchAllUsers } from "../../../API/userDataReq";
import UserDefaulImg from "../../../assets/images/default-user.svg";
import Loading from "../../../components/Loading";

const AdminPage1 = () => {
  const {
    data: users,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: fetchAllUsers,
  });

  return (
    <div className=" h-full">
      {isError && (
        <div>
          {error.status} Error: {error.message}
        </div>
      )}
      {isPending && <Loading message={"Getting All User "} />}
      {!error && !isPending && (
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse">
            <thead>
              <tr>
                <th className="bg-secondary text-sm text-accent px-2 py-2 first:rounded-tl-2xl">
                  ID
                </th>
                <th className="bg-secondary text-sm  text-accent px-2 py-2">
                  Name
                </th>
                <th className="bg-secondary text-sm  text-accent px-2 py-2">
                  Email
                </th>
                <th className="bg-secondary text-sm  text-accent px-2 py-2">
                  Role
                </th>
                <th className="bg-secondary text-sm  text-accent px-2 py-2">
                  Created At
                </th>
                <th className="bg-secondary  text-accent px-2 py-2 last:rounded-tr-2xl">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {users?.data.map((user, index) => (
                <UserTableRow key={user._id} user={user} index={index} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const UserTableRow = ({ user, index }) => {
  const cellClass = `border-b border-gray-300 px-2 py-2 text-sm ${
    index % 2 === 0 ? "bg-white" : "bg-secondary"
  }`;

  return (
    <tr className="hover:bg-secondary">
      <td className={`${cellClass} w-1/5 text-center`}>{user._id}</td>
      <td className={`${cellClass} `}>
        <div className="flex gap-4 w-full items-center ">
          <img
            className="h-7 w-7 object-cover rounded-full"
            src={user.googleProfilePic || UserDefaulImg}
            alt={user.firstName}
          />
          {user.firstName + " " + user.middleName + " " + user.lastName}
        </div>
      </td>
      <td className={`${cellClass}`}>{user.email}</td>
      <td className={`${cellClass} text-center`}>{user.role}</td>
      <td className={`${cellClass} text-center`}>
        {new Date(user.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </td>
      <td className={`${cellClass} `}>
        {/* Add any action buttons or links here */}
        <span className="flex gap-2 justify-center">
          <button className=" hover:underline">
            <FiEdit2 size={20} />
          </button>
          <button className="hover:underline text-red-600">
            <MdOutlineDeleteOutline size={20} />
          </button>
        </span>
      </td>
    </tr>
  );
};

export default AdminPage1;
