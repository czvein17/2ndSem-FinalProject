import googleIcon from "../../assets/icons/google.svg";

export const GoogleLoginButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="p-5 flex gap-3 justify-center items-center border border-black rounded-lg font-semibold w-full hover:bg-black hover:text-white ease-in-out duration-100"
    >
      <img src={googleIcon} alt="google" className="w-[24px]" />
      <span>Login with Google</span>
    </button>
  );
};
