import React from 'react';
import styled, { keyframes } from 'styled-components';
import { FaUsers, FaVirus, FaBullseye, FaChartLine } from 'react-icons/fa';
import StatsCard from './StatsCard';
import DiseaseList from './DiseaseList';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const DashboardContainer = styled.div`
  animation: ${fadeIn} 0.5s ease-out;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-4);
  margin-bottom: var(--space-5);
`;

const SectionTitle = styled.h2`
  color: var(--primary-color);
  margin-top: var(--space-6);
  margin-bottom: var(--space-4);
  padding-bottom: var(--space-2);
  border-bottom: 2px solid var(--primary-light);
`;

const Dashboard = ({ stats, onDiseaseClick, activeDiseaseId }) => {
  return (
    <DashboardContainer>
      <StatsContainer>
        <StatsCard
          title="Total Patients"
          value={stats.totalPatients}
          icon={<FaUsers />}
          color="#1890FF"
          trend={stats.patientsTrend || "No trend data"}
        />
        <StatsCard
          title="Total Diseases Detected"
          value={stats.totalDiseasesDetected}
          icon={<FaVirus />}
          color="#52C41A"
          trend={stats.diseasesTrend || "No trend data"}
        />
        <StatsCard
          title="Confidence Score"
          value={stats.accuracy}
          icon={<FaBullseye />}
          color="#722ED1"
          trend={stats.accuracyTrend || "No trend data"}
        />
      </StatsContainer>
      
      <SectionTitle>Disease Distribution</SectionTitle>
      <DiseaseList 
        diseases={stats.diseases} 
        onDiseaseClick={onDiseaseClick}
        activeDiseaseId={activeDiseaseId}
      />
    </DashboardContainer>
  );
};

export default Dashboard;