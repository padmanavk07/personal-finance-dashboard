import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/login" element={<Login />} />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            {/* Temporary placeholder until we build Step 9 */}
                            <div style={{ padding: '2rem', textAlign: 'center' }}>
                                <h2>Dashboard Protected Route Works!</h2>
                            </div>
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
}