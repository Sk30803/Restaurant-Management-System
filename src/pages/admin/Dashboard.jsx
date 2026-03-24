import React from 'react';
import Card from '../../components/common/Card';
import { TrendingUp, Users, DollarSign, ChefHat } from 'lucide-react';

const Dashboard = () => {
    return (
        <div>
            <h1 style={{ marginBottom: '2rem' }}>Dashboard Overview</h1>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                <StatCard title="Total Revenue" value="$12,450" icon={<DollarSign size={24} />} trend="+15%" />
                <StatCard title="Active Orders" value="23" icon={<ChefHat size={24} />} trend="+4" />
                <StatCard title="Reservations" value="56" icon={<TrendingUp size={24} />} trend="+12%" />
                <StatCard title="Total Customers" value="1,205" icon={<Users size={24} />} trend="+8%" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
                <Card className="glass-panel">
                    <h3>Recent Orders</h3>
                    <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem' }}>
                        {['Order #1023 - $45.00', 'Order #1024 - $120.50', 'Order #1025 - $32.00'].map((item, i) => (
                            <li key={i} style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--glass-border)' }}>
                                {item} <span style={{ float: 'right', color: 'var(--color-success)' }}>Completed</span>
                            </li>
                        ))}
                    </ul>
                </Card>
                <Card className="glass-panel">
                    <h3>Today's Reservations</h3>
                    <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem' }}>
                        {['John Doe - Table 4 (7:00 PM)', 'Jane Smith - Table 2 (7:30 PM)', 'Mike Ross - Table 1 (8:15 PM)'].map((item, i) => (
                            <li key={i} style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--glass-border)' }}>
                                {item}
                            </li>
                        ))}
                    </ul>
                </Card>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon, trend }) => (
    <Card className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ padding: '1rem', background: 'rgba(251, 191, 36, 0.1)', borderRadius: '12px', color: 'var(--color-accent)' }}>
            {icon}
        </div>
        <div>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>{title}</p>
            <h3 style={{ fontSize: '1.5rem', lineHeight: 1 }}>{value}</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-success)' }}>{trend} from last week</span>
        </div>
    </Card>
);

export default Dashboard;
