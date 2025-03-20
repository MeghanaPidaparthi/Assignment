import React, { useState } from 'react';
import styled from 'styled-components';
import { Paper, CircularProgress } from '@mui/material';

const HubContainer = styled.div`
  height: 100%;
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }
`;

const ViewportIndicator = styled.div<{ x: number; y: number; width: number; height: number }>`
  position: absolute;
  border: 2px solid #E74C3C;
  background: rgba(231, 76, 60, 0.1);
  pointer-events: none;
  transition: all 0.3s ease;
  top: ${props => props.y}%;
  left: ${props => props.x}%;
  width: ${props => props.width}%;
  height: ${props => props.height}%;
  box-shadow: 0 0 0 2000px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(2px);
`;

const LoadingContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  z-index: 10;
`;

interface HubViewProps {
  imageUrl: string;
  viewportPosition: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

const HubView: React.FC<HubViewProps> = ({
  imageUrl,
  viewportPosition
}) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <HubContainer>
      <Paper 
        elevation={0}
        sx={{
          height: '100%',
          overflow: 'hidden',
          borderRadius: '12px',
          position: 'relative'
        }}
      >
        <img 
          src={imageUrl} 
          alt="Overview"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: isLoading ? 0 : 1,
            transition: 'opacity 0.3s ease'
          }}
          onLoad={() => setIsLoading(false)}
        />
        {!isLoading && (
          <ViewportIndicator
            x={viewportPosition.x}
            y={viewportPosition.y}
            width={viewportPosition.width}
            height={viewportPosition.height}
          />
        )}
        {isLoading && (
          <LoadingContainer>
            <CircularProgress color="primary" size={32} />
            <div>Loading Overview...</div>
          </LoadingContainer>
        )}
      </Paper>
    </HubContainer>
  );
};

export default HubView; 