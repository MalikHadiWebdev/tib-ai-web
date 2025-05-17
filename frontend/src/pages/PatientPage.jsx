import React from 'react';
import styled from 'styled-components';
import PatientForm from '../components/patient/PatientForm';
import LoadingScreen from '../components/patient/LoadingScreen';
import ResultsPopup from '../components/patient/ResultsPopup';
import { useAppContext } from '../context/AppContext';

const PatientPageContainer = styled.div`
  max-width: 800px;
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
  max-width: 600px;
  margin: 0 auto var(--space-4);
`;

const PatientPage = () => {
  const { appState } = useAppContext();
  const { loading, diagnosis } = appState;

  return (
    <PatientPageContainer>
      <HeaderSection>
        <Title>Medical Triage Assessment</Title>
        <Subtitle>
          Please provide your information below to receive an initial medical assessment.
          Our AI-powered system will analyze your symptoms and provide guidance on next steps.
        </Subtitle>
      </HeaderSection>
      
      {!loading && !diagnosis && <PatientForm />}
      {loading && <LoadingScreen />}
      {diagnosis && <ResultsPopup />}
    </PatientPageContainer>
  );
};

export default PatientPage;