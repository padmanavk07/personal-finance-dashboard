import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';
import {
    PieChart, Pie, Cell,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    LineChart, Line
} from 'recharts';

export default function Analytics() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await api.get('/transactions');
                setTransactions(response.data);
            } catch (error) {
                console.error('Failed to fetch transactions for analytics', error);
            } finally {
                setLoading(false);
            }
        };
        fetchTransactions();
    }, []);

    // --- Data Processors ---

    // 1. Pie Chart: Expenses by Category
    const getCategoryData = () => {
        const expenses = transactions.filter(tx => tx.type === 'expense');
        const grouped = expenses.reduce((acc, tx) => {
            acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
            return acc;
        }, {});

        return Object.keys(grouped)
            .map(key => ({ name: key, value: grouped[key] }))
            .sort((a, b) => b.value - a.value); // Sort largest to smallest
    };

    // 2. Line Chart: Income vs Expense (Monthly Trend)
    const getMonthlyTrendData = () => {
        const grouped = transactions.reduce((acc, tx) => {
            // Extract YYYY-MM
            const month = tx.date.substring(0, 7);
            if (!acc[month]) acc[month] = { month, income: 0, expense: 0 };

            if (tx.type === 'income') acc[month].income += tx.amount;
            if (tx.type === 'expense') acc[month].expense += tx.amount;
            return acc;
        }, {});

        // Sort chronologically
        return Object.values(grouped).sort((a, b) => a.month.localeCompare(b.month));
    };

    // 3. Bar Chart: Weekly Expenses for Current Month
    const getWeeklyData = () => {
        const currentMonth = new Date().toISOString().substring(0, 7);
        const thisMonthExpenses = transactions.filter(tx => tx.type === 'expense' && tx.date.startsWith(currentMonth));

        const weeks = { 'Week 1': 0, 'Week 2': 0, 'Week 3': 0, 'Week 4': 0, 'Week 5': 0 };

        thisMonthExpenses.forEach(tx => {
            const day = parseInt(tx.date.substring(8, 10));
            const weekNum = Math.ceil(day / 7);
            weeks[`Week ${weekNum > 5 ? 5 : weekNum}`] += tx.amount;
        });

        return Object.keys(weeks).map(key => ({ name: key, amount: weeks[key] }));
    };

    // Colors for Pie Chart slices
    const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#64748b'];

    if (loading) {
        return <Layout><p>Loading analytics...</p></Layout>;
    }

    const categoryData = getCategoryData();
    const trendData = getMonthlyTrendData();
    const weeklyData = getWeeklyData();

    return (
        <Layout>
            <div className="page-header">
                <h2>Analytics</h2>
                <p style={{ color: 'var(--text-muted)' }}>Visualize your spending habits and financial trends.</p>
            </div>

            <div className="charts-grid">

                {/* 1. Pie Chart */}
                <div className="chart-card">
                    <h3>Expenses by Category</h3>
                    <div className="chart-wrapper">
                        {categoryData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => `₹${value}`} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '2rem' }}>No expenses yet.</p>
                        )}
                    </div>
                </div>

                {/* 2. Bar Chart */}
                <div className="chart-card">
                    <h3>Weekly Expenses (This Month)</h3>
                    <div className="chart-wrapper">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={weeklyData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip formatter={(value) => `₹${value}`} />
                                <Bar dataKey="amount" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 3. Line Chart */}
                <div className="chart-card" style={{ gridColumn: '1 / -1' }}>
                    <h3>Income vs Expense Trend</h3>
                    <div className="chart-wrapper">
                        {trendData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={trendData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip formatter={(value) => `₹${value}`} />
                                    <Legend />
                                    <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={3} name="Income" />
                                    <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={3} name="Expense" />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '2rem' }}>Not enough data.</p>
                        )}
                    </div>
                </div>

            </div>
        </Layout>
    );
}