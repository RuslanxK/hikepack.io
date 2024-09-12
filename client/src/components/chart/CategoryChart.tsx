import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { CategoryChartProps } from '../../types/category';


const CategoryChart: React.FC<CategoryChartProps> = ({ categories }) => {
  const chartData = {
    labels: categories.map((category) => category.name),
    datasets: [
      {
        label: ` weight`,
        data: categories.map((category) => category.totalWeight),
        backgroundColor: categories.map((category) => category.color),
        hoverOffset: 1,
        borderWidth: 0.5,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        display: false,
      },
    },
    aspectRatio: 1,
    cutout: '50%',
    
    animation: {
      animateRotate: false,
    },
    responsive: true,
    
    
  };

  return <Doughnut data={chartData} options={chartOptions} />;
};

export default CategoryChart;
