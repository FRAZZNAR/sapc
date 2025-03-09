import React, { useRef } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function SentimentChart({ stats }) {
  const chartRef = useRef(null);

  const data = [
    { name: "Positivo", value: stats.Positivo || 0, color: "#198754" },
    { name: "Neutral", value: stats.Neutral || 0, color: "#ffc107" },  
    { name: "Negativo", value: stats.Negativo || 0, color: "#dc3545" }  
  ].filter(item => item.value > 0);
  
  const COLORS = data.map(item => item.color);
  
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip" style={{ 
          backgroundColor: '#fff',
          padding: '5px 10px',
          border: '1px solid #ccc',
          borderRadius: '5px'
        }}>
          <p className="label" style={{ margin: 0 }}>{`${payload[0].name}: ${payload[0].value}%`}</p>
        </div>
      );
    }
    return null;
  };
  
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const exportToPDF = () => {
    if (chartRef.current) {
      html2canvas(chartRef.current, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'mm',
          format: 'a4'
        });
        
        pdf.setFontSize(18);
        pdf.text('Análisis de Sentimiento', pdf.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
        
        pdf.setFontSize(10);
        pdf.text(`Generado el: ${new Date().toLocaleDateString()}`, pdf.internal.pageSize.getWidth() / 2, 30, { align: 'center' });
        
        const imgWidth = 180;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        pdf.addImage(
          imgData, 
          'PNG', 
          (pdf.internal.pageSize.getWidth() - imgWidth) / 2,
          40, 
          imgWidth, 
          imgHeight
        );
        
        pdf.setFontSize(12);
        let startY = 40 + imgHeight + 20;
        
        pdf.text('Detalle de Resultados:', 20, startY);
        startY += 10;
        
        data.forEach((item, index) => {
          pdf.setTextColor(item.color);
          pdf.text(`${item.name}: ${item.value}%`, 30, startY);
          startY += 8;
        });
        
        pdf.save('analisis-sentimiento.pdf');
      });
    }
  };

  return (
    <div className="sentiment-chart-container">
      <div className="sentiment-chart" ref={chartRef} style={{ width: '100%', height: '250px' }}>
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center py-4">No hay datos de sentimiento disponibles</div>
        )}
      </div>
      
      <div className="text-center mt-3">
        <button 
          className="btn btn-primary" 
          onClick={exportToPDF}
          disabled={data.length === 0}
        >
          <i className="fas fa-file-pdf me-2"></i>Exportar a PDF
        </button>
      </div>
    </div>
  );
}

export default SentimentChart;