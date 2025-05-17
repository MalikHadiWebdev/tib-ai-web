import React, { useState } from 'react';
import styled from 'styled-components';
import Dashboard from '../components/admin/Dashboard';
import DiseaseHistogram from '../components/admin/DiseaseHistogram';
import PakistanMap from '../components/admin/PakistanMap';
import OverallHistogram from '../components/admin/OverallHistogram';
import TriageChart from '../components/admin/TriageChart';
import PatientTable from '../components/admin/PatientTable';
import { useAppContext } from '../context/AppContext';
import { FaChartLine, FaUserInjured } from 'react-icons/fa';

const AdminPageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-4);
`;

const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: var(--space-6);
  animation: fadeIn var(--transition-normal);
`;

const Title = styled.h1`
  color: var(--primary-color);
  margin-bottom: var(--space-2);
`;

const Subtitle = styled.p`
  color: var(--neutral-600);
  font-size: var(--font-size-lg);
  max-width: 800px;
  margin: 0 auto var(--space-4);
`;

const MainSection = styled.div`
  animation: slideInUp var(--transition-normal);
`;

const DiseaseHistogramSection = styled.div`
  margin-top: var(--space-5);
  margin-bottom: var(--space-5);
  display: ${props => props.active ? 'block' : 'none'};
  animation: ${props => props.active ? 'slideInUp var(--transition-normal)' : 'none'};
  // width: 80%; /* Make the histogram thinner */
  margin-left: auto;
  margin-right: auto;
`;

const PakistanMapSection = styled.div`
  margin-top: var(--space-5);
  margin-bottom: var(--space-5);
  display: ${props => props.active ? 'block' : 'none'};
  animation: ${props => props.active ? 'slideInUp var(--transition-normal)' : 'none'};
`;

const ChartSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-5);
  margin-top: var(--space-5);
  margin-bottom: var(--space-5);
  
  & > div {
    height: 450px; /* Set consistent height for all charts */
    display: flex;
    flex-direction: column;
  }
`;

const SectionTitle = styled.h2`
  color: var(--primary-color);
  margin-top: var(--space-6);
  margin-bottom: var(--space-4);
  padding-bottom: var(--space-2);
  border-bottom: 2px solid var(--primary-light);
`;

const TabContainer = styled.div`
  display: flex;
  gap: var(--space-4);
  margin-bottom: var(--space-6);
  padding: var(--space-4) 0;
  border-bottom: 3px solid var(--neutral-300);
  justify-content: center;
`;

const TabButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  background-color: ${props => props.active ? 'var(--primary-color)' : 'white'};
  color: ${props => props.active ? 'white' : 'var(--neutral-700)'};
  border: 3px solid ${props => props.active ? 'var(--primary-color)' : 'var(--neutral-400)'};
  border-radius: var(--border-radius-md);
  padding: var(--space-4) var(--space-6);
  font-size: var(--font-size-xl);
  font-weight: 700;
  cursor: pointer;
  transition: all var(--transition-fast);
  box-shadow: ${props => props.active ? 'var(--shadow-lg)' : 'none'};
  min-width: 200px;

  &:hover {
    background-color: ${props => props.active ? 'var(--primary-dark)' : 'var(--neutral-200)'};
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
  }
  
  svg {
    font-size: var(--font-size-xl);
  }
`;

const TabIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AdminPage = () => {
  const { appState } = useAppContext();
  const [activeDiseaseId, setActiveDiseaseId] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' or 'patients'
  
  const handleDiseaseClick = (diseaseId) => {
    if (activeDiseaseId === diseaseId) {
      setActiveDiseaseId(null);
    } else {
      setActiveDiseaseId(diseaseId);
    }
  };
  
  const activeDisease = appState.adminStats.diseases.find(
    disease => disease.id === activeDiseaseId
  );
  
  return (
    <AdminPageContainer>
      <HeaderSection>
        <Title>Admin Dashboard</Title>
        <Subtitle>
          Monitor patient data, disease statistics, and AI performance metrics to optimize
          healthcare delivery and diagnostic accuracy.
        </Subtitle>
      </HeaderSection>
      
      <TabContainer>
        <TabButton 
          active={activeTab === 'dashboard'} 
          onClick={() => setActiveTab('dashboard')}
        >
          <TabIcon><FaChartLine /></TabIcon> Analytics Dashboard
        </TabButton>
        <TabButton 
          active={activeTab === 'patients'} 
          onClick={() => setActiveTab('patients')}
        >
          <TabIcon><FaUserInjured /></TabIcon> Patient Records
        </TabButton>
      </TabContainer>
      
      {activeTab === 'dashboard' && (
        <MainSection>
          <Dashboard 
            stats={appState.adminStats} 
            onDiseaseClick={handleDiseaseClick}
            activeDiseaseId={activeDiseaseId}
          />
          
          <DiseaseHistogramSection active={activeDiseaseId !== null}>
            {activeDisease && (
              <DiseaseHistogram disease={activeDisease} />
            )}
          </DiseaseHistogramSection>
          
          <PakistanMapSection active={activeDiseaseId !== null}>
            {activeDisease && (
              <PakistanMap disease={activeDisease} />
            )}
          </PakistanMapSection>
          
          <ChartSection>
            <OverallHistogram data={appState.adminStats.histogramData} />
            <TriageChart disease={activeDisease} />
          </ChartSection>
        </MainSection>
      )}
      
      {activeTab === 'patients' && (
        <div>
          <SectionTitle>Patient Records</SectionTitle>
          <PatientTable />
        </div>
      )}
    </AdminPageContainer>
  );
};

export default AdminPage;