import { useForm } from 'react-hook-form';
import api from '../services/api';

export default function TransactionForm({ onTransactionAdded }) {
    const { register, handleSubmit, watch, reset, formState: { isSubmitting } } = useForm({
        defaultValues: {
            type: 'expense',
            date: new Date().toISOString().split('T')[0] // Defaults to today: YYYY-MM-DD
        }
    });

    const txType = watch('type');

    const expenseCategories = ['Food', 'Transport', 'Shopping', 'Entertainment', 'College', 'Hostel', 'Rent', 'Bills', 'Medical', 'Other'];
    const incomeCategories = ['Parents', 'Internship', 'Scholarship', 'Freelancing', 'Gift', 'Other'];

    const categories = txType === 'income' ? incomeCategories : expenseCategories;

    const onSubmit = async (data) => {
        try {
            // Ensure amount is a number
            const payload = { ...data, amount: parseFloat(data.amount) };
            await api.post('/transactions', payload);
            reset(); // Clear form
            onTransactionAdded(); // Trigger re-fetch in parent
        } catch (error) {
            alert('Failed to add transaction.');
        }
    };

    return (
        <div className="card">
            <h3 style={{ marginBottom: '1rem' }}>Add New Transaction</h3>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-grid">
                    <div className="form-group">
                        <label>Type</label>
                        <select {...register('type')} className="form-group input" style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                            <option value="expense">Expense</option>
                            <option value="income">Income</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Amount (₹)</label>
                        <input type="number" step="0.01" required {...register('amount')} />
                    </div>

                    <div className="form-group">
                        <label>Category</label>
                        <select {...register('category')} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Date</label>
                        <input type="date" required {...register('date')} />
                    </div>
                </div>

                <div className="form-group">
                    <label>Notes (Optional)</label>
                    <input type="text" placeholder="E.g., Lunch at canteen" {...register('notes')} />
                </div>

                <button type="submit" className="btn-primary" disabled={isSubmitting} style={{ width: 'auto', padding: '0.75rem 2rem' }}>
                    {isSubmitting ? 'Adding...' : 'Add Transaction'}
                </button>
            </form>
        </div>
    );
}