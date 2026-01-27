import { useState } from "react";
import axios from "axios";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

function Login({ updateUserDetails }) {

    const [formData, setFormData] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");

    const handleSubmit = async(e) => {
        e.preventDefault();
    };

    const handleGoogleSuccess = async(authResponse) => {
        try {
            const response = await axios.post(
                "http://localhost:5001/auth/google-auth", { idToken: authResponse.credential }, { withCredentials: true }
            );

            updateUserDetails(response.data.user);
        } catch (error) {
            setErrors({ message: "Error processing google auth" });
        }
    };

    const handleGoogleError = () => {
        setErrors({ message: "Google login failed" });
    };

    return ( <
        div className = "container text-center" >

        <
        form onSubmit = { handleSubmit } >
        <
        input type = "email"
        placeholder = "Email" / >
        <
        input type = "password"
        placeholder = "Password" / >
        <
        button > Submit < /button> <
        /form>

        <
        h2 > OR < /h2>

        <
        GoogleOAuthProvider clientId = { process.env.REACT_APP_GOOGLE_CLIENT_ID } >
        <
        GoogleLogin onSuccess = { handleGoogleSuccess }
        onError = { handleGoogleError }
        /> <
        /GoogleOAuthProvider>

        <
        /div>
    );
}

export default Login;