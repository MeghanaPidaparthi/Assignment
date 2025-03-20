import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { CircularProgress } from '@mui/material';

interface WSIViewerProps {
  imageUrl: string;
  detectionResults: Array<[number, number, number, number, string]>;
}

const ViewerContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 12px;
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
`;

const WSIViewer: React.FC<WSIViewerProps> = ({ imageUrl, detectionResults }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  const drawDetectionBoxes = (img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(img, 0, 0);

    detectionResults.forEach(([x1, y1, x2, y2, label]) => {
      ctx.strokeStyle = '#E74C3C';
      ctx.lineWidth = 2;
      ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);

      // Draw label background
      ctx.fillStyle = 'rgba(231, 76, 60, 0.8)';
      const textMetrics = ctx.measureText(label);
      const padding = 4;
      ctx.fillRect(
        x1,
        y1 - 20,
        textMetrics.width + padding * 2,
        20
      );

      // Draw label text
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '12px Arial';
      ctx.fillText(label, x1 + padding, y1 - 6);
    });
  };

  const handleImageLoad = (img: HTMLImageElement) => {
    drawDetectionBoxes(img);
    setIsLoading(false);
  };

  useEffect(() => {
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => handleImageLoad(img);
  }, [imageUrl, detectionResults]);

  return (
    <ViewerContainer>
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 0.3s ease'
        }}
      />
      {isLoading && (
        <LoadingContainer>
          <CircularProgress color="primary" size={32} />
          <div>Loading Image...</div>
        </LoadingContainer>
      )}
    </ViewerContainer>
  );
};

export default WSIViewer; 