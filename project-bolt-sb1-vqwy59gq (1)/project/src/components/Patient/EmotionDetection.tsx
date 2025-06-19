import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from '../../contexts/SessionContext';
import { EmotionData } from '../../types';
import { Camera, CameraOff, Smile, Frown, Meh, Angry, Sunrise as Surprised, Zap, RefreshCw, AlertCircle, Info } from 'lucide-react';

const EmotionDetection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<EmotionData | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const { addEmotionData, isRecording } = useSession();

  const emotions = ['happy', 'sad', 'angry', 'surprised', 'fear', 'disgust', 'neutral'] as const;
  
  const emotionIcons = {
    happy: Smile,
    sad: Frown,
    angry: Angry,
    surprised: Surprised,
    fear: Zap,
    disgust: Frown,
    neutral: Meh
  };

  const emotionColors = {
    happy: 'text-therapeutic-600 bg-therapeutic-100',
    sad: 'text-primary-600 bg-primary-100',
    angry: 'text-danger-600 bg-danger-100',
    surprised: 'text-warning-600 bg-warning-100',
    fear: 'text-purple-600 bg-purple-100',
    disgust: 'text-orange-600 bg-orange-100',
    neutral: 'text-gray-600 bg-gray-100'
  };

  const startCamera = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setPermissionDenied(false);
      setDebugInfo('Initializing camera...');
      
      // Stop any existing stream first
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }

      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported in this browser. Please use Chrome, Firefox, or Safari.');
      }

      setDebugInfo('Checking available devices...');
      
      // Check available devices first
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        console.log('Available video devices:', videoDevices);
        
        if (videoDevices.length === 0) {
          throw new Error('No camera devices found on this system.');
        }
        
        setDebugInfo(`Found ${videoDevices.length} camera(s). Requesting access...`);
      } catch (deviceErr) {
        console.warn('Could not enumerate devices:', deviceErr);
        setDebugInfo('Device enumeration failed, trying direct access...');
      }

      // Try multiple constraint configurations
      const constraintOptions = [
        // High quality with specific device preference
        {
          video: {
            width: { ideal: 640, min: 320, max: 1280 },
            height: { ideal: 480, min: 240, max: 720 },
            facingMode: 'user',
            frameRate: { ideal: 30, min: 10, max: 60 }
          },
          audio: false
        },
        // Medium quality fallback
        {
          video: {
            width: { ideal: 480, min: 320 },
            height: { ideal: 360, min: 240 },
            facingMode: 'user'
          },
          audio: false
        },
        // Basic constraints
        {
          video: {
            facingMode: 'user'
          },
          audio: false
        },
        // Minimal constraints
        {
          video: true,
          audio: false
        }
      ];

      let mediaStream: MediaStream | null = null;
      let lastError: Error | null = null;

      for (let i = 0; i < constraintOptions.length; i++) {
        try {
          setDebugInfo(`Trying camera configuration ${i + 1}/${constraintOptions.length}...`);
          console.log(`Attempting constraints ${i + 1}:`, constraintOptions[i]);
          
          mediaStream = await navigator.mediaDevices.getUserMedia(constraintOptions[i]);
          
          if (mediaStream && mediaStream.getVideoTracks().length > 0) {
            console.log('Successfully got media stream:', mediaStream);
            setDebugInfo('Camera access granted! Setting up video...');
            break;
          }
        } catch (constraintErr: any) {
          console.warn(`Constraint attempt ${i + 1} failed:`, constraintErr);
          lastError = constraintErr;
          
          if (constraintErr.name === 'NotAllowedError') {
            // Don't try other constraints if permission is denied
            throw constraintErr;
          }
        }
      }

      if (!mediaStream) {
        throw lastError || new Error('Failed to access camera with any configuration');
      }

      // Verify the stream has active video tracks
      const videoTracks = mediaStream.getVideoTracks();
      if (videoTracks.length === 0) {
        throw new Error('No video tracks available in the media stream');
      }

      const videoTrack = videoTracks[0];
      console.log('Video track details:', {
        label: videoTrack.label,
        kind: videoTrack.kind,
        readyState: videoTrack.readyState,
        enabled: videoTrack.enabled,
        settings: videoTrack.getSettings()
      });

      setDebugInfo('Connecting video stream...');

      // Set up the video element
      if (videoRef.current) {
        // Reset video element
        videoRef.current.srcObject = null;
        
        // Set properties before assigning stream
        videoRef.current.playsInline = true;
        videoRef.current.muted = true;
        videoRef.current.autoplay = true;
        videoRef.current.controls = false;
        
        // Add comprehensive event listeners
        const video = videoRef.current;
        
        const handleLoadStart = () => {
          console.log('Video load started');
          setDebugInfo('Video loading...');
        };
        
        const handleLoadedData = () => {
          console.log('Video data loaded');
          setDebugInfo('Video data loaded...');
        };
        
        const handleCanPlay = () => {
          console.log('Video can play');
          setDebugInfo('Video ready to play...');
        };
        
        const handlePlaying = () => {
          console.log('Video is playing');
          setDebugInfo('Video playing successfully!');
          setIsActive(true);
          setError(null);
        };
        
        const handleLoadedMetadata = () => {
          console.log('Video metadata loaded');
          console.log('Video dimensions:', video.videoWidth, 'x', video.videoHeight);
          setDebugInfo(`Video loaded: ${video.videoWidth}x${video.videoHeight}`);
          
          // Force play after metadata is loaded
          video.play().catch(playErr => {
            console.error('Error playing video after metadata loaded:', playErr);
            setError('Failed to start video playback. Please try clicking the video area.');
          });
        };
        
        const handleError = (err: Event) => {
          console.error('Video element error:', err);
          const videoError = (err.target as HTMLVideoElement)?.error;
          if (videoError) {
            console.error('Video error details:', {
              code: videoError.code,
              message: videoError.message
            });
          }
          setError('Video playback error. Please refresh and try again.');
        };

        // Add event listeners
        video.addEventListener('loadstart', handleLoadStart);
        video.addEventListener('loadeddata', handleLoadedData);
        video.addEventListener('canplay', handleCanPlay);
        video.addEventListener('playing', handlePlaying);
        video.addEventListener('loadedmetadata', handleLoadedMetadata);
        video.addEventListener('error', handleError);
        
        // Clean up function
        const cleanup = () => {
          video.removeEventListener('loadstart', handleLoadStart);
          video.removeEventListener('loadeddata', handleLoadedData);
          video.removeEventListener('canplay', handleCanPlay);
          video.removeEventListener('playing', handlePlaying);
          video.removeEventListener('loadedmetadata', handleLoadedMetadata);
          video.removeEventListener('error', handleError);
        };

        // Store cleanup function for later use
        (video as any)._cleanup = cleanup;
        
        // Assign the stream
        video.srcObject = mediaStream;
        
        // Try to play immediately
        setTimeout(() => {
          video.play().catch(playErr => {
            console.warn('Initial play attempt failed:', playErr);
            setDebugInfo('Click the video area to start playback');
          });
        }, 100);
      }
      
      setStream(mediaStream);
      
    } catch (err: any) {
      console.error('Error accessing camera:', err);
      setDebugInfo('');
      
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setPermissionDenied(true);
        setError('Camera access denied. Please allow camera permissions in your browser and try again.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setError('No camera found. Please ensure your device has a camera connected and try again.');
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        setError('Camera is already in use by another application. Please close other applications using the camera and try again.');
      } else if (err.name === 'OverconstrainedError' || err.name === 'ConstraintNotSatisfiedError') {
        setError('Camera settings not supported by your device. Please try a different browser or update your camera drivers.');
      } else if (err.name === 'SecurityError') {
        setError('Camera access blocked by browser security settings. Please enable camera access for this site.');
      } else {
        setError(`Camera error: ${err.message || 'Unknown error'}. Please check your camera permissions and try again.`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    console.log('Stopping camera...');
    setDebugInfo('');
    
    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop();
        console.log('Stopped track:', track.kind);
      });
      setStream(null);
    }
    
    if (videoRef.current) {
      // Clean up event listeners
      if ((videoRef.current as any)._cleanup) {
        (videoRef.current as any)._cleanup();
      }
      videoRef.current.srcObject = null;
    }
    
    setIsActive(false);
    setCurrentEmotion(null);
    setError(null);
    setPermissionDenied(false);
  };

  const restartCamera = async () => {
    stopCamera();
    await new Promise(resolve => setTimeout(resolve, 500)); // Small delay
    await startCamera();
  };

  // Handle video click to try playing if autoplay failed
  const handleVideoClick = () => {
    if (videoRef.current && !isActive) {
      videoRef.current.play().then(() => {
        setIsActive(true);
        setError(null);
        setDebugInfo('');
      }).catch(err => {
        console.error('Manual play failed:', err);
      });
    }
  };

  // Simulate emotion detection (in production, this would use actual ML models)
  useEffect(() => {
    if (!isActive || !isRecording) return;

    const detectEmotions = () => {
      // Simulate emotion detection results
      const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
      const confidence = 0.7 + Math.random() * 0.3; // 70-100% confidence
      const intensity = Math.random();

      const emotionData: EmotionData = {
        timestamp: new Date(),
        emotion: randomEmotion,
        confidence,
        intensity
      };

      setCurrentEmotion(emotionData);
      addEmotionData(emotionData);
    };

    const interval = setInterval(detectEmotions, 2000);
    return () => clearInterval(interval);
  }, [isActive, isRecording, addEmotionData]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const EmotionIcon = currentEmotion ? emotionIcons[currentEmotion.emotion] : Meh;

  return (
    <div className="space-y-6">
      {/* Camera Feed */}
      <div className="relative">
        <div 
          className="bg-gray-900 rounded-xl overflow-hidden cursor-pointer" 
          style={{ aspectRatio: '4/3' }}
          onClick={handleVideoClick}
        >
          {isActive ? (
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
              style={{ 
                transform: 'scaleX(-1)', // Mirror the video for natural selfie view
                minHeight: '300px',
                backgroundColor: '#000' // Ensure black background while loading
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center min-h-[300px]">
              <div className="text-center">
                <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">Camera not active</p>
                <p className="text-gray-500 text-sm mt-2">Click "Start Camera" to begin emotion detection</p>
                {debugInfo && (
                  <p className="text-blue-400 text-xs mt-2">{debugInfo}</p>
                )}
              </div>
            </div>
          )}
          
          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-center text-white">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="mx-auto mb-2"
                >
                  <RefreshCw className="h-8 w-8" />
                </motion.div>
                <p>Starting camera...</p>
                {debugInfo && (
                  <p className="text-sm mt-1 opacity-75">{debugInfo}</p>
                )}
              </div>
            </div>
          )}
          
          {/* Recording Indicator */}
          {isActive && isRecording && (
            <div className="absolute top-4 left-4">
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="flex items-center bg-danger-500 text-white px-3 py-1 rounded-full text-sm font-medium"
              >
                <div className="w-2 h-2 bg-white rounded-full mr-2" />
                Recording
              </motion.div>
            </div>
          )}

          {/* Camera Status */}
          {isActive && (
            <div className="absolute top-4 right-4">
              <div className="flex items-center bg-therapeutic-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                <div className="w-2 h-2 bg-white rounded-full mr-2" />
                Live
              </div>
            </div>
          )}

          {/* Emotion Overlay */}
          <AnimatePresence>
            {currentEmotion && isActive && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-4"
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${emotionColors[currentEmotion.emotion]}`}>
                    <EmotionIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 capitalize">
                      {currentEmotion.emotion}
                    </p>
                    <p className="text-sm text-gray-600">
                      {Math.round(currentEmotion.confidence * 100)}% confidence
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="flex justify-center items-center mt-4 space-x-4">
          {!isActive ? (
            <button
              onClick={startCamera}
              disabled={isLoading}
              className="flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                  Starting...
                </>
              ) : (
                <>
                  <Camera className="h-5 w-5 mr-2" />
                  Start Camera
                </>
              )}
            </button>
          ) : (
            <>
              <button
                onClick={restartCamera}
                className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Restart
              </button>
              <button
                onClick={stopCamera}
                className="flex items-center px-6 py-3 bg-danger-600 text-white rounded-lg font-medium hover:bg-danger-700 transition-colors"
              >
                <CameraOff className="h-5 w-5 mr-2" />
                Stop Camera
              </button>
            </>
          )}
        </div>

        {/* Debug Info */}
        {debugInfo && !error && (
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Info className="h-4 w-4 text-blue-600" />
              <p className="text-blue-600 text-sm">{debugInfo}</p>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mt-4 bg-danger-50 border border-danger-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="bg-danger-100 p-1 rounded-full">
                <AlertCircle className="h-4 w-4 text-danger-600" />
              </div>
              <div className="flex-1">
                <p className="text-danger-600 text-sm font-medium">Camera Error</p>
                <p className="text-danger-600 text-sm">{error}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    onClick={startCamera}
                    className="text-danger-600 text-sm underline hover:no-underline"
                  >
                    Try again
                  </button>
                  {permissionDenied && (
                    <button
                      onClick={() => {
                        // Open browser settings help
                        window.open('https://support.google.com/chrome/answer/2693767', '_blank');
                      }}
                      className="text-danger-600 text-sm underline hover:no-underline"
                    >
                      Camera permissions help
                    </button>
                  )}
                  <button
                    onClick={() => {
                      // Refresh the page
                      window.location.reload();
                    }}
                    className="text-danger-600 text-sm underline hover:no-underline"
                  >
                    Refresh page
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Permission Help */}
        {permissionDenied && (
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="bg-blue-100 p-1 rounded-full">
                <Camera className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-blue-600 text-sm font-medium">Camera Permission Required</p>
                <p className="text-blue-600 text-sm mt-1">
                  To enable emotion detection, please:
                </p>
                <ol className="text-blue-600 text-sm mt-2 list-decimal list-inside space-y-1">
                  <li>Click the camera icon in your browser's address bar</li>
                  <li>Select "Allow" for camera access</li>
                  <li>Refresh the page and try again</li>
                  <li>If still not working, check your browser's camera settings</li>
                </ol>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Current Emotion Display */}
      {currentEmotion && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-gray-200 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Emotion Analysis</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Detected Emotion</p>
              <div className="flex items-center space-x-2">
                <div className={`p-2 rounded-lg ${emotionColors[currentEmotion.emotion]}`}>
                  <EmotionIcon className="h-5 w-5" />
                </div>
                <span className="font-medium capitalize">{currentEmotion.emotion}</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Confidence Level</p>
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${currentEmotion.confidence * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium">
                  {Math.round(currentEmotion.confidence * 100)}%
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-1">Emotional Intensity</p>
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-therapeutic-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${currentEmotion.intensity * 100}%` }}
                />
              </div>
              <span className="text-sm font-medium">
                {Math.round(currentEmotion.intensity * 100)}%
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Instructions */}
      <div className="bg-primary-50 border border-primary-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-primary-900 mb-2">How It Works</h3>
        <ul className="text-sm text-primary-700 space-y-1">
          <li>• Position yourself clearly in front of the camera</li>
          <li>• Ensure good lighting for accurate detection</li>
          <li>• The system analyzes your facial expressions in real-time</li>
          <li>• Emotion data is recorded during active sessions</li>
          <li>• All data is processed securely and privately</li>
          <li>• If the camera shows a black screen, check browser permissions</li>
          <li>• Try clicking the video area if autoplay is blocked</li>
          <li>• Refresh the page if camera access fails</li>
        </ul>
      </div>
    </div>
  );
};

export default EmotionDetection;