import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { userLoginContext } from "../../components/contexts/userLoginContext";
import '../login/Login.css';

function Register() {
  const { setCurrentUser, setUserLoginStatus } = useContext(userLoginContext);
  const [err, setErr] = useState("");
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues
  } = useForm();

  async function onUserRegister(newUser) {
    const { password, confirmPassword } = getValues();
      const res = await fetch("https://salvation-army-pezzonipet-gn1u.vercel.app/user-api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      console.log('Response Status:', res.status);
      console.log('Response Body:', await res.json());

      if (res.ok) {
        // Assuming you want to update the current user context with newUser data
        setUserLoginStatus(true);
        setCurrentUser(newUser);
        navigate("/home");
      } else {
        // Get and display error message from response
        const result = await res.json();
        setErr(result.message || "Registration failed");
      }
  }

  return (
    <div className='login-container mt-5'>
      <h2 className='text-center'>Registration Page</h2>
      <form className='form' onSubmit={handleSubmit(onUserRegister)}>
        <div className='form-element'>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username</label>
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
            {...register("password", { required: true })}
          />
          {errors.password?.type === "required" && (
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
          {errors.confirmPassword?.type === "required" && (
            <p className="text-danger lead">*Confirm password is required</p>
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
          {errors.mobile?.type === "required" && (
            <p className="text-danger lead">*Mobile number is required</p>
          )}
        </div>

        <div className='form-element'>
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            id="email"
            className="form-control"
            placeholder="Enter your email"
            {...register("email", { required: true })}
          />
          {errors.email?.type === "required" && (
            <p className="text-danger lead">*Email is required</p>
          )}
        </div>

        {err && <p className="text-danger lead">{err}</p>}

        <div className='text-center'>
          <button className='btn btn-success m-3'>Register</button>
        </div>
      </form>
    </div>
  );
}

export default Register;
