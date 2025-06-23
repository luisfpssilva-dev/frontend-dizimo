import React from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    
    const handleCredentialResponse = (response) => {
        const token = response.credential;
        login(token);
        navigate('/dashboard');
    };
    
    React.useEffect(() => {
        window.google.accounts.id.initialize({
            client_id: '697490165221-ufu42h6n27ah0vst0avjmvdgoh50bh7o.apps.googleusercontent.com',
            callback: handleCredentialResponse,
        });
        window.google.accounts.id.renderButton(
            document.getElementById('googleSignInButton'),
            { theme: 'outline', size: 'large' }
        );
    }, []);

    return (
        <div>
        <div className="login-container">

            <div className="login-box">
                <h2>Login</h2>
        <img alt="Image" height="150" width="250"src="https://storage.googleapis.com/wzukusers/user-33413660/images/5b0ada5b567e3P45KF2S/colorido.png" />
                <p>Entre com sua conta do Google</p>
                <div id="googleSignInButton"></div>
            </div>
        </div>
        </div>
    );
};

export default Login;
