import { useNavigate, useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import axiosClient from "../axios-client.js"
import { useStateContext } from "../context/ContextProvider"

export default function UserForm() {
    const {id} = useParams
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState(null)
    const {setNotification} = useStateContext()
    const [user, setUser] = useState({
        id: null,
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    })

    if(id) {
        useEffect(() => {
            setLoading(true)
            axiosClient.get('/users/'+id)
                .then(({data}) => {
                    setUser(data.data)
                })
                .catch(() => {
                    setLoading(false)
                })
        }, [])
    }

    const onSubmit = (ev) => {
        ev.preventDefault();
        if(user.id){
            axiosClient.post('/users/'+user.id, user)
                .then(() => {
                    setNotification('User updated successfully')
                    navigate('/users')
                })
                .catch(err => {
                    const errors = err.response.data.errors
                    if (err.response) {
                        if (err.response.status === 422) {
                            setErrors(err.response.data.errors);
                        } else {
                            console.error('Server Error:', err.response);
                        }
                    } else if (err.request) {
                        console.error('No response received:', err.request);
                    } else {
                        console.error('Request setup error:', err.message);
                    }
                });
        }
        else {
            axiosClient.post('/users', user)
            .then(() => {
                setNotification('User created successfully')
                navigate('/users')
            })
            .catch(err => {
                const errors = err.response.data.errors
                if (err.response) {
                    if (err.response.status === 422) {
                        setErrors(err.response.data.errors);
                    } else {
                        console.error('Server Error:', err.response);
                    }
                } else if (err.request) {
                    console.error('No response received:', err.request);
                } else {
                    console.error('Request setup error:', err.message);
                }
            });
        }
    }
   return (
    <>
        {user.id && <h1>Update User: {user.name}</h1>}
        {!user.id && <h1>New User</h1>}
        <div className="card animated fadeInDown">
            {loading && (
                <div className="text-center">Loading...</div>
            )}
            {errors && <div className="alert">
                        {Object.keys(errors).map(key => (
                               <p key={key}>{errors[key][0]}</p>
                        ))}
                        </div>
                    }
            {!loading && 
                <form action="" onSubmit={onSubmit}>
                    <input type="name" onChange={ev => setUser({...user, name: ev.target.value})} value={user.name} placeholder="Name" />
                    <input type="email" onChange={ev => setUser({...user, email: ev.target.value})} value={user.email} placeholder="Email" />
                    <input type="password" onChange={ev => setUser({...user, password: ev.target.value})}  placeholder="Password" />
                    <input type="password" onChange={ev => setUser({...user, password_confirmation: ev.target.value})}  placeholder="Password Confirmation" />
                    <button className="btn">Save</button>
                </form>
            }
        </div>
    </>
   ) 
}