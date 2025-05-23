import React, { useState } from 'react'
import AuthLayout from '../../components/layouts/AuthLayout'
import ProfilePhotoSelector from '../../components/layouts/Inputs/ProfilePhotoSelector'


const SignUp = () => {
  const {profilePic, setProfilePic} = useState(null);
  const {fullName, setFullName} = useState("");
  const {email, setEmail} = useState("");
  const {password, setPassword} = useState("");
  const {adminInviteToken, setAdminInviteToken} = useState('');

  const {error, setError} = useState(null);

    // Handle SignUp Form Submit
    const handleSignUp = async (e) => {
      e.preventDefault();
  
      if (fullName) {
        setError("Please enter full name.");
        return;
      }
      if (!validateEmail(email)) {
        setError("Please enter a valid email address.");
        return;
      }
  
      if (!password) {
        setError("Please enter your password");
        return;
      }
  
      setError("");
  
      // SignUp API Call
    };

  return (
    <AuthLayout>
      <div className="lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Create an Account</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Join us today by entering your details below.
        </p>

        <form onSubmit={handleSignUp}>
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

          <div className="gridd grid-cols-1 md:grid=cols-2 gap-4 ">

          </div>
        </form>
      </div>
    </AuthLayout>
  )
}

export default SignUp