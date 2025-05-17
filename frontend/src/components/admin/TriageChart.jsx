import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Chart, registerables } from "chart.js";
import { FaChartPie } from "react-icons/fa";

Chart.register(...registerables);

const ChartContainer = styled.div`
  background-color: white;
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-md);
  padding: var(--space-5);
  margin-bottom: var(--space-5);
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const ChartHeader = styled.div`
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

const ChartWrapper = styled.div`
  height: 100%;
  width: 100%;
  position: relative;
  flex: 1;
  min-height: 250px;
`;

const LoadingIndicator = styled.div`
  text-align: center;
  padding: var(--space-6);
  color: var(--primary-color);
  font-weight: bold;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: var(--space-6);
  color: var(--error-color);
`;

const TriageChart = ({ disease }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [triageData, setTriageData] = useState([]);

  useEffect(() => {
    const fetchTriageData = async () => {
      try {
        setLoading(true);
        // Use different endpoint depending on whether a disease is selected
        const endpoint = disease 
          ? `http://localhost:5000/api/triage-data/${disease.id}` 
          : "http://localhost:5000/api/triage-data";
        
        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error("Failed to fetch triage data");
        }
        const data = await response.json();
        setTriageData(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching triage data:", err);
        setError("Failed to load triage data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTriageData();
  }, [disease]); // Re-fetch when disease changes

  useEffect(() => {
    if (triageData.length > 0 && chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext("2d");

      chartInstance.current = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: triageData.map((item) => item.level),
          datasets: [
            {
              data: triageData.map((item) => item.count),
              backgroundColor: triageData.map((item) => item.color),
              borderWidth: 0,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "right",
              labels: {
                padding: 20,
                font: {
                  size: 14,
                },
              },
            },
            title: {
              display: true,
              text: disease 
                ? `${disease.name} - Patient Triage Distribution` 
                : "Patient Triage Distribution",
              font: {
                size: 16,
              },
            },
          },
          cutout: "60%",
        },
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [triageData, disease]);

  if (loading) {
    return (
      <ChartContainer>
        <ChartHeader>
          <HeaderIcon>
            <FaChartPie />
          </HeaderIcon>
          <HeaderTitle>
            {disease ? `${disease.name} - Patient Triage Analysis` : "Patient Triage Analysis"}
          </HeaderTitle>
        </ChartHeader>
        <LoadingIndicator>Loading triage data...</LoadingIndicator>
      </ChartContainer>
    );
  }

  if (error) {
    return (
      <ChartContainer>
        <ChartHeader>
          <HeaderIcon>
            <FaChartPie />
          </HeaderIcon>
          <HeaderTitle>
            {disease ? `${disease.name} - Patient Triage Analysis` : "Patient Triage Analysis"}
          </HeaderTitle>
        </ChartHeader>
        <ErrorMessage>{error}</ErrorMessage>
      </ChartContainer>
    );
  }

  return (
    <ChartContainer>
      <ChartHeader>
        <HeaderIcon>
          <FaChartPie />
        </HeaderIcon>
        <HeaderTitle>
          {disease ? `${disease.name} - Patient Triage Analysis` : "Patient Triage Analysis"}
        </HeaderTitle>
      </ChartHeader>
      <ChartWrapper>
        <canvas ref={chartRef}></canvas>
      </ChartWrapper>
    </ChartContainer>
  );
};

export default TriageChart;
