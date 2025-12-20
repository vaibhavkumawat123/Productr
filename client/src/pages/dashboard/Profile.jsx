import { useAuth } from "../../hooks/useAuth";
import { useState } from "react";
import toast from "react-hot-toast";
import api from "../../utils/axios";

const Profile = () => {
  const { user, login } = useAuth();
  const [name, setName] = useState(user?.userName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState(null);

  const updateProfile = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("userName", name);
      if (avatar) formData.append("avatar", avatar);

      const res = await axios.put("/auth/update-profile", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      login({
        token: localStorage.getItem("token"),
        user: res.data.user,
      });

      toast.success("Profile updated ✅");
    } catch (err) {
      toast.error("Update failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-16 bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
      <div className="flex flex-col items-center mb-6">
        <input
          type="file"
          id="avatar"
          hidden
          accept="image/*"
          onChange={(e) => setAvatar(e.target.files[0])}
        />

        {/* IMAGE */}
        <label htmlFor="avatar" className="cursor-pointer">
          <img
            src={
              avatar
                ? URL.createObjectURL(avatar)
                : user?.avatar
                ? `${import.meta.env.VITE_API_URL.replace("/api", "")}${
                    user.avatar
                  }`
                : "/default-avatar.png"
            }
            className="w-24 h-24 rounded-full object-cover border"
          />
        </label>

        {/* CHANGE BUTTON */}
        <label
          htmlFor="avatar"
          className="text-sm text-blue-600 mt-2 cursor-pointer hover:underline"
        >
          Change Photo
        </label>
      </div>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border p-2 rounded mb-4"
        placeholder="Name"
      />

      <input
        value={email}
        readOnly
        className="w-full border p-2 rounded mb-6 bg-gray-100 text-gray-500 cursor-not-allowed select-none"
        placeholder="Email"
      />

      <button
        onClick={updateProfile}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-lg"
      >
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
};

export default Profile;
