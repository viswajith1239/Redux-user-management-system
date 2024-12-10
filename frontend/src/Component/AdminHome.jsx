import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../Redux/axiosinterceptor";
import Cookies from "js-cookie";
import ModalAddUser from "./ModalAddUser";
import Modal from "./Modal";

function AdminHome() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [edituser, setEditUser] = useState(false);
  const [adduser, setadduser] = useState(false);

  const navigate = useNavigate();

  const getEditedDatas = (editedDatas, id) => {
    const newData = [...users].map((val) =>
      val._id === id ? { ...val, ...editedDatas } : val
    );
    console.log(newData);
    setUsers(newData);
  };
  const addUserTolist = (newUser) => {
    console.log(newUser, "this is the user");
    setUsers((prevuser) => [...prevuser, newUser]);
  };

  useEffect(() => {
    const fetchdatas = async () => {
      try {
        const response = await axiosInstance.get("/admin/getUsers");
        console.log(response.data,"hi");
        if (response.data && Array.isArray(response.data.user)) {
          setUsers(response.data.user);
        } else {
          console.error("Unexpected data format:", response.data);
        }
      } catch (error) {
        console.log("error fetching datas", error);
      }
    };
    fetchdatas();
    console.log(users, "Users state");
  }, []);

  const filteredUsers = users.filter((user) => {
    return (
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleEditClick = async (usr) => {
    setEditUser(usr);
  };
  const handleDeleteClick = async (userid) => {
    try {
      await axiosInstance.delete("/admin/deleteUser?userid=" + userid);
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userid));
    } catch (error) {
      console.log("error fetching", error);
    }
  };
  const handleLogout = () => {
    navigate("/admin-login");
    Cookies.remove("adminToken");
  };

  const handleadduser = () => {
    setadduser(true);
  };
  return (
    <div className="admin-panel flex">
      <aside className="sidebar h-screen w-64 bg-gray-800 text-white fixed left-0 top-0">
        <div className="logo mb-6 p-4">
          <h2 className="text-xl font-bold">Admin Panel</h2>
        </div>
        <nav>
          <ul className="p-4">
            <li className="mb-4">
              <a href="#dashboard" className="hover:text-blue-400">Dashboard</a>
            </li>
            <li>
              <button onClick={handleadduser} className="mt-4 bg-blue-500 text-white p-2 rounded">Add User</button>
            </li>
            <li>
              <button href="#logout" className="mt-4 bg-red-500 text-white p-2 rounded" onClick={handleLogout}>Logout</button>
            </li>
          </ul>
        </nav>
      </aside>

      <div className="main-content flex-1 p-8 ml-64">
        <header className="header flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="user-info flex items-center space-x-2">
            <span className="text-white">Admin</span>
          </div>
        </header>

        <section className="content">
          <h2 className="text-xl font-bold mb-4">Users</h2>
          <div className="search-container mb-4">
            <input
              type="text"
              placeholder="Search user..."
              className="p-2 border rounded w-full"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="table-container overflow-auto">
            <table className="w-full bg-white rounded">
              <thead>
                <tr className="bg-gray-200">
                <th className="p-2 w-2/12">ID</th> 
                  <th className="p-2 w-1/12">Image</th>
                  <th className="p-2 w-2/12">Name</th>
                  <th className="p-2 w-3/12">Email</th>
                  <th className="p-2 w-2/12">Mobile</th>
                  <th className="p-2 w-3/12">Actions</th>
                </tr>
              </thead>
              <tbody>
  {filteredUsers.length > 0 ? (
    filteredUsers.map((user, idx) => (
      <tr key={user._id}>
       
        <td>{idx + 1}</td>
        <td>
          <img
            src={user.profileImg}  
            alt="Profile"
            className="w-12 h-12 object-cover rounded-full"
          />
        </td>
        <td>{user.name}</td>
        <td>{user.email}</td>
        <td>{user.mobile}</td>
        <td className="p-2 flex space-x-2">
          <button onClick={() => handleEditClick(user)} className="bg-yellow-500 text-white p-1 rounded">Edit</button>
          <button onClick={() => handleDeleteClick(user._id)} className="bg-red-500 text-white p-1 rounded">Delete</button>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="6" className="p-2 text-center">No users found</td>
    </tr>
  )}
</tbody>
            </table>
          </div>
        </section>
        {edituser && (
          <Modal
            editedusr={getEditedDatas}
            edituser={edituser}
            setEditUser={setEditUser}
          />
        )}
        {adduser && (
          <ModalAddUser SetaddUser={setadduser} addUserTolist={addUserTolist} />
        )}
      </div>
    </div>
  );
}

export default AdminHome;
