import React from 'react';
import styled from 'styled-components';
import { FaHospital, FaCalendarAlt, FaUserMd, FaExclamationTriangle } from 'react-icons/fa';

const ReportContainer = styled.div`
  border: 1px solid var(--neutral-300);
  border-radius: var(--border-radius-md);
  overflow: hidden;
`;

const ReportHeader = styled.div`
  background-color: var(--primary-color);
  color: white;
  padding: var(--space-4);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HospitalInfo = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
`;

const HospitalLogo = styled.div`
  font-size: var(--font-size-xl);
`;

const HospitalName = styled.h3`
  margin: 0;
  font-size: var(--font-size-lg);
`;

const ReportDate = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-sm);
`;

const ReportBody = styled.div`
  padding: var(--space-4);
  background-color: white;
`;

const ReportSection = styled.div`
  margin-bottom: var(--space-4);
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h4`
  color: var(--primary-color);
  margin-bottom: var(--space-3);
  padding-bottom: var(--space-2);
  border-bottom: 1px solid var(--neutral-300);
`;

const PatientInfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--space-3);
`;

const InfoItem = styled.div`
  margin-bottom: var(--space-3);
`;

const InfoLabel = styled.span`
  display: block;
  font-size: var(--font-size-sm);
  color: var(--neutral-600);
`;

const InfoValue = styled.span`
  display: block;
  font-weight: 500;
`;

const DiagnosisResult = styled.div`
  background-color: var(--primary-light);
  border-left: 4px solid var(--primary-color);
  padding: var(--space-4);
  margin-bottom: var(--space-4);
  border-radius: 0 var(--border-radius-md) var(--border-radius-md) 0;
`;

const DiseaseName = styled.h3`
  color: var(--primary-dark);
  margin-bottom: var(--space-2);
`;

const TreatmentSection = styled.div`
  background-color: var(--neutral-200);
  padding: var(--space-4);
  border-radius: var(--border-radius-md);
  margin-top: var(--space-4);
`;

const ActionRequired = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-3);
  color: ${props => {
    if (props.severity === 'High') return 'var(--severity-red)';
    if (props.severity === 'Moderate') return 'var(--severity-orange)';
    if (props.severity === 'Low') return 'var(--severity-yellow)';
    return 'var(--primary-color)';
  }};
  font-weight: 600;
`;

const DoctorSection = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-top: var(--space-5);
  padding-top: var(--space-4);
  border-top: 1px dashed var(--neutral-300);
`;

const DoctorIcon = styled.div`
  font-size: var(--font-size-xl);
  color: var(--primary-color);
`;

const DoctorInfo = styled.div``;

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const Report = ({ diagnosis, patientData }) => {
  // Add fallback values if certain properties are missing
  const displayDiagnosis = {
    disease: diagnosis.disease || 'Unknown',
    severity: diagnosis.severity || 'Moderate',
    recommendedAction: diagnosis.recommendedAction || 'Consult with a healthcare provider',
    details: diagnosis.details || diagnosis.comment || 'Based on your symptoms, please follow the recommended action.',
    date: diagnosis.date || new Date().toISOString(),
    confidence: diagnosis.confidence || 0.85
  };

  return (
    <ReportContainer>
      <ReportHeader>
        <HospitalInfo>
          <HospitalLogo>
            <FaHospital />
          </HospitalLogo>
          <HospitalName>American Medical Center</HospitalName>
        </HospitalInfo>
        <ReportDate>
          <FaCalendarAlt />
          {formatDate(displayDiagnosis.date)}
        </ReportDate>
      </ReportHeader>
      
      <ReportBody>
        <ReportSection>
          <SectionTitle>Patient Information</SectionTitle>
          <PatientInfoGrid>
            <InfoItem>
              <InfoLabel>Age</InfoLabel>
              <InfoValue>{patientData.age} years</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Gender</InfoLabel>
              <InfoValue>{patientData.gender}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Location</InfoLabel>
              <InfoValue>{patientData.location}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Temperature</InfoLabel>
              <InfoValue>{patientData.temperature}°F</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Blood Pressure</InfoLabel>
              <InfoValue>{patientData.bloodPressure}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Blood Sugar</InfoLabel>
              <InfoValue>{patientData.sugarLevel} mg/dL</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Pregnancy Status</InfoLabel>
              <InfoValue>{patientData.pregnant === 'yes' ? 'Pregnant' : 'Not Pregnant'}</InfoValue>
            </InfoItem>
          </PatientInfoGrid>
        </ReportSection>
        
        <ReportSection>
          <SectionTitle>Symptoms</SectionTitle>
          <p>{patientData.symptoms}</p>
          
          {patientData.symptomImage && (
            <div>
              <InfoLabel>Uploaded Image</InfoLabel>
              <img 
                src={URL.createObjectURL(patientData.symptomImage)} 
                alt="Symptom"
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '200px', 
                  marginTop: 'var(--space-2)',
                  borderRadius: 'var(--border-radius-md)'
                }} 
              />
            </div>
          )}
        </ReportSection>
        
        <ReportSection>
          <SectionTitle>Diagnosis</SectionTitle>
          <DiagnosisResult>
            <DiseaseName>{displayDiagnosis.disease}</DiseaseName>
            <ActionRequired severity={displayDiagnosis.severity}>
              <FaExclamationTriangle /> {displayDiagnosis.severity} Priority - {displayDiagnosis.recommendedAction}
            </ActionRequired>
            <p>{displayDiagnosis.details}</p>
            {displayDiagnosis.confidence && (
              <p><strong>Confidence Score:</strong> {(displayDiagnosis.confidence * 100).toFixed(1)}%</p>
            )}
          </DiagnosisResult>
          
          <TreatmentSection>
            <h4>Recommended Treatment Plan</h4>
            <ul>
              <li>Consult with a healthcare provider within 24 hours</li>
              <li>Monitor temperature and other vital signs</li>
              <li>Rest and stay hydrated</li>
              <li>Bring this report to your healthcare provider</li>
            </ul>
          </TreatmentSection>
        </ReportSection>
        
        <DoctorSection>
          <DoctorIcon>
            <FaUserMd />
          </DoctorIcon>
          <DoctorInfo>
            <p>
              <strong>This is an AI-assisted preliminary assessment.</strong><br />
              Please consult with a healthcare professional for definitive diagnosis and treatment.
            </p>
          </DoctorInfo>
        </DoctorSection>
      </ReportBody>
    </ReportContainer>
  );
};

export default Report;