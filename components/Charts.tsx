import React from 'react';
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

interface RevenueChartProps {
    data: { date: string; revenue: number; orders: number }[];
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
                <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#136dec" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#136dec" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis dataKey="date" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                    contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #334155',
                        borderRadius: '8px'
                    }}
                />
                <Legend />
                <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#136dec"
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                    name="Revenue ($)"
                />
            </AreaChart>
        </ResponsiveContainer>
    );
};

interface OrdersChartProps {
    data: { name: string; value: number; color: string }[];
}

export const OrdersStatusChart: React.FC<OrdersChartProps> = ({ data }) => {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
                <Tooltip
                    contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #334155',
                        borderRadius: '8px'
                    }}
                />
            </PieChart>
        </ResponsiveContainer>
    );
};

interface EarningsChartProps {
    data: { day: string; earnings: number; tips: number }[];
}

export const EarningsChart: React.FC<EarningsChartProps> = ({ data }) => {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis dataKey="day" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                    contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #334155',
                        borderRadius: '8px'
                    }}
                />
                <Legend />
                <Bar dataKey="earnings" fill="#136dec" name="Earnings" radius={[8, 8, 0, 0]} />
                <Bar dataKey="tips" fill="#fbbf24" name="Tips" radius={[8, 8, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
};

interface PerformanceChartProps {
    data: { month: string; revenue: number; target: number }[];
}

export const PerformanceChart: React.FC<PerformanceChartProps> = ({ data }) => {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                    contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #334155',
                        borderRadius: '8px'
                    }}
                />
                <Legend />
                <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10b981"
                    strokeWidth={3}
                    name="Actual Revenue"
                    dot={{ fill: '#10b981', r: 6 }}
                />
                <Line
                    type="monotone"
                    dataKey="target"
                    stroke="#ef4444"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Target"
                    dot={{ fill: '#ef4444', r: 4 }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
};

interface ServicePopularityProps {
    data: { service: string; count: number }[];
}

export const ServicePopularityChart: React.FC<ServicePopularityProps> = ({ data }) => {
    const COLORS = ['#136dec', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis type="number" stroke="#94a3b8" />
                <YAxis dataKey="service" type="category" stroke="#94a3b8" width={150} />
                <Tooltip
                    contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #334155',
                        borderRadius: '8px'
                    }}
                />
                <Bar dataKey="count" fill="#136dec" radius={[0, 8, 8, 0]}>
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};

// Helper function to generate sample data
export const generateRevenueData = (days: number = 7) => {
    const data = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);

        data.push({
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            revenue: Math.floor(Math.random() * 500) + 200,
            orders: Math.floor(Math.random() * 20) + 5
        });
    }

    return data;
};

export const generateOrdersStatusData = () => {
    return [
        { name: 'Completed', value: 45, color: '#10b981' },
        { name: 'In Progress', value: 15, color: '#3b82f6' },
        { name: 'Pending', value: 8, color: '#f59e0b' },
        { name: 'Cancelled', value: 5, color: '#ef4444' }
    ];
};

export const generateEarningsData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map(day => ({
        day,
        earnings: Math.floor(Math.random() * 300) + 100,
        tips: Math.floor(Math.random() * 50) + 10
    }));
};
