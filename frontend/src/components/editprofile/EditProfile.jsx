import React, { useContext } from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { userLoginContext } from "../../components/contexts/userLoginContext";

function EditProfile() {
  const { register, handleSubmit, setValue } = useForm();
  const { currentUser, setCurrentUser } = useContext(userLoginContext);
  const navigate = useNavigate();

  // Handle form submission
  const onSubmit = async (modifiedUser) => {
    try {
      console.log(modifiedUser);

      const res = await fetch(`http://localhost:5000/users/${currentUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(modifiedUser),
      });

      console.log(res);

      if (res.ok) {
        modifiedUser.id = currentUser.id;
        setCurrentUser(modifiedUser);
        navigate("/home");
      } else {
        console.error("Failed to update user:", res.statusText);
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <div className='login-container mt-5'>
      <h2 className='text-center'>Edit Profile Page</h2>
      <form className='form' onSubmit={handleSubmit(onSubmit)}>
        <div className='form-element'>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="form-control"
              {...register("username", { required: true })}
              defaultValue={currentUser.username} 
            />
          </div>
        </div>
        <div className='form-element'>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="form-control"
              {...register("password")}
              defaultValue={currentUser.password} 
              required
            />
          </div>
        </div>
        <div className='form-element'>
          <label htmlFor="mobile" className="form-label">
            Mobile no
          </label>
          <input
            type="number"
            id="mobile"
            className="form-control"
            {...register("mobile")}
            defaultValue={currentUser.mobile} 
            required
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
            {...register("email")}
            defaultValue={currentUser.email} 
            required
          />
          {/* validation error message on email */}
          {/* Add validation error handling if needed */}
        </div>
        <div className='text-center'>
          <button type="submit" className='btn btn-success m-3'>Edit Profile</button>
        </div>
      </form>
    </div>
  );
}

export default EditProfile;
