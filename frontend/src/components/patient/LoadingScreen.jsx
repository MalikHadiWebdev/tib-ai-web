import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaSpinner, FaHeartbeat, FaFlask, FaMicroscope, FaFileMedical } from 'react-icons/fa';

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: var(--neutral-100);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  padding: var(--space-6);
  min-height: 400px;
  animation: ${fadeIn} 0.3s ease-out;
`;

const Title = styled.h2`
  color: var(--primary-color);
  margin-bottom: var(--space-5);
  text-align: center;
`;

const LoadingIcon = styled.div`
  font-size: 4rem;
  color: var(--primary-color);
  margin-bottom: var(--space-4);
  animation: ${rotate} 2s linear infinite;
`;

const HeartbeatIcon = styled.div`
  font-size: 2rem;
  color: var(--error-color);
  margin-bottom: var(--space-4);
  animation: ${pulse} 1s ease-in-out infinite;
`;

const StatusMessage = styled.p`
  color: var(--neutral-700);
  font-size: var(--font-size-lg);
  margin-bottom: var(--space-4);
  text-align: center;
`;

const ProgressContainer = styled.div`
  width: 80%;
  max-width: 400px;
  margin-top: var(--space-4);
`;

const ProgressBar = styled.div`
  height: 8px;
  background-color: var(--neutral-300);
  border-radius: 4px;
  margin-bottom: var(--space-3);
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  width: ${props => props.progress}%;
  background-color: var(--primary-color);
  border-radius: 4px;
  transition: width 0.3s ease-out;
`;

const ProgressText = styled.p`
  text-align: center;
  color: var(--neutral-600);
  font-size: var(--font-size-sm);
`;

const StatusStep = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-top: var(--space-3);
  color: ${props => props.active ? 'var(--primary-color)' : 'var(--neutral-500)'};
  font-weight: ${props => props.active ? '600' : '400'};
  transition: color 0.3s ease;
`;

const StepIcon = styled.div`
  font-size: var(--font-size-lg);
`;

const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    { id: 0, text: 'Analyzing your symptoms...', icon: <FaFlask /> },
    { id: 1, text: 'Processing vital signs...', icon: <FaHeartbeat /> },
    { id: 2, text: 'Running diagnostic algorithms...', icon: <FaMicroscope /> },
    { id: 3, text: 'Generating medical report...', icon: <FaFileMedical /> }
  ];
  
  useEffect(() => {
    const totalDuration = 3000; // 3 seconds total
    const stepDuration = totalDuration / steps.length;
    const incrementAmount = 100 / (totalDuration / 50); // Update every 50ms
    
    const interval = setInterval(() => {
      setProgress(prevProgress => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prevProgress + incrementAmount;
      });
    }, 50);
    
    const stepInterval = setInterval(() => {
      setCurrentStep(prevStep => {
        if (prevStep >= steps.length - 1) {
          clearInterval(stepInterval);
          return steps.length - 1;
        }
        return prevStep + 1;
      });
    }, stepDuration);
    
    return () => {
      clearInterval(interval);
      clearInterval(stepInterval);
    };
  }, [steps.length]);
  
  return (
    <LoadingContainer>
      <Title>Analyzing Your Information</Title>
      
      {currentStep === 1 ? (
        <HeartbeatIcon>
          <FaHeartbeat />
        </HeartbeatIcon>
      ) : (
        <LoadingIcon>
          <FaSpinner />
        </LoadingIcon>
      )}
      
      <StatusMessage>{steps[currentStep].text}</StatusMessage>
      
      <ProgressContainer>
        <ProgressBar>
          <ProgressFill progress={progress} />
        </ProgressBar>
        <ProgressText>{Math.round(progress)}% Complete</ProgressText>
      </ProgressContainer>
      
      {steps.map((step) => (
        <StatusStep key={step.id} active={currentStep >= step.id}>
          <StepIcon>{step.icon}</StepIcon>
          <span>{step.text}</span>
        </StatusStep>
      ))}
    </LoadingContainer>
  );
};

export default LoadingScreen;