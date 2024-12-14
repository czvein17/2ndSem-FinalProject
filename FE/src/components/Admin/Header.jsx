import defaultUserImg from "../../assets/images/default-user.svg";
import { useAuth } from "../../hooks/useAuth";

const Header = () => {
  const { user } = useAuth();

  return (
    <div className="p-5 h-20 bg-background border-b-2 border-gray flex items-center ">
      <div className="w-full">HEADER CONTENT</div>
      <div className="flex justify-end items-center gap-5 w-full px-10">
        <img
          className="w-10 h-10 object-cover rounded-full"
          src={user.googleProfilePic || defaultUserImg}
          alt="user photo"
        />
      </div>
    </div>
  );
};

export default Header;
