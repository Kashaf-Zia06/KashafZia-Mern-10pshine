import { useParams } from "react-router-dom";
import { useState } from "react";
import PasswordInput from "@/components/PasswordInput";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");

  const navigate=useNavigate()

  const submit = async () => {
   try {
     await axios.post(
       `http://localhost:5005/users/reset-password/${token}`,
       { password }
     );
     alert("Password updated successfully");
     navigate('/login')
   } catch (err) {
    console.log(err.message)
    
   }

  };

  return (
    <>
    <div className="reset-box">

      <PasswordInput value={password} onChange={e => setPassword(e.target.value)} />
      <button       className="text-white rounded-2xl border-black reset-btn "

      onClick={submit}>Reset Password</button>

    </div>


    </>
  );
};


export default ResetPassword