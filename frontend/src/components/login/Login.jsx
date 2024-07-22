import React from 'react';
import './Login.css';
import { useForm } from "react-hook-form";
import { useContext } from "react";
import { userLoginContext } from "../../components/contexts/userLoginContext";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
function Login() {
  let { loginUser, userLoginStatus ,err} = useContext(userLoginContext);
  //const [userLoginErr, setUserLoginErr] = useState('')
  const navigate = useNavigate();

  let {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  //on user submit
  function onUserLogin(userCred) {
    loginUser(userCred);
    console.log(userLoginStatus);
  }

  useEffect(() => {
    if (userLoginStatus === true) {
      navigate("/gallery");
    }
  }, [userLoginStatus]);

  return (
    <div className='login-container mt-5'>
      <h2 className='text-center'>Login Page</h2>
      {
            err.length!==0&&<p className="fs-1 text-danger">{err}</p>
          }
      <form
            className="mx-auto mt-5 bg-light p-3"
            onSubmit={handleSubmit(onUserLogin)}
          >
        <div className='form-element'>
        <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                type="text"
                id="username"
                className="form-control"
                {...register("username", { required: true })}
              />
              {/* validation error message on username */}
              {errors.username?.type === "required" && (
                <p className="text-danger lead">*Username is required</p>
              )}
          </div>
          <div className='form-element'>
          <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="form-control"
                {...register("password", { required: true })}
              />
              {/* validation error message on password */}
              {errors.password?.type === "required" && (
                <p className="text-danger lead">*Password is required</p>
              )}
          </div>
          <div className='text-center'>
          <button className='btn btn-success m-3'>Login</button>
          </div>
          <p className='login-register'>Don't have a account Click on register</p>
          <Link to="../register" className='login-link'>Register</Link>
      </form>
      
    </div>
  )
}

export default Login