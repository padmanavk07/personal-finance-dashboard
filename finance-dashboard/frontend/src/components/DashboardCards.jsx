import { Wallet, ArrowUpCircle, ArrowDownCircle, PiggyBank, Target } from 'lucide-react';

export default function DashboardCards({ data }) {
    // Helper to format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount || 0);
    };

    const cards = [
        { title: 'Current Balance', amount: data.balance, icon: Wallet, color: 'blue' },
        { title: 'Income (This Month)', amount: data.income, icon: ArrowUpCircle, color: 'green' },
        { title: 'Expenses (This Month)', amount: data.expenses, icon: ArrowDownCircle, color: 'red' },
        { title: 'Savings', amount: data.savings, icon: PiggyBank, color: 'purple' },
        { title: 'Budget Remaining', amount: data.remainingBudget, icon: Target, color: 'blue' }
    ];

    return (
        <div className="cards-grid">
            {cards.map((card, index) => {
                const Icon = card.icon;
                return (
                    <div className="summary-card" key={index}>
                        <div className={`card-icon ${card.color}`}>
                            <Icon size={24} />
                        </div>
                        <div className="card-info">
                            <h4>{card.title}</h4>
                            <p>{formatCurrency(card.amount)}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}