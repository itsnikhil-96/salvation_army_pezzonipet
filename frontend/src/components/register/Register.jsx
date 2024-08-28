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

  async function onUserRegister(data) {
    const { password, confirmPassword } = data;

    // Check if passwords match
    if (password !== confirmPassword) {
      setErr("Passwords do not match");
      return;
    }
    try {
      const res = await fetch("https://salvation-army-pezzonipet-gn1u.vercel.app/user-api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      if (res.ok) {
        const user = await res.json();
        loginUser(user); 
        navigate("/home");
      } else {
        const result = await res.json();
        setErr(result.message || "Registration failed");
      }
    } catch (err) {
      console.log("Error:", err);
      setErr(err.message);
    }
  }catch (err) {
      console.error("Error:", err);
      setErr("An error occurred during registration");
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
            {errors.username && (
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
          <label htmlFor='mobile'>Mobile Number</label>
          <input
            type="tel"
            id="mobile"
            className="form-control"
            {...register("mobile", { required: true })}
            placeholder="Enter your mobile number"
          />
          {errors.mobile && (
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
          {errors.email && (
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
