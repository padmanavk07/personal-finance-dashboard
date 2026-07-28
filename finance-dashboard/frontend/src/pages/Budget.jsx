import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Layout from '../components/Layout';
import api from '../services/api';

export default function Budget() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

    // Get current month in YYYY-MM format
    const currentMonth = new Date().toISOString().slice(0, 7);

    const fetchBudgetData = async () => {
        try {
            // The dashboard endpoint already calculates expenses vs budget!
            const response = await api.get(`/dashboard?month=${currentMonth}`);
            setData(response.data);
        } catch (error) {
            console.error('Failed to fetch budget data', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBudgetData();
    }, []);

    const onSubmit = async (formData) => {
        try {
            await api.post('/budget', {
                month: currentMonth,
                budget: parseFloat(formData.budget)
            });
            reset(); // Clear input
            fetchBudgetData(); // Refresh UI
        } catch (error) {
            alert('Failed to update budget.');
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount || 0);
    };

    // Calculate Progress
    let progressPercentage = 0;
    let progressColor = 'bg-green';

    if (data && data.budget > 0) {
        progressPercentage = (data.expenses / data.budget) * 100;

        // Cap visual progress at 100% so it doesn't break the UI
        if (progressPercentage > 100) progressPercentage = 100;

        // Determine color
        if (progressPercentage >= 90) progressColor = 'bg-red';
        else if (progressPercentage >= 70) progressColor = 'bg-yellow';
    }

    return (
        <Layout>
            <div className="page-header">
                <h2>Monthly Budget</h2>
                <p style={{ color: 'var(--text-muted)' }}>Track your spending for {currentMonth}.</p>
            </div>

            {loading ? (
                <p>Loading budget...</p>
            ) : (
                <>
                    {/* Progress Card */}
                    <div className="card progress-card">
                        <h3>Budget Overview</h3>

                        {data.budget > 0 ? (
                            <>
                                <div className="progress-container">
                                    <div
                                        className={`progress-bar ${progressColor}`}
                                        style={{ width: `${progressPercentage}%` }}
                                    ></div>
                                </div>

                                <div className="budget-stats">
                                    <span>Spent: {formatCurrency(data.expenses)}</span>
                                    <span>Limit: {formatCurrency(data.budget)}</span>
                                </div>

                                <p style={{ marginTop: '1rem', fontWeight: '500', color: progressPercentage >= 100 ? 'var(--danger)' : 'inherit' }}>
                                    {data.remainingBudget >= 0
                                        ? `${formatCurrency(data.remainingBudget)} remaining`
                                        : `${formatCurrency(Math.abs(data.remainingBudget))} over budget!`}
                                </p>
                            </>
                        ) : (
                            <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>
                                No budget set for this month. Set one below!
                            </p>
                        )}
                    </div>

                    {/* Form Card */}
                    <div className="card" style={{ maxWidth: '400px' }}>
                        <h3 style={{ marginBottom: '1rem' }}>Set Budget Limit</h3>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="form-group">
                                <label>Monthly Budget Amount (₹)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    required
                                    placeholder="e.g. 8000"
                                    {...register('budget')}
                                />
                            </div>
                            <button type="submit" className="btn-primary" disabled={isSubmitting}>
                                {isSubmitting ? 'Saving...' : 'Save Budget'}
                            </button>
                        </form>
                    </div>
                </>
            )}
        </Layout>
    );
}