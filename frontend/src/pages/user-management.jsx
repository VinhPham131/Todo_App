import React, { useEffect, useState, useCallback } from "react";
import { TextInput, Table, Button, Pagination } from "flowbite-react";
import { HiSearch, HiPencilAlt, HiTrash } from "react-icons/hi";
import debounce from "lodash/debounce";

import Modal from "../components/modal";
import PopUpConfirmation from "../components/pop-up-comfirmation";
import SuccessToast from "../components/success-toast";
import FailToast from "../components/fail-toast";
import SideBar from "../components/side-bar";
import { set } from "lodash";


export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [deletedUser, setDeletedUser] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [failMessage, setFailMessage] = useState("");
  const [failToast, setFailToast] = useState("");
  const [query, setQuery] = useState("");


  const usersPerPage = 5;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/users");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUsers();
  }, []);

  const openCreateModal = () => {
    setIsModalOpen(true);
    setSelectedUser(null);
  };

  const openEditModal = (user) => {
    setIsModalOpen(true);
    setSelectedUser(user);
  };

  const comfirmDelete = (user) => {
    setIsConfirmationOpen(true);
    setDeletedUser(user);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(
      {
        username: "",
        email: "",
        fullname: "",
        sex: "",
        yearOfBirth: ""
      }
    );
    setFailMessage("");
  };

  const handleDelete = async () => {
    if (deletedUser) {
      try {
        const response = await fetch(`http://localhost:3000/api/users/${deletedUser}`, {
          method: "DELETE"
        });
        const result = await response.json();
        if (response.ok) {
          setUsers(users.filter(user => user._id !== deletedUser));
          setSuccessMessage("User deleted successfully!");
          timeOut();
        } else {
          setFailToast(result.message || "Failed to delete user");
          timeOut();
        }
      } catch (error) {
        alert(error.message);
      }
      setIsConfirmationOpen(false);
      setDeletedUser(null);
    }
  };

  const handleSubmit = async (user) => {
    if (selectedUser) {
      try {
        const response = await fetch(`http://localhost:3000/api/users/${selectedUser._id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(user)
        });
        const result = await response.json();
        if (response.ok) {
          setUsers(users.map(u => u._id === result._id ? result : u));
          setSuccessMessage("User updated successfully!");
          setFailMessage("");
          timeOut();
        } else {
          setFailMessage(result.message || "Failed to update user");
          timeOut();
          return;
        }
      } catch (error) {
        alert(error.message);
      }
    } else {
      try {
        const response = await fetch("http://localhost:3000/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(user)
        });
        const result = await response.json();
        if (response.ok) {
          setUsers([...users, result]);
          setSuccessMessage("User created successfully!");
          setFailMessage("");
          timeOut();
        } else {
          setFailMessage(result.message || "Failed to create user");
          timeOut();
          return;
        }
      } catch (error) {
        alert(error.message);
      }
    }
    setIsModalOpen(false);
  };

  const filteredUsers = Array.isArray(users)
    ? users.filter(user =>
      user.fullname.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
    )
    : [];


  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);
  const onPageChange = (page) => setCurrentPage(page);

  const timeOut = () => {
    setTimeout(() => {
      setSuccessMessage("");
      setFailToast("");
    }, 3000);
  }

  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearch(value);
      setCurrentPage(1);
    }, 200), 
    []
  );
  
  const handleSearchChange = (e) => {
    setQuery(e.target.value);
    debouncedSearch(e.target.value);
  };
  
  

  return (
    <div className="bg-theme h-screen flex gap-6">
      <SideBar />
      <div>
        <div className="fixed top-4 right-4 z-50">
          {successMessage && <SuccessToast message={successMessage} />}
          {failToast && <FailToast message={failToast} />}
        </div>
        <div className="bg-black p-6 mx-auto mt-10 rounded-lg w-[1200px]">
          <div className="flex justify-end gap-10">
            <Button gradientMonochrome="pink" onClick={() => openCreateModal(users)}>Create a new user</Button>
            <div className="max-w-lg">
              <TextInput
                id="search"
                type="search"
                rightIcon={HiSearch}
                placeholder="Search..."
                value={query}
                onChange={handleSearchChange}
                required
              />
            </div>
          </div>
          <div className="overflow-x-auto mt-10">
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell className="bg-gray-400 text-center">User Name</Table.HeadCell>
                <Table.HeadCell className="bg-gray-400 text-center">Email</Table.HeadCell>
                <Table.HeadCell className="bg-gray-400 text-center">Full Name</Table.HeadCell>
                <Table.HeadCell className="bg-gray-400 text-center">Sex</Table.HeadCell>
                <Table.HeadCell className="bg-gray-400 text-center">Year of Birth</Table.HeadCell>
                <Table.HeadCell className="bg-gray-400 text-center">
                  <span className="sr-only">Edit</span>
                </Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {paginatedUsers.length === 0 ? (
                  <Table.Row key="no-user">
                    <Table.Cell colSpan="6" className="text-center text-gray-500 bg-gray-300">
                      User not found
                    </Table.Cell>
                  </Table.Row>
                ) : (
                  paginatedUsers.map((user) => (
                    <Table.Row key={user._id} className="bg-gray-300 hover:bg-gray-200">
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 text-center">
                        {user.username}
                      </Table.Cell>
                      <Table.Cell className="text-center">{user.email}</Table.Cell>
                      <Table.Cell className="text-center">{user.fullname}</Table.Cell>
                      <Table.Cell className="text-center">{user.sex}</Table.Cell>
                      <Table.Cell className="text-center">{user.yearOfBirth}</Table.Cell>
                      <Table.Cell className="flex justify-center space-x-2">
                        <a onClick={(e) => {
                          e.preventDefault();
                          openEditModal(user);
                        }}
                          className="text-pink-500 cursor-pointer">
                          <HiPencilAlt />
                        </a>
                        <a onClick={(e) => {
                          e.preventDefault();
                          comfirmDelete(user._id);
                        }} className="text-pink-500 cursor-pointer">
                          <HiTrash />
                        </a>
                      </Table.Cell>
                    </Table.Row>
                  ))
                )}
              </Table.Body>
            </Table>
          </div>
          <div className="flex overflow-x-auto sm:justify-center">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} className="mt-4" />
          </div>
        </div>
        <Modal
          isOpen={isModalOpen}
          onClose={() => closeModal()}
          onSubmit={handleSubmit}
          userData={selectedUser}
          title={selectedUser ? "Edit User" : "Create New User"}
          buttonLabel={selectedUser ? "Save" : "Create"}
          error={failMessage}
        />
        {isConfirmationOpen && (
          <PopUpConfirmation
            onConfirm={handleDelete}
            onCancel={() => setIsConfirmationOpen(false)}
            title="user"
          />
        )}
      </div>
    </div>
  );
}
