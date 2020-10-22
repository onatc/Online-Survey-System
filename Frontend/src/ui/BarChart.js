import React from 'react';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// note: this component will need to be in a parent container of non-zero height.
const MyChart = ({ data, categoryKey, barKey }) => {
  // hint: try setting YAxis tickTotal based on maximum y-value to avoid
  // Y scales with fractional decimals
  return (
    <ResponsiveContainer aspect={3.0 / 3.0}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
        <YAxis type="number" allowDecimals={false} />
        <XAxis type="category" dataKey={categoryKey} />
        <Tooltip />
        <Legend />
        <Bar dataKey={barKey} fill="#183064" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default MyChart;
