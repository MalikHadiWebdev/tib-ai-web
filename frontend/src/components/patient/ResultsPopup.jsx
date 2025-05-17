import React from 'react';
import styled, { keyframes } from 'styled-components';
import { FaExclamationTriangle, FaCheckCircle, FaPrint, FaDownload, FaEnvelope } from 'react-icons/fa';
import { useAppContext } from '../../context/AppContext';
import Report from './Report';
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
    if (props.severity === 'High') return 'var(--severity-red)';
    if (props.severity === 'Moderate') return 'var(--severity-orange)';
    if (props.severity === 'Low') return 'var(--severity-yellow)';
    return 'var(--primary-color)';
  }};
  color: white;
  border-top-left-radius: var(--border-radius-lg);
  border-top-right-radius: var(--border-radius-lg);
  display: flex;
  align-items: center;
  gap: var(--space-3);
`;

const HeaderIcon = styled.div`
  font-size: var(--font-size-xl);
`;

const HeaderTitle = styled.h2`
  margin: 0;
  font-size: var(--font-size-xl);
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
    if (props.severity === 'High') return 'var(--severity-red)';
    if (props.severity === 'Moderate') return 'var(--severity-orange)';
    if (props.severity === 'Low') return 'var(--severity-yellow)';
    return 'var(--primary-color)';
  }};
  color: white;
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

const ResultsPopup = () => {
  const { appState, dispatch } = useAppContext();
  const { diagnosis, currentPatient } = appState;
  
  const handleClose = () => {
    dispatch({ type: 'SET_DIAGNOSIS', payload: null });
  };
  
  const handlePrint = () => {
    window.print();
  };
  
  const handleDownload = async () => {
    const reportElement = document.getElementById('diagnosis-report');
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
      pdf.save(`Medical_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };
  
  const getHeaderIcon = () => {
    if (diagnosis.severity === 'High') {
      return <FaExclamationTriangle />;
    }
    return <FaCheckCircle />;
  };
  
  return (
    <PopupOverlay>
      <PopupContent>
        <PopupHeader severity={diagnosis.severity}>
          <HeaderIcon>{getHeaderIcon()}</HeaderIcon>
          <HeaderTitle>
            Medical Assessment Results
            <SeverityBadge severity={diagnosis.severity}>{diagnosis.severity} Priority</SeverityBadge>
          </HeaderTitle>
        </PopupHeader>
        
        <PopupBody>
          <div id="diagnosis-report">
            <Report diagnosis={diagnosis} patientData={currentPatient} />
          </div>
          
          <ActionBar>
            <ActionButton onClick={handlePrint}>
              <FaPrint /> Print Report
            </ActionButton>
            <ActionButton onClick={handleDownload}>
              <FaDownload /> Download PDF
            </ActionButton>
            <ActionButton primary onClick={handleClose}>
              <FaCheckCircle /> Close
            </ActionButton>
          </ActionBar>
        </PopupBody>
      </PopupContent>
    </PopupOverlay>
  );
};

export default ResultsPopup;