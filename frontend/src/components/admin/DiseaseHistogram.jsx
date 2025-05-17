import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Chart, registerables } from 'chart.js';
import { FaChartBar } from 'react-icons/fa';

Chart.register(...registerables);

const HistogramContainer = styled.div`
  background-color: white;
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-md);
  padding: var(--space-5);
  margin-bottom: var(--space-5);
`;

const HistogramHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: var(--space-4);
`;

const HeaderIcon = styled.div`
  font-size: var(--font-size-xl);
  color: ${props => props.color};
  margin-right: var(--space-3);
`;

const HeaderTitle = styled.h3`
  color: var(--neutral-800);
  margin: 0;
`;

const ChartContainer = styled.div`
  height: 300px;
`;

const DiseaseHistogram = ({ disease }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  
  useEffect(() => {
    if (chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
      
      const ctx = chartRef.current.getContext('2d');
      
      // Mock data for the specific disease
      const data = {
        labels: ['AI Detected', 'Non-AI Detected', 'Actual'],
        datasets: [
          {
            label: disease.name,
            data: [
              disease.count + 2, // AI detected (90% of actual)
              Math.floor(disease.count * 0.8), // Non-AI detected (80% of actual)
              disease.count // Actual count
            ],
            backgroundColor: disease.color,
            borderColor: disease.color,
            borderWidth: 1,
            barPercentage: 0.3, // Make bars thinner (default is 0.9)
            categoryPercentage: 0.8 // Controls spacing between groups
          }
        ]
      };
      
      chartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: `${disease.name} Detection Methods Comparison`,
              font: {
                size: 16
              }
            },
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return `${context.dataset.label}: ${context.raw} patients`;
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Number of Patients'
              }
            }
          },
          animation: {
            duration: 1000
          }
        }
      });
    }
    
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [disease]);
  
  return (
    <HistogramContainer>
      <HistogramHeader>
        <HeaderIcon color={disease.color}>
          <FaChartBar />
        </HeaderIcon>
        <HeaderTitle>{disease.name} Detection Analysis</HeaderTitle>
      </HistogramHeader>
      <ChartContainer>
        <canvas ref={chartRef}></canvas>
      </ChartContainer>
    </HistogramContainer>
  );
};

export default DiseaseHistogram;