import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Receipt, PieChart, Target, LogOut } from 'lucide-react';

export default function Layout({ children }) {
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Transactions', path: '/transactions', icon: Receipt },
        { name: 'Budget', path: '/budget', icon: Target },
        { name: 'Analytics', path: '/analytics', icon: PieChart },
    ];

    return (
        <div className="dashboard-layout">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-logo">FinanceApp</div>
                <nav>
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                            >
                                <Icon size={20} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="main-content">
                {/* Navbar */}
                <header className="navbar">
                    <h2>Welcome back, {user.name?.split(' ')[0] || 'User'} 👋</h2>
                    <div className="nav-user">
                        <button onClick={handleLogout} className="btn-outline" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <LogOut size={16} /> Logout
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <div className="page-container">
                    {children}
                </div>
            </main>
        </div>
    );
}