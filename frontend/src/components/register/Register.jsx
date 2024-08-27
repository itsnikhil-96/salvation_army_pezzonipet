import React from 'react';
import '../login/Login.css';
import { useContext } from "react";
import { userLoginContext } from "../../components/contexts/userLoginContext";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Register() {
  let { loginUser, userLoginStatus} = useContext(userLoginContext);

  let {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  //error state
  let [err, setErr] = useState("");
  //navigate to routes
  let navigate = useNavigate();

  async function onUserRegister(newUser) {
    try {
      let res = await fetch("https://salvation-army-pezzonipet-gn1u.vercel.app/user-api/user", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(newUser),
      });
       console.log(res);
      if (res.status === 200) {
        userLoginStatus=true;
        
        console.log(userLoginStatus);
        navigate("/home");

      }
    } catch (err) {
      console.log("err is ", err);
      setErr(err.message);
    }
  }
  return (
    <div className='login-container mt-5'>
      <h2 className='text-center'>Registration Page</h2>
      <form className='form' onSubmit={handleSubmit(onUserRegister)}>
        <div className='form-element'>
        <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                type="text"
                id="username"
                className="form-control"
                 placeholder="Enter your username"
                {...register("username", { required: true })}
              />
               {errors.username?.type === "required" && (
                <p className="text-danger lead">*Username is required</p>
              )}
        </div>
        </div>
        <div className='form-element'>
          <label htmlFor='password'>Password</label>
          <input
            type="password"
            id="password"
            className="form-control"
            placeholder="Enter your password"
            required
          />
        </div>
        <div className='form-element'>
        <label htmlFor="password" className="form-label">
                Confirm Password
              </label>
              <input
                type="password"
                id="password"
                className="form-control"
                 placeholder="Confirm your password"
                {...register("password", { required: true })}
              />
             
              {errors.password?.type === "required" && (
                <p className="text-danger lead">*Password is required</p>
              )}
        </div>
        <div className='form-element'>
          <label htmlFor='mobile'>Mobile Number</label>
          <input
            type="tel"
            id="mobile"
            className="form-control"
            {...register("mobile", { required: true })}
            placeholder="Enter your mobile number"
          />
        </div>
        <div className='form-element'>
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="form-control"
                 placeholder="Enter your email"
                {...register("email", { required: true })}
              />
              {/* validation error message on email */}
              {errors.email?.type === "required" && (
                <p className="text-danger lead">*Email is required</p>
              )}
        </div>
        <div className='text-center'>
          <button className='btn btn-success m-3'>Register</button>
        </div>
      </form>
    </div>
  )
}

export default Register;
