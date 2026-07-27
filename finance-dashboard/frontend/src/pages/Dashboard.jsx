import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import DashboardCards from '../components/DashboardCards';
import api from '../services/api';

export default function Dashboard() {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await api.get('/dashboard');
                setDashboardData(response.data);
            } catch (err) {
                setError('Failed to load dashboard data.');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    if (loading) {
        return (
            <Layout>
                <div>Loading dashboard...</div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <div className="error-text">{error}</div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="page-header">
                <h2>Financial Overview</h2>
                <p style={{ color: 'var(--text-muted)' }}>Here is your summary for this month.</p>
            </div>

            <DashboardCards data={dashboardData} />

            {/* We will add Recent Transactions Table and Budget Progress here in Steps 10 & 11 */}
        </Layout>
    );
}