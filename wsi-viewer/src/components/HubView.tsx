import React, { useEffect, useRef } from 'react';
import OpenSeadragon from 'openseadragon';
import styled from 'styled-components';
import { Paper, CircularProgress } from '@mui/material';

const HubContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  background: ${({ theme }) => theme.palette.background.paper};
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ViewportIndicator = styled.div<{ $position: { x: number; y: number; width: number; height: number } }>`
  position: absolute;
  border: 2px solid #E74C3C;
  background: rgba(231, 76, 60, 0.1);
  pointer-events: none;
  z-index: 2;
  transition: all 0.3s ease;
  top: ${props => props.$position.y}%;
  left: ${props => props.$position.x}%;
  width: ${props => props.$position.width}%;
  height: ${props => props.$position.height}%;
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

const HubView: React.FC<HubViewProps> = ({ imageUrl, viewportPosition }) => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const viewerInstance = useRef<OpenSeadragon.Viewer | null>(null);

  useEffect(() => {
    if (!viewerRef.current) return;

    viewerInstance.current = OpenSeadragon({
      element: viewerRef.current,
      tileSources: {
        type: 'image',
        url: imageUrl
      },
      showNavigationControl: false,
      showNavigator: false,
      constrainDuringPan: true,
      visibilityRatio: 1,
      homeFillsViewer: true,
      mouseNavEnabled: false,
      gestureSettingsMouse: {
        clickToZoom: false,
        dblClickToZoom: false,
        pinchToZoom: false,
        scrollToZoom: false,
        flickEnabled: false
      }
    });

    return () => {
      if (viewerInstance.current) {
        viewerInstance.current.destroy();
      }
    };
  }, [imageUrl]);

  return (
    <HubContainer>
      <div ref={viewerRef} style={{ width: '100%', height: '100%' }} />
      <ViewportIndicator $position={viewportPosition} />
    </HubContainer>
  );
};

export default HubView; 