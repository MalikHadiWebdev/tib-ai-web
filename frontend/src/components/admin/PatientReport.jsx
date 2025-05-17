import React from 'react';
import styled, { keyframes } from 'styled-components';
import { FaExclamationTriangle, FaCheckCircle, FaPrint, FaDownload, FaTimes } from 'react-icons/fa';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--space-4);
  animation: ${fadeIn} 0.3s ease-out;
`;

const PopupContent = styled.div`
  background-color: var(--neutral-100);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  animation: ${fadeIn} 0.3s ease-out;
`;

const PopupHeader = styled.div`
  padding: var(--space-4);
  background-color: ${props => {
    if (props.severity === 'Critical' || props.severity === 'Urgent') return 'var(--severity-red)';
    if (props.severity === 'Medium') return 'var(--severity-orange)';
    return 'var(--primary-color)';
  }};
  color: white;
  border-top-left-radius: var(--border-radius-lg);
  border-top-right-radius: var(--border-radius-lg);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HeaderTitle = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-3);
`;

const HeaderIcon = styled.div`
  font-size: var(--font-size-xl);
`;

const Title = styled.h2`
  margin: 0;
  font-size: var(--font-size-xl);
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: var(--font-size-lg);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform var(--transition-fast);
  
  &:hover {
    transform: scale(1.2);
  }
`;

const PopupBody = styled.div`
  padding: var(--space-5);
`;

const SeverityBadge = styled.span`
  display: inline-block;
  padding: var(--space-1) var(--space-3);
  border-radius: var(--border-radius-md);
  font-weight: 600;
  font-size: var(--font-size-sm);
  margin-left: var(--space-3);
  background-color: ${props => {
    if (props.severity === 'Critical' || props.severity === 'Urgent') return 'var(--severity-red)';
    if (props.severity === 'Medium') return 'var(--severity-orange)';
    return 'var(--primary-color)';
  }};
  color: white;
`;

const ReportSection = styled.div`
  margin-bottom: var(--space-4);
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--neutral-300);
  
  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
`;

const SectionTitle = styled.h3`
  color: var(--neutral-800);
  margin-bottom: var(--space-3);
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--space-4);
`;

const InfoItem = styled.div`
  margin-bottom: var(--space-3);
`;

const InfoLabel = styled.div`
  font-weight: 600;
  color: var(--neutral-700);
  font-size: var(--font-size-sm);
`;

const InfoValue = styled.div`
  color: var(--neutral-900);
`;

const DiagnosisCard = styled.div`
  background-color: white;
  border: 1px solid var(--neutral-300);
  border-radius: var(--border-radius-md);
  padding: var(--space-4);
  margin-top: var(--space-3);
`;

const DiagnosisHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--space-3);
`;

const DiagnosisTitle = styled.h4`
  margin: 0;
  color: var(--primary-color);
`;

const DiagnosisDetails = styled.div`
  color: var(--neutral-700);
  white-space: pre-line;
`;

const ConfidenceScore = styled.div`
  font-weight: 600;
  color: ${props => props.score >= 0.9 ? 'var(--success-color)' : 'var(--warning-color)'};
`;

const ActionBar = styled.div`
  display: flex;
  gap: var(--space-3);
  margin-top: var(--space-5);
  justify-content: center;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--border-radius-md);
  background-color: ${props => props.primary ? 'var(--primary-color)' : 'white'};
  color: ${props => props.primary ? 'white' : 'var(--neutral-700)'};
  border: ${props => props.primary ? 'none' : '1px solid var(--neutral-400)'};
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:hover {
    background-color: ${props => props.primary ? 'var(--primary-dark)' : 'var(--neutral-200)'};
    transform: translateY(-2px);
  }
`;

const PatientReport = ({ patient, onClose }) => {
  const handlePrint = () => {
    window.print();
  };
  
  const handleDownload = async () => {
    const reportElement = document.getElementById('admin-patient-report');
    if (!reportElement) return;
    
    try {
      const canvas = await html2canvas(reportElement, { scale: 2 });
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      
      pdf.addImage(imgData, 'JPEG', imgX, 0, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`Patient_Report_${patient.id}_${patient.name}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };
  
  const getHeaderIcon = () => {
    if (patient.severity === 'Critical' || patient.severity === 'Urgent') {
      return <FaExclamationTriangle />;
    }
    return <FaCheckCircle />;
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };
  
  return (
    <PopupOverlay>
      <PopupContent>
        <PopupHeader severity={patient.severity}>
          <HeaderTitle>
            <HeaderIcon>{getHeaderIcon()}</HeaderIcon>
            <Title>
              Patient Report
              <SeverityBadge severity={patient.severity}>{patient.severity}</SeverityBadge>
            </Title>
          </HeaderTitle>
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
        </PopupHeader>
        
        <PopupBody>
          <div id="admin-patient-report">
            <ReportSection>
              <SectionTitle>Patient Information</SectionTitle>
              <InfoGrid>
                <InfoItem>
                  <InfoLabel>Patient ID</InfoLabel>
                  <InfoValue>{patient.id}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Name</InfoLabel>
                  <InfoValue>{patient.name}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Age</InfoLabel>
                  <InfoValue>{patient.age}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Gender</InfoLabel>
                  <InfoValue>{patient.gender}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Location</InfoLabel>
                  <InfoValue>{patient.location}</InfoValue>
                </InfoItem>
              </InfoGrid>
            </ReportSection>
            
            <ReportSection>
              <SectionTitle>Vital Signs</SectionTitle>
              <InfoGrid>
                <InfoItem>
                  <InfoLabel>Temperature</InfoLabel>
                  <InfoValue>{patient.temperature_f}°F</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Blood Pressure</InfoLabel>
                  <InfoValue>{patient.blood_pressure}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Blood Glucose</InfoLabel>
                  <InfoValue>{patient.blood_glucose} mg/dL</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Pregnancy Status</InfoLabel>
                  <InfoValue>{patient.pregnancy_status}</InfoValue>
                </InfoItem>
              </InfoGrid>
            </ReportSection>
            
            <ReportSection>
              <SectionTitle>Symptoms</SectionTitle>
              <InfoValue>{patient.symptoms || 'No symptoms recorded'}</InfoValue>
            </ReportSection>
            
            <ReportSection>
              <SectionTitle>Diagnosis</SectionTitle>
              <DiagnosisCard>
                <DiagnosisHeader>
                  <DiagnosisTitle>{patient.disease}</DiagnosisTitle>
                  <ConfidenceScore score={patient.confidence_score}>
                    {(patient.confidence_score * 100).toFixed(1)}% Confidence
                  </ConfidenceScore>
                </DiagnosisHeader>
                <DiagnosisDetails>
                  {patient.comment || 'No additional details available'}
                </DiagnosisDetails>
              </DiagnosisCard>
            </ReportSection>
          </div>
          
          <ActionBar>
            <ActionButton onClick={handlePrint}>
              <FaPrint /> Print Report
            </ActionButton>
            <ActionButton onClick={handleDownload}>
              <FaDownload /> Download PDF
            </ActionButton>
            <ActionButton primary onClick={onClose}>
              <FaTimes /> Close
            </ActionButton>
          </ActionBar>
        </PopupBody>
      </PopupContent>
    </PopupOverlay>
  );
};

export default PatientReport; 