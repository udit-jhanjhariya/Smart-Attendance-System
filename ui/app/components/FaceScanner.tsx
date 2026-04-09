import { useEffect, useState, useRef } from 'react';
import { Camera, Activity, CheckCircle2, AlertCircle, Scan } from 'lucide-react';

interface ScanStatus {
  detected: boolean;
  recognized: string | null;
  confidence: number;
}

interface RecentScan {
  name: string;
  time: string;
  status: string;
}

export function FaceScanner() {
  const [scanning, setScanning] = useState(false);
  const [status, setStatus] = useState<ScanStatus>({ detected: false, recognized: null, confidence: 0 });
  const [recentScans, setRecentScans] = useState<RecentScan[]>([]);
  const videoRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (scanning) {
      interval = setInterval(async () => {
        try {
          const res = await fetch('/api/scan_status');
          const data = await res.json();
          setStatus(data);
          
          if (data.recognized) {
             fetchRecentScans();
          }
        } catch (err) {
          console.error("Failed to fetch scan status", err);
        }
      }, 500);
    }
    return () => clearInterval(interval);
  }, [scanning]);

  useEffect(() => {
    fetchRecentScans();
  }, []);

  const fetchRecentScans = async () => {
    try {
      const res = await fetch('/api/attendance/recent');
      const data = await res.json();
      setRecentScans(data.slice(0, 5));
    } catch (err) {
      console.error(err);
    }
  };

  const handleStartScan = async () => {
    try {
      await fetch('/api/camera/start', { method: 'POST' });
      setScanning(true);
      setStatus({ detected: false, recognized: null, confidence: 0 });
    } catch (err) {
      console.error(err);
    }
  };

  const handleStopScan = async () => {
    try {
      await fetch('/api/camera/stop', { method: 'POST' });
      setScanning(false);
      setStatus({ detected: false, recognized: null, confidence: 0 });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex-1 p-8 space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Face Recognition Scan</h2>
        <p className="text-blue-200">Position your face in the camera frame for attendance verification</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Camera View */}
        <div className="lg:col-span-2 space-y-4">
          <div className="aspect-video rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 border border-white/10 overflow-hidden shadow-2xl relative">
            <div className="w-full h-full bg-gradient-to-br from-blue-900/20 to-purple-900/20 flex items-center justify-center relative">
              {!scanning ? (
                <div className="text-center space-y-4">
                  <Camera className="w-20 h-20 text-blue-300 mx-auto opacity-50" />
                  <p className="text-blue-200">Camera Ready</p>
                </div>
              ) : (
                <>
                  <img 
                    ref={videoRef}
                    src="/api/video_feed" 
                    alt="Video Feed" 
                    className="absolute inset-0 w-full h-full object-cover" 
                  />

                  {/* Status overlay */}
                  <div className="absolute top-4 left-4 px-4 py-2 rounded-lg bg-black/50 backdrop-blur-md border border-white/20 flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${scanning ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`} />
                    <span className="text-white text-sm font-medium">
                      {status.recognized ? 'RECOGNIZED' : status.detected ? 'DETECTING' : 'SCANNING'}
                    </span>
                  </div>

                  {/* Recognition result overlay floating */}
                  {status.recognized && status.confidence > 80 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl bg-green-500/90 backdrop-blur-md border border-green-300/50 shadow-lg shadow-green-500/50">
                      <div className="flex items-center gap-3 text-white">
                        <CheckCircle2 className="w-6 h-6" />
                        <div>
                          <p className="font-bold">{status.recognized}</p>
                          <p className="text-sm text-green-100">Attendance Marked</p>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-4">
            {!scanning ? (
              <button
                onClick={handleStartScan}
                className="flex-1 px-6 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 transition-all duration-300 flex items-center justify-center gap-3 hover:scale-105"
              >
                <Scan className="w-5 h-5" />
                Start Scanning
              </button>
            ) : (
              <button
                onClick={handleStopScan}
                className="flex-1 px-6 py-4 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 text-white font-semibold hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-3"
              >
                Stop Scanning
              </button>
            )}
          </div>
        </div>

        {/* Info Panel */}
        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-400" />
              Detection Status
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-blue-200">Confidence</span>
                  <span className="text-white font-bold">{status.confidence}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 shadow-lg shadow-purple-500/50"
                    style={{ width: `${status.confidence}%` }}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-blue-200 text-sm">Face Detected</span>
                  {status.detected ? (
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-gray-500" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-200 text-sm">Identity Match</span>
                  {status.recognized && status.confidence > 65 ? (
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-gray-500" />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-4">Recent Scans</h3>
            <div className="space-y-3">
              {recentScans.length === 0 && <p className="text-gray-400 text-sm">No recent scans today.</p>}
              {recentScans.map((scan, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-lg uppercase">
                    {scan.name.substring(0,2)}
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">{scan.name}</p>
                    <p className="text-blue-200 text-xs">{scan.time}</p>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
