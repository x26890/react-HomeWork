import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';

const SubscriberChart = ({ data, title = "Growth Trend" }) => {
  // 如果沒有數據，顯示簡單的提示
  if (!data || data.length === 0) {
    return (
      <div className="row mt-5">
        <div className="col-12 text-center py-5 border border-secondary border-opacity-25">
          <p className="text-secondary">No growth data available for this member.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="row mt-5">
      <div className="col-12">
        <h6 className="text-info fw-bold mb-3 border-start border-info border-4 ps-3">
          {title}
        </h6>
        <div className="card bg-black border-secondary border-opacity-25 p-4" style={{ height: '400px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorSubs" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0dcaf0" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#0dcaf0" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="#666" 
                fontSize={12} 
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#666" 
                fontSize={12} 
                domain={['auto', 'auto']} 
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v} 
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#000', 
                  border: '1px solid #0dcaf0',
                  borderRadius: '4px',
                  color: '#fff' 
                }}
                itemStyle={{ color: '#0dcaf0' }}
                cursor={{ stroke: '#0dcaf0', strokeWidth: 1 }}
              />
              <Area 
                type="monotone" 
                dataKey="subs" 
                stroke="#0dcaf0" 
                strokeWidth={3} 
                fill="url(#colorSubs)" 
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SubscriberChart;