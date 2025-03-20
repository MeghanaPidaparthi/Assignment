import React, { useEffect, useRef } from 'react';
import OpenSeadragon from 'openseadragon';
import styled from 'styled-components';

interface WSIViewerProps {
  imageUrl: string;
  detectionResults: Array<[number, number, number, number, string]>;
  onViewportChange?: (viewport: any) => void;
}

const ViewerContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  background: #000;
  border-radius: 8px;
  overflow: hidden;
`;

const OverlayCanvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 2;
`;

const WSIViewer: React.FC<WSIViewerProps> = ({ imageUrl, detectionResults, onViewportChange }) => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const viewerInstance = useRef<OpenSeadragon.Viewer | null>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!viewerRef.current) return;

    // Initialize OpenSeadragon viewer
    viewerInstance.current = OpenSeadragon({
      element: viewerRef.current,
      tileSources: {
        type: 'image',
        url: imageUrl,
        buildPyramid: false
      },
      showNavigationControl: true,
      showNavigator: true,
      navigatorPosition: 'BOTTOM_RIGHT',
      navigatorHeight: '120px',
      navigatorWidth: '180px',
      zoomPerClick: 2,
      animationTime: 0.5,
      blendTime: 0.1,
      springStiffness: 6.5,
      maxZoomPixelRatio: 2,
      minZoomImageRatio: 0.8,
      visibilityRatio: 0.85,
      constrainDuringPan: true,
      showRotationControl: true,
      gestureSettingsMouse: {
        clickToZoom: true,
        dblClickToZoom: true,
        pinchToZoom: true,
        scrollToZoom: true,
        flickEnabled: true,
        flickMinSpeed: 120,
        flickMomentum: 0.25
      }
    });

    // Handle viewport changes
    viewerInstance.current.addHandler('viewport-change', () => {
      if (viewerInstance.current && onViewportChange) {
        const viewport = viewerInstance.current.viewport;
        onViewportChange({
          zoom: viewport.getZoom(),
          center: viewport.getCenter(),
          rotation: viewport.getRotation()
        });
      }
      updateOverlay();
    });

    return () => {
      if (viewerInstance.current) {
        viewerInstance.current.destroy();
      }
    };
  }, [imageUrl]);

  const updateOverlay = () => {
    if (!viewerInstance.current || !overlayRef.current) return;

    const viewer = viewerInstance.current;
    const overlay = overlayRef.current;
    const viewport = viewer.viewport;
    
    // Update canvas size to match viewer
    const viewerSize = viewer.element.getBoundingClientRect();
    overlay.width = viewerSize.width;
    overlay.height = viewerSize.height;

    const ctx = overlay.getContext('2d');
    if (!ctx) return;

    // Clear previous drawings
    ctx.clearRect(0, 0, overlay.width, overlay.height);

    // Draw detection boxes
    detectionResults.forEach(([x1, y1, x2, y2, label]) => {
      // Convert image coordinates to viewport coordinates
      const topLeft = viewport.imageToViewerElementCoordinates(
        new OpenSeadragon.Point(x1, y1)
      );
      const bottomRight = viewport.imageToViewerElementCoordinates(
        new OpenSeadragon.Point(x2, y2)
      );

      const width = bottomRight.x - topLeft.x;
      const height = bottomRight.y - topLeft.y;

      // Draw box
      ctx.strokeStyle = '#E74C3C';
      ctx.lineWidth = 2;
      ctx.strokeRect(topLeft.x, topLeft.y, width, height);

      // Draw label
      ctx.fillStyle = 'rgba(231, 76, 60, 0.8)';
      ctx.font = '12px Arial';
      const textMetrics = ctx.measureText(label);
      const padding = 4;
      
      ctx.fillRect(
        topLeft.x,
        topLeft.y - 20,
        textMetrics.width + padding * 2,
        20
      );

      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(label, topLeft.x + padding, topLeft.y - 6);
    });
  };

  useEffect(() => {
    updateOverlay();
  }, [detectionResults]);

  return (
    <ViewerContainer>
      <div ref={viewerRef} style={{ width: '100%', height: '100%' }} />
      <OverlayCanvas ref={overlayRef} />
    </ViewerContainer>
  );
};

export default WSIViewer; 