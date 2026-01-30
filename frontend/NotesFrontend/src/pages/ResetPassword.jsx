// import { useParams } from "react-router-dom";
// import { useState } from "react";
// import PasswordInput from "@/components/PasswordInput";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { validatePassword } from "@/utils/helper";

// const ResetPassword = () => {
//     const { token } = useParams();
//     const [password, setPassword] = useState("");
//     const [error,setError]=useState("")

//     const navigate = useNavigate()



//     const submit = async () => {

//         if (!validatePassword(password)) {
//             setError(
//                 "Password must be at least 6 characters and include uppercase, lowercase, and a number"
//             );
//             return;
//         }


//         if (!password) {
//             setError("Please enter password")
//             return;
//         }
//         try {
//             await axios.post(
//                 `http://localhost:5005/users/reset-password/${token}`,
//                 { password }
//             );
//             alert("Password updated successfully");
//             navigate('/login')
//         } 
//          catch (err) {
//             if (err.response && err.response.data && err.response.data.message) {
//                 setError(err.response.data.message); // now it will show "User doesnot exist"
//             } else {
//                 setError("Something went wrong. Please try again.");
//             }
//         }

//     };

//     return (
//         <>
//             <div className="reset-box">

//                 <p className="text-white text-sm reset-text">Enter new password</p>
//                 <PasswordInput value={password} onChange={e => setPassword(e.target.value)} />
//                 <button className="text-white rounded-2xl border-black reset-btn "

//                     onClick={submit}>Reset Password</button>

//             </div>


//         </>
//     );
// };


// export default ResetPassword



import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import PasswordInput from "@/components/PasswordInput";
import axios from "axios";
import { validatePassword } from "@/utils/helper";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";

const ResetPassword = () => {
    const { token } = useParams();
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
   
    const navigate = useNavigate();
    

    const submit = async () => {
        // Clear previous error
        setError("");

        

        if (!password) {
            setError("Please enter password");
            return;
        }

        if (!validatePassword(password)) {
            setError(
                "Password must be at least 6 characters and include uppercase, lowercase, and a number"
            );
            return;
        }

        try {
            setLoading(true);
            await axios.post(
                `http://localhost:5005/users/reset-password/${token}`,
                { password }
            );
            // alert("Password updated successfully");
            toast.success("Password updated successfully")

            navigate("/login");
        } catch (err) {
            console.log(err);
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message); // Backend errors
            } else {
                setError("Something went wrong. Please try again."); // Fallback
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reset-box">
            <p className="text-white text-sm reset-text">Enter new password</p>
            
            <PasswordInput
                value={password}
                onChange={(e) => {
                    setPassword(e.target.value);
                    setError(""); // clear error on input change
                }}
            />

            {error && <p className="text-red-500 mt-[-5px] text-xs mb-2">{error}</p>}

            <button
                className="text-white rounded-2xl border-black reset-btn"
                onClick={submit}
                disabled={loading}
            >
                {loading ? "Updating..." : "Reset Password"}
            </button>
        </div>
    );
};

export default ResetPassword;
