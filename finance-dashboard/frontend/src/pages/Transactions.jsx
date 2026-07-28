import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import TransactionForm from '../components/TransactionForm';
import TransactionTable from '../components/TransactionTable';
import api from '../services/api';

export default function Transactions() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTransactions = async () => {
        try {
            const response = await api.get('/transactions');
            setTransactions(response.data);
        } catch (error) {
            console.error('Failed to fetch transactions', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this transaction?')) return;

        try {
            await api.delete(`/transactions/${id}`);
            // Remove from state immediately for snappy UI
            setTransactions(transactions.filter(tx => tx.id !== id));
        } catch (error) {
            alert('Failed to delete transaction.');
        }
    };

    return (
        <Layout>
            <div className="page-header">
                <h2>Transactions</h2>
                <p style={{ color: 'var(--text-muted)' }}>Manage your income and expenses.</p>
            </div>

            <TransactionForm onTransactionAdded={fetchTransactions} />

            <div style={{ marginTop: '2rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>Recent History</h3>
                {loading ? (
                    <p>Loading transactions...</p>
                ) : (
                    <TransactionTable transactions={transactions} onDelete={handleDelete} />
                )}
            </div>
        </Layout>
    );
}