import React, { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, AlertTriangle, Info } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import EmotionResults from '../components/emotion/EmotionResults';
import { useNotification } from '../contexts/NotificationContext';
import { mockEmotionDetection } from '../services/emotionService';

const EmotionDetectionPage: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [emotionData, setEmotionData] = useState<any>(null);
  const { showNotification } = useNotification();
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup function to stop all tracks when component unmounts
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    try {
      const videoStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = videoStream;
        setStream(videoStream);
        setHasPermission(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setHasPermission(false);
      showNotification('Camera access denied. Please enable camera permissions.', 'error');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setStream(null);
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        
        // In a real app, we would send this image to the emotion detection API
        // const imageData = canvasRef.current.toDataURL('image/jpeg');
        // processImage(imageData);
        
        // For demo purposes, we'll use mock data
        setIsDetecting(true);
        setTimeout(() => {
          const results = mockEmotionDetection();
          setEmotionData(results);
          setIsDetecting(false);
          showNotification('Emotion analysis complete', 'success');
        }, 2000);
      }
    }
  };

  const resetAnalysis = () => {
    setEmotionData(null);
  };

  useEffect(() => {
    // Ask for camera permission when component mounts
    startCamera();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Emotion Detection</h1>
        <p className="text-gray-600">
          Our AI analyzes your facial expressions to help understand your emotional state.
          This information is used to provide insights and track patterns over time.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <Card className="overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800">Camera Feed</h2>
            </div>
            
            <div className="bg-gray-900 relative">
              {hasPermission === false && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 bg-gray-800 bg-opacity-90">
                  <AlertTriangle className="h-12 w-12 text-yellow-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Camera Access Required</h3>
                  <p className="text-center mb-4">Please enable camera access in your browser settings to use the emotion detection feature.</p>
                  <Button 
                    onClick={startCamera}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Try Again
                  </Button>
                </div>
              )}
              
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className="w-full h-[300px] object-cover"
              />
              
              <div className="absolute bottom-4 right-4 flex space-x-2">
                <Button
                  onClick={captureImage}
                  disabled={!hasPermission || isDetecting || emotionData !== null}
                  className="bg-blue-600 hover:bg-blue-700 text-white flex items-center"
                >
                  <Camera className="mr-2 h-4 w-4" />
                  {isDetecting ? 'Analyzing...' : 'Analyze Emotion'}
                </Button>
              </div>
            </div>
            
            <canvas ref={canvasRef} className="hidden" />
            
            <div className="p-4 bg-gray-50">
              <div className="flex items-start">
                <Info className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-600">
                  For best results, ensure your face is clearly visible and well-lit. 
                  The analysis is performed locally and your image is not stored.
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div>
          {emotionData ? (
            <Card>
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">Analysis Results</h2>
                <Button 
                  onClick={resetAnalysis}
                  className="text-gray-600 hover:text-gray-900 flex items-center text-sm"
                >
                  <RefreshCw className="mr-1 h-4 w-4" />
                  New Analysis
                </Button>
              </div>
              <div className="p-6">
                <EmotionResults data={emotionData} />
              </div>
            </Card>
          ) : (
            <Card className="bg-gray-50 border border-dashed border-gray-200">
              <div className="p-8 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <Camera className="h-8 w-8 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Analysis Yet</h3>
                <p className="text-gray-600 mb-6">
                  Click the "Analyze Emotion" button to capture your current emotional state.
                </p>
                <div className="text-sm text-gray-500 flex items-start max-w-md">
                  <Info className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                  <p>
                    Your emotion data is analyzed to help identify patterns and provide insights about your mental well-being.
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmotionDetectionPage;