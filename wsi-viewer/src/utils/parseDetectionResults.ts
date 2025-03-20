interface DetectionResult {
  id: number;
  patient_id: string;
  wsi_video_url: string;
  inference_results: string;
  celery_status: string;
  filename: string;
  sample_type: string;
  date: string;
}

interface ParsedDetectionResults {
  detectionResults: Array<[number, number, number, number, string]>;
  patientId: string;
  sampleType: string;
  date: string;
  filename: string;
}

export const parseDetectionResults = (jsonData: DetectionResult): ParsedDetectionResults => {
  try {
    // Parse the inference_results string to get the detection_results array
    const inferenceResults = JSON.parse(jsonData.inference_results.replace(/'/g, '"'));
    const detectionResults = inferenceResults.output.detection_results;

    return {
      detectionResults,
      patientId: jsonData.patient_id,
      sampleType: jsonData.sample_type,
      date: jsonData.date,
      filename: jsonData.filename
    };
  } catch (error) {
    console.error('Error parsing detection results:', error);
    return {
      detectionResults: [],
      patientId: '',
      sampleType: '',
      date: '',
      filename: ''
    };
  }
};

export default parseDetectionResults; 