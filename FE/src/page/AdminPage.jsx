import { useAuth } from "../hooks/useAuth";

const AdminPage = () => {
  const { logout } = useAuth();

  function handleLogout(e) {
    e.preventDefault();
    logout();
  }
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      AdminPage
      <button
        onClick={handleLogout}
        className="p-3 bg-black text-white rounded-lg"
      >
        Logout
      </button>
    </div>
  );
};

export default AdminPage;
