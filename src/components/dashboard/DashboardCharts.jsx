import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend, LabelList
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const RolesChart = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-[400px]">
      <h3 className="text-lg font-bold text-gray-800 mb-6">Usuarios por rol</h3>
      <ResponsiveContainer width="100%" height="85%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
            label
            fontSize={14}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export const ServiceRequestsChart = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-[400px]">
  <h3 className="text-lg font-bold text-gray-800 mb-6">
    Solicitudes de servicio (Últimos 6 meses)
  </h3>

  <ResponsiveContainer width="100%" height="85%">
    <BarChart
      data={data}
      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" vertical={false} />

      <XAxis
        dataKey="name"
        axisLine={false}
        tickLine={false}
        fontSize={12}
      />

      <YAxis
        axisLine={false}
        tickLine={false}
        fontSize={12}
        tickFormatter={(value) =>
          new Intl.NumberFormat("es-CO").format(value)
        }
      />

      <Tooltip
        cursor={{ fill: "transparent" }}
        formatter={(value) =>
          `$ ${new Intl.NumberFormat("es-CO").format(value)}`
        }
        contentStyle={{
          borderRadius: "8px",
          border: "none",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
        }}
      />

      <Bar
        dataKey="requests"
        fill="#3b82f6"
        radius={[6, 6, 0, 0]}
        barSize={40}
      >
        <LabelList
          dataKey="requests"
          position="inside"
          fill="#ffffff"
          fontSize={12}
          formatter={(value) =>
            new Intl.NumberFormat("es-CO").format(value)
          }
        />
      </Bar>

    </BarChart>
  </ResponsiveContainer>
</div>
  );
};

export const CommissionsChart = ({ data }) => {
  // rename amount to Total pagado
  const dataAux = data.map((item) => {
    return {
      name: item.name,
      "Total pagado": item.amount,
    };
  });
  data = dataAux;
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-[400px]">
      <h3 className="text-lg font-bold text-gray-800 mb-6">Comisiones pagadas (Últimos 6 meses)</h3>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12}/>
          <YAxis axisLine={false} tickLine={false} fontSize={12}/>
          <Tooltip 
            formatter={(value) =>
              new Intl.NumberFormat('es-CO').format(value)
                ? `$ ${new Intl.NumberFormat('es-CO').format(value)}`
                : value
            }
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          />
          <Line 
            type="monotone" 
            dataKey="Total pagado" 
            stroke="#10b981" 
            strokeWidth={3}
            dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 6 }} 
            label={({ x, y, value }) => (
              <text
                x={x}
                y={y - 10}
                textAnchor="middle"
                fontSize={11}
                fill="#10b981"
              >
                {`$ ${new Intl.NumberFormat('es-CO').format(value)}`}
              </text>
            )}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
