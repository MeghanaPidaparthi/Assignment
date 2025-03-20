import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ThemeProvider as MuiThemeProvider } from '@mui/material';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { motion } from 'framer-motion';
import { theme } from './theme/theme';
import WSIViewer from './components/WSIViewer';
import Sidebar from './components/Sidebar';
import HubView from './components/HubView';
import parseDetectionResults from './utils/parseDetectionResults';

const AppContainer = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  grid-template-rows: 200px 1fr;
  height: 100vh;
  background-color: ${({ theme }) => theme.palette.background.default};
  gap: 16px;
  padding: 16px;
`;

const StyledSidebar = styled(motion.div)`
  grid-row: 1 / -1;
  background: ${({ theme }) => theme.palette.background.paper};
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
`;

const StyledHubView = styled(motion.div)`
  background: ${({ theme }) => theme.palette.background.paper};
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
`;

const StyledWSIViewer = styled(motion.div)`
  background: ${({ theme }) => theme.palette.background.paper};
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
`;

// Sample data - replace with actual data
const sampleData = {
  "id": 19,
  "patient_id": "7",
  "wsi_video_url": "None",
  "inference_results": "{'delayTime': 950, 'executionTime': 7223, 'id': 'sync-e1323ad4-a299-4159-9342-1fa220a3c2b5-e1', 'output': {'detection_results': [[121, 4, 163, 45, 'Circular_RBC'], [396, 312, 433, 353, 'Circular_RBC']]}", // Shortened for brevity
  "celery_status": "completed",
  "filename": "7_20241209_024613.png",
  "sample_type": "blood",
  "date": "2024-12-09"
};

function App() {
  const [parsedData, setParsedData] = useState({
    detectionResults: [] as Array<[number, number, number, number, string]>,
    patientId: '',
    sampleType: '',
    date: '',
    filename: ''
  });

  const [viewportPosition, setViewportPosition] = useState({
    x: 0,
    y: 0,
    width: 30,
    height: 30
  });

  useEffect(() => {
    // Parse the detection results when component mounts
    const parsed = parseDetectionResults(sampleData);
    setParsedData(parsed);
  }, []);

  return (
    <MuiThemeProvider theme={theme}>
      <StyledThemeProvider theme={theme}>
        <AppContainer>
          <StyledSidebar
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Sidebar
              patientId={parsedData.patientId}
              sampleType={parsedData.sampleType}
              date={parsedData.date}
              detectionResults={parsedData.detectionResults}
            />
          </StyledSidebar>
          <StyledHubView
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <HubView
              imageUrl={`/images/${parsedData.filename}`}
              viewportPosition={viewportPosition}
            />
          </StyledHubView>
          <StyledWSIViewer
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <WSIViewer
              imageUrl={`/images/${parsedData.filename}`}
              detectionResults={parsedData.detectionResults}
            />
          </StyledWSIViewer>
        </AppContainer>
      </StyledThemeProvider>
    </MuiThemeProvider>
  );
}

export default App;
