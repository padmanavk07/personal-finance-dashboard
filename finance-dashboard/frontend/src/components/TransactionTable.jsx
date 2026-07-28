import { Trash2 } from 'lucide-react';

export default function TransactionTable({ transactions, onDelete }) {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
    };

    if (!transactions || transactions.length === 0) {
        return (
            <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                No transactions found. Add one above!
            </div>
        );
    }

    return (
        <div className="table-container">
            <table className="data-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Category</th>
                        <th>Notes</th>
                        <th>Amount</th>
                        <th>Type</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((tx) => (
                        <tr key={tx.id}>
                            <td>{tx.date}</td>
                            <td>{tx.category}</td>
                            <td style={{ color: 'var(--text-muted)' }}>{tx.notes || '-'}</td>
                            <td style={{ fontWeight: '500' }}>{formatCurrency(tx.amount)}</td>
                            <td>
                                <span className={`badge ${tx.type}`}>{tx.type}</span>
                            </td>
                            <td>
                                <button
                                    onClick={() => onDelete(tx.id)}
                                    className="action-btn delete"
                                    title="Delete"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}