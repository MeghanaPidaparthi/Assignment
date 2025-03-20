import React from 'react';
import styled from 'styled-components';
import { Typography, Divider, Chip, Box, useTheme } from '@mui/material';
import { Science, Person, CalendarToday, LocalHospital } from '@mui/icons-material';
import { motion } from 'framer-motion';

const SidebarContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 4px;
`;

const InfoSection = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const DetailRow = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.4);
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.8);
    transform: translateX(4px);
  }
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-top: 16px;
`;

const StatBox = styled(motion.div)`
  padding: 16px;
  border-radius: 12px;
  background: ${({ theme }) => theme.palette.background.default};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  }
`;

const ChipsContainer = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
`;

interface SidebarProps {
  patientId: string;
  sampleType: string;
  date: string;
  detectionResults: Array<[number, number, number, number, string]>;
}

const Sidebar: React.FC<SidebarProps> = ({
  patientId,
  sampleType,
  date,
  detectionResults
}) => {
  const muiTheme = useTheme();
  const totalDetections = detectionResults.length;
  const uniqueTypes = detectionResults
    .map(result => result[4])
    .reduce((unique: string[], item) => 
      unique.includes(item) ? unique : [...unique, item], 
    []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <SidebarContainer>
      <InfoSection
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Typography variant="h5" fontWeight="600" color="primary">
          Patient Information
        </Typography>
        
        <DetailRow variants={itemVariants}>
          <Person color="primary" />
          <Typography>
            Patient ID: <strong>{patientId}</strong>
          </Typography>
        </DetailRow>

        <DetailRow variants={itemVariants}>
          <Science color="primary" />
          <Typography>
            Sample Type: <strong style={{ textTransform: 'capitalize' }}>{sampleType}</strong>
          </Typography>
        </DetailRow>

        <DetailRow variants={itemVariants}>
          <CalendarToday color="primary" />
          <Typography>
            Date: <strong>{date}</strong>
          </Typography>
        </DetailRow>
      </InfoSection>

      <Divider sx={{ margin: '8px 0' }} />

      <InfoSection
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Typography variant="h5" fontWeight="600" color="primary">
          Analysis Results
        </Typography>

        <StatsContainer>
          <StatBox
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <LocalHospital color="primary" />
            <Typography variant="h4" color="primary.main">
              {totalDetections}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Detections
            </Typography>
          </StatBox>

          <StatBox
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Science color="primary" />
            <Typography variant="h4" color="primary.main">
              {uniqueTypes.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Unique Types
            </Typography>
          </StatBox>
        </StatsContainer>

        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Detection Types:
          </Typography>
          <ChipsContainer variants={itemVariants}>
            {uniqueTypes.map((type, index) => (
              <Chip
                key={index}
                label={type}
                color="primary"
                variant="outlined"
                size="small"
                sx={{
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    backgroundColor: 'rgba(44, 62, 80, 0.1)'
                  }
                }}
              />
            ))}
          </ChipsContainer>
        </Box>
      </InfoSection>
    </SidebarContainer>
  );
};

export default Sidebar; 