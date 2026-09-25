import React from 'react';
import { useStore } from '../../context/StoreContext';
import { formatCurrency } from '../../utils/formatters';
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Users,
  CreditCard
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

export default function SalesReports() {
  const { salesData, orders } = useStore();

  const totalRevenue = salesData.reduce((acc, curr) => acc + curr.revenue, 0);
  const totalOrdersCount = salesData.reduce((acc, curr) => acc + curr.orders, 0);

  // Payment method breakdown data
  const paymentSplitData = [
    { name: 'Online (Razorpay)', value: 68, color: '#3b82f6' },
    { name: 'Counter Cash', value: 32, color: '#10b981' }
  ];

  // Best selling items data
  const topSellers = [
    { name: 'Paneer Butter Masala Roll', sold: 142, revenue: 12780 },
    { name: 'Chicken Crispy Burger', sold: 118, revenue: 14160 },
    { name: 'Oreo Chocolate Thick Shake', sold: 95, revenue: 7125 },
    { name: 'Veg Schezwan Fried Rice', sold: 88, revenue: 7040 },
    { name: 'Iced Cold Coffee', sold: 76, revenue: 4180 }
  ];

  return (
    <div>
      <div style={styles.header}>
        <div>
          <h1 style={styles.pageTitle}>Sales & Performance Analytics</h1>
          <p style={styles.pageSubtitle}>
            Revenue trends, peak ordering hours, payment splits, and item velocity
          </p>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div style={styles.kpiGrid}>
        <div style={styles.kpiCard}>
          <div style={styles.kpiIconWrapper}>
            <DollarSign size={20} color="var(--accent-primary)" />
          </div>
          <div>
            <div style={styles.kpiLabel}>Today's Total Revenue</div>
            <div style={styles.kpiValue}>{formatCurrency(totalRevenue)}</div>
          </div>
        </div>

        <div style={styles.kpiCard}>
          <div style={styles.kpiIconWrapper}>
            <ShoppingBag size={20} color="#3b82f6" />
          </div>
          <div>
            <div style={styles.kpiLabel}>Total Orders Served</div>
            <div style={styles.kpiValue}>{totalOrdersCount}</div>
          </div>
        </div>

        <div style={styles.kpiCard}>
          <div style={styles.kpiIconWrapper}>
            <TrendingUp size={20} color="#10b981" />
          </div>
          <div>
            <div style={styles.kpiLabel}>Average Order Value</div>
            <div style={styles.kpiValue}>{formatCurrency(totalRevenue / totalOrdersCount)}</div>
          </div>
        </div>

        <div style={styles.kpiCard}>
          <div style={styles.kpiIconWrapper}>
            <CreditCard size={20} color="#8b5cf6" />
          </div>
          <div>
            <div style={styles.kpiLabel}>Online vs Cash Ratio</div>
            <div style={styles.kpiValue}>68% / 32%</div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div style={styles.chartsGrid}>
        {/* Hourly Revenue Trend */}
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Hourly Revenue & Peak Ordering Hours</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={salesData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="hour" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                  formatter={(val) => formatCurrency(val)}
                />
                <Bar dataKey="revenue" fill="var(--accent-primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Split Pie */}
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Payment Method Split</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={paymentSplitData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {paymentSplitData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                  formatter={(val) => `${val}%`}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Sellers Table */}
      <div style={styles.tableCard}>
        <h3 style={styles.cardHeading}>Top-Selling Items (Velocity Ranking)</h3>
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Item Name</th>
                <th>Units Sold</th>
                <th>Revenue Generated</th>
                <th>Popularity</th>
              </tr>
            </thead>
            <tbody>
              {topSellers.map((item, idx) => (
                <tr key={idx}>
                  <td><strong>#{idx + 1}</strong></td>
                  <td>{item.name}</td>
                  <td><strong>{item.sold}</strong> orders</td>
                  <td style={{ color: 'var(--accent-primary)', fontWeight: '600' }}>
                    {formatCurrency(item.revenue)}
                  </td>
                  <td>
                    <div style={styles.progressBar}>
                      <div
                        style={{
                          ...styles.progressFill,
                          width: `${(item.sold / 150) * 100}%`
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const styles = {
  header: {
    marginBottom: '1.5rem'
  },
  pageTitle: {
    fontSize: '1.6rem',
    fontWeight: '700',
    color: 'var(--text-primary)'
  },
  pageSubtitle: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)'
  },
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1rem',
    marginBottom: '1.5rem'
  },
  kpiCard: {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    padding: '1.25rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  kpiIconWrapper: {
    width: '42px',
    height: '42px',
    borderRadius: '10px',
    backgroundColor: 'var(--bg-hover)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  kpiLabel: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
    marginBottom: '0.2rem'
  },
  kpiValue: {
    fontSize: '1.35rem',
    fontWeight: '700',
    color: 'var(--text-primary)'
  },
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: '1.8fr 1fr',
    gap: '1.5rem',
    marginBottom: '1.5rem'
  },
  chartCard: {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '16px',
    padding: '1.25rem'
  },
  chartTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    marginBottom: '1rem',
    color: 'var(--text-primary)'
  },
  tableCard: {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '16px',
    padding: '1.25rem'
  },
  cardHeading: {
    fontSize: '1.05rem',
    fontWeight: '600',
    marginBottom: '1rem'
  },
  tableWrapper: {
    overflowX: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
    fontSize: '0.85rem'
  },
  progressBar: {
    width: '120px',
    height: '8px',
    backgroundColor: 'var(--bg-hover)',
    borderRadius: '4px',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'var(--accent-primary)',
    borderRadius: '4px'
  }
};
