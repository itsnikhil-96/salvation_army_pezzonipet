import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { userLoginContext } from "../../components/contexts/userLoginContext";
import '../login/Login.css';

function Register() {
  const [err, setErr] = useState("");
  let { loginUser} = useContext(userLoginContext);

  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues
  } = useForm();

  async function onUserRegister(newUser) {
    const { password, confirmPassword,secret } = newUser;

    if (password !== confirmPassword) {
      setErr("Passwords do not match");
      return;
    }

    if(secret!=="Salvation@Army")
    {
      setErr("Invalid Secret Key");
      return ;
    }

    try {
      const res = await fetch("http://localhost:5000/user-api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      if (res.ok) {
        loginUser(newUser); 
        navigate("/home");
      } else {
        const result = await res.json();
        setErr(result.message || "Registration failed");
      }
    } catch (err) {
      console.log("Error:", err);
      setErr(err.message);
    }
  }

  return (
    <div className='login-container mt-5'>
      <h2 className='text-center'>Registration Page</h2>
      <form className='form' onSubmit={handleSubmit(onUserRegister)}>
      {err && <p className="text-danger english lead">{err}</p>}
        <div className='form-element'>
         
            <label htmlFor="username" className="form-label">Username</label>
            <input
              type="text"
              id="username"
              className="form-control"
              placeholder="Enter your username"
              {...register("username", { required: true })}
            />
            {errors.username && (
              <p className="text-danger lead">*Username is required</p>
            )}
         
        </div>

        <div className='form-element'>
          <label htmlFor='password'>Password</label>
          <input
            type="password"
            id="password"
            className="form-control"
            placeholder="Enter your password"
            {...register("password", { required: true })}
          />
          {errors.password && (
            <p className="text-danger lead">*Password is required</p>
          )}
        </div>

        <div className='form-element'>
          <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            className="form-control"
            placeholder="Confirm your password"
            {...register("confirmPassword", { required: true })}
          />
          {errors.confirmPassword && (
            <p className="text-danger lead">*Confirm password is required</p>
          )}
        </div>
        <div className='form-element'>
            <label htmlFor="username" className="form-label">Secret Key</label>
            <input
              type="text"
              id="secret"
              className="form-control"
              placeholder="Enter Secret Key"
              {...register("secret", { required: true })}
            />
            {errors.secret && (
              <p className="text-danger lead">*Secret is required</p>
            )}
        </div>
        <div className='text-center'>
          <button className='btn btn-success m-3'>Register</button>
        </div>
      </form>
    </div>
  );
}

export default Register;