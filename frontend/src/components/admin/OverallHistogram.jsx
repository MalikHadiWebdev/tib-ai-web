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
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const HistogramHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: var(--space-4);
`;

const HeaderIcon = styled.div`
  font-size: var(--font-size-xl);
  color: var(--primary-color);
  margin-right: var(--space-3);
`;

const HeaderTitle = styled.h3`
  color: var(--neutral-800);
  margin: 0;
`;

const ChartContainer = styled.div`
  height: 100%;
  width: 100%;
  flex: 1;
  min-height: 250px;
`;

const OverallHistogram = ({ data }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  
  useEffect(() => {
    if (chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
      
      const ctx = chartRef.current.getContext('2d');
      
      // const modifiedDatasets = data.datasets.map(dataset => ({
      //   ...dataset,
      //   barPercentage: 0.6,
      //   categoryPercentage: 0.8
      // }));
      
      chartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: data.labels,
          datasets: data.datasets
          // datasets: modifiedDatasets
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Disease Detection Methods Comparison',
              font: {
                size: 16
              }
            },
            legend: {
              position: 'top'
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
            x: {
              title: {
                display: true,
                text: 'Diseases'
              }
            },
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
  }, [data]);
  
  return (
    <HistogramContainer>
      <HistogramHeader>
        <HeaderIcon>
          <FaChartBar />
        </HeaderIcon>
        <HeaderTitle>Overall Disease Detection Analysis</HeaderTitle>
      </HistogramHeader>
      <ChartContainer>
        <canvas ref={chartRef}></canvas>
      </ChartContainer>
    </HistogramContainer>
  );
};

export default OverallHistogram;