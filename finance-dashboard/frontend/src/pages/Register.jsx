import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

export default function Register() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            // Create the user
            await api.post('/auth/register', data);

            // If successful, alert them and redirect to login
            alert('Registration successful! Please log in.');
            navigate('/login');
        } catch (error) {
            alert(error.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-card">
                <h2>Create an Account</h2>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                        <label>Name</label>
                        <input
                            type="text"
                            {...register('name', { required: true })}
                        />
                        {errors.name && <span className="error-text">Name is required</span>}
                    </div>

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
                            {...register('password', { required: true, minLength: 6 })}
                        />
                        {errors.password && <span className="error-text">Password must be at least 6 characters</span>}
                    </div>

                    <button type="submit" className="btn-primary">
                        Register
                    </button>
                </form>

                <p className="auth-links">
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
}