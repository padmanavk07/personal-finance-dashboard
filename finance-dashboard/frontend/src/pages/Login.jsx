import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

export default function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            const response = await api.post('/auth/login', data);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            navigate('/dashboard');
        } catch (error) {
            alert(error.response?.data?.error || 'Login failed');
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-card">
                <h2>Welcome Back</h2>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            {...register('email', { required: true })}
                        />
                        {errors.email && <span className="error-text">Email is required</span>}
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            {...register('password', { required: true })}
                        />
                        {errors.password && <span className="error-text">Password is required</span>}
                    </div>

                    <button type="submit" className="btn-primary">
                        Login
                    </button>
                </form>

                <p className="auth-links">
                    Don't have an account? <Link to="/register">Register</Link>
                </p>
            </div>
        </div>
    );
}