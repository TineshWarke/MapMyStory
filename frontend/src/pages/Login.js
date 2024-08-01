import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handelError, handelSuccess } from '../utils';

function Login() {
    const [loginInfo, setLoginInfo] = useState({
        email: '',
        password: ''
    })
    const navigate = useNavigate();
    const handelChange = (e) => {
        const { name, value } = e.target;
        const copyLoginInfo = { ...loginInfo };
        copyLoginInfo[name] = value;
        setLoginInfo(copyLoginInfo);
    }
    const handleLogin = async (e) => {
        e.preventDefault();
        const { email, password } = loginInfo;
        if (!email || !password) {
            return handelError('email and password are required');
        }
        try {
            const url = "map-my-story-server.vercel.app/auth/login";
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginInfo)
            });
            const result = await response.json();
            const { success, message, jwtToken, name, error } = result;
            localStorage.setItem('token', jwtToken);
            localStorage.setItem('loggedInUser', name);
            if (success) {
                handelSuccess(message);
                setTimeout(() => {
                    navigate('/home')
                }, 1000);
            } else if (error) {
                const details = error?.details[0].message;
                handelError(details);
            } else if (!success) {
                handelError(message);
            }
        } catch (err) {
            handelError(err);
        }
    }

    return (
        <div>
            {/* Header Section */}
            <header>
                <div class="logo">MapMyStory</div>
            </header>
            <div className='container'>
                <h1>Login</h1>
                <form onSubmit={handleLogin}>
                    <div>
                        <label htmlFor='email'>Email</label>
                        <input
                            onChange={handelChange}
                            type='email'
                            name='email'
                            placeholder='Enter your email.....'
                            value={loginInfo.email}
                        />
                    </div>
                    <div>
                        <label htmlFor='name'>Password</label>
                        <input
                            onChange={handelChange}
                            type='password'
                            name='password'
                            placeholder='Enter your password.....'
                            value={loginInfo.password}
                        />
                    </div>
                    <button type='submit'>Login</button>
                    <span>Don't have an account ?
                        <Link to={"/signup"}>Signup</Link>
                    </span>
                </form>
                <ToastContainer />
            </div>
        </div>
    )
}

export default Login;