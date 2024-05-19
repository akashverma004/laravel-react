import { Link } from "react-router-dom";
import { createRef, useState } from "react";
import { useStateContext } from '../context/ContextProvider.jsx';
import axiosClient from "../axios-client.js";

export default function Signup() {

    const nameRef = createRef();
    const emailRef = createRef();
    const passwordRef = createRef();
    const passwordConfirmationRef = createRef();
    const [errors, setErrors] = useState(null);
    const {setUser, setToken} = useStateContext();

    const onSubmit = (ev) => {
        ev.preventDefault()
        const payload = {
            name: nameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value,
            password_confirmation: passwordConfirmationRef.current.value
        }

        axiosClient.post('/signup', payload)
            .then(({data}) => {
                setUser(data.user)
                setToken(data.token)
            })
            .catch(err => {
                if (err.response) {
                    // Server responded with an error (status code other than 2xx)
                    if (err.response.status === 422) {
                        setErrors(err.response.data.errors);
                    } else {
                        // Handle other server errors
                        console.error('Server Error:', err.response);
                        // You can show a generic error message to the user
                        // or perform other error handling as needed.
                    }
                } else if (err.request) {
                    // The request was made but no response was received
                    console.error('No response received:', err.request);
                    // You can show a message to the user indicating
                    // that there was a problem with the request.
                } else {
                    // Something happened in setting up the request
                    console.error('Request setup error:', err.message);
                    // You can show a generic error message to the user
                    // or perform other error handling as needed.
                }
            });
    }

    return (
        <div className="login-signup-form animated fadeInDown">
            <div className="form">
                <form onSubmit={onSubmit}>
                    <h1 className="title">
                        Signup into your account
                    </h1>
                    {errors && <div className="alert">
                        {Object.keys(errors).map(key => (
                               <p key={key}>{errors[key][0]}</p>
                        ))}
                        </div>
                    }
                    <input ref={nameRef} type="text" placeholder="Full Name" />
                    <input ref={emailRef} type="email" placeholder="Email" />
                    <input ref={passwordRef} type="password" placeholder="Password" />
                    <input ref={passwordConfirmationRef} type="password" placeholder="Password Confirmation" />
                    <button className="btn btn-block">Signup</button>
                    <p className="message">
                        Already Registered? <Link to="/login">Sign in</Link>
                    </p>
                </form>
            </div>
        </div>
    )
}