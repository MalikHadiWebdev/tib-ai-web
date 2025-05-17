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

const CardContainer = styled.div`
  background-color: white;
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-md);
  padding: var(--space-4);
  display: flex;
  align-items: center;
  transition: transform var(--transition-normal), box-shadow var(--transition-normal);
  animation: ${fadeIn} 0.5s ease-out;
  animation-fill-mode: both;
  animation-delay: ${props => props.index * 0.1}s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-lg);
  }
`;

const IconContainer = styled.div`
  width: 60px;
  height: 60px;
  background-color: ${props => `${props.color}20`};
  color: ${props => props.color};
  border-radius: var(--border-radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  margin-right: var(--space-4);
`;

const CardContent = styled.div`
  flex: 1;
`;

const CardTitle = styled.h3`
  color: var(--neutral-700);
  font-size: var(--font-size-md);
  margin-bottom: var(--space-2);
`;

const CardValue = styled.div`
  color: var(--neutral-900);
  font-size: var(--font-size-2xl);
  font-weight: 700;
  margin-bottom: var(--space-1);
`;

const CardTrend = styled.div`
  color: ${props => props.trend.startsWith('+') ? 'var(--success-color)' : 'var(--error-color)'};
  font-size: var(--font-size-sm);
  display: flex;
  align-items: center;
`;

const StatsCard = ({ title, value, icon, color, trend, index = 0 }) => {
  return (
    <CardContainer index={index}>
      <IconContainer color={color}>
        {icon}
      </IconContainer>
      <CardContent>
        <CardTitle>{title}</CardTitle>
        <CardValue>{value}</CardValue>
        {trend && <CardTrend trend={trend}>{trend}</CardTrend>}
      </CardContent>
    </CardContainer>
  );
};

export default StatsCard;