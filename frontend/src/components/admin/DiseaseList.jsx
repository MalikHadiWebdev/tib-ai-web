import React from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const ListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--space-4);
  margin-bottom: var(--space-5);
`;

const DiseaseCard = styled.div`
  background-color: white;
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-md);
  padding: var(--space-4);
  cursor: pointer;
  transition: all var(--transition-normal);
  animation: ${fadeIn} 0.5s ease-out;
  animation-fill-mode: both;
  animation-delay: ${props => props.index * 0.1}s;
  border-left: 5px solid ${props => props.color};
  transform: ${props => props.active ? 'translateY(-5px)' : 'none'};
  box-shadow: ${props => props.active ? 'var(--shadow-lg)' : 'var(--shadow-md)'};
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-lg);
  }
`;

const DiseaseName = styled.h3`
  color: var(--neutral-800);
  font-size: var(--font-size-lg);
  margin-bottom: var(--space-2);
`;

const PatientCount = styled.div`
  color: ${props => props.color};
  font-size: var(--font-size-2xl);
  font-weight: 700;
`;

const PatientLabel = styled.div`
  color: var(--neutral-600);
  font-size: var(--font-size-sm);
`;

const DiseaseList = ({ diseases, onDiseaseClick, activeDiseaseId }) => {
  return (
    <ListContainer>
      {diseases.map((disease, index) => (
        <DiseaseCard 
          key={disease.id} 
          index={index}
          color={disease.color}
          active={disease.id === activeDiseaseId}
          onClick={() => onDiseaseClick(disease.id)}
        >
          <DiseaseName>{disease.name}</DiseaseName>
          <PatientCount color={disease.color}>{disease.count}</PatientCount>
          <PatientLabel>Patients</PatientLabel>
        </DiseaseCard>
      ))}
    </ListContainer>
  );
};

export default DiseaseList;