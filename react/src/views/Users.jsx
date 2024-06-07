import { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { Link } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider.jsx"

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const { setNotification } = useStateContext();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        getUsers(currentPage);
    }, [currentPage])

    const onDelete = user => {
        if (!window.confirm('Are you sure you want to delete this user?')) { return; }

        axiosClient.delete(`/users/${user.id}`)
            .then(() => {
                setNotification('User deleted successfully')
                getUsers(currentPage)
            })
    }

    const getUsers = () => {
        setLoading(true);
        axiosClient.get("/users?page=${page}")
            .then(({ data }) => {
                setLoading(false)
                setUsers(data.data);
                setTotalPages(data.last_page);
            })
            .catch(() => {
                setLoading(false)
            })
    }

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages) {
            return;
        }
        setCurrentPage(newPage);
    }

    return (
        <div>
            <div style={{ display: "flex", justifyContent: 'space-between', alignItems: "center" }}>
                <h1>Users</h1>
                <Link to="/users/new" className="btn-add">Add New User</Link>
            </div>
            <div className="card animated fadeIndown">
                <table>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Create Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    {loading &&
                        <tbody>
                            <tr>
                                <td colSpan="5" className="text-center">
                                    Loading...
                                </td>
                            </tr>
                        </tbody>
                    }
                    {!loading &&
                        <tbody>
                            {users.map(u => (
                                <tr key={u.id}>
                                    <td>{u.id}</td>
                                    <td>{u.name}</td>
                                    <td>{u.email}</td>
                                    <td>{u.created_at}</td>
                                    <td>
                                        <Link className="btn-edit" to={'/users/' + u.id}>Edit</Link>
                                        &nbsp;
                                        <button onClick={ev => onDelete(u)} className="btn-delete">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    }
                </table>
            </div>
            <div style={{ display: "flex", justifyContent: 'center', marginTop: "20px" }}>
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
                <span style={{ margin: "0 10px" }}>Page {currentPage} of {totalPages}</span>
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
            </div>
        </div>
    )
}