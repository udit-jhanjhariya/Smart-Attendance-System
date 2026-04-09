import { useState, useRef } from 'react';
import { Camera, Save, UserPlus, CheckCircle2, AlertCircle } from 'lucide-react';

export function AddEmployee() {
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'idle' | 'scanning' | 'capturing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const videoRef = useRef<HTMLImageElement>(null);

  const startCamera = async () => {
    try {
      await fetch('/api/camera/start', { method: 'POST' });
      setStatus('scanning');
    } catch (err) {
      setErrorMessage("Failed to start camera.");
      setStatus('error');
    }
  };

  const handleCapture = async () => {
    if (!name.trim()) {
      setErrorMessage("Please enter an employee name first.");
      setStatus('error');
      return;
    }

    setStatus('capturing');
    try {
      const res = await fetch('/api/add_face', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() })
      });
      
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus('success');
        setName('');
      } else {
        setErrorMessage(data.error || "Failed to capture face.");
        setStatus('error');
      }
    } catch (err) {
      setErrorMessage("API connection error.");
      setStatus('error');
    }
  };

  return (
    <div className="flex-1 p-8 space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <UserPlus className="w-8 h-8 text-blue-400" />
          Add New Employee
        </h2>
        <p className="text-blue-200">Register facial data for a new team member.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Camera Feed Context */}
        <div className="space-y-4">
          <div className="aspect-video rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 border border-white/10 overflow-hidden shadow-2xl relative">
            <div className="w-full h-full flex items-center justify-center relative">
              {status === 'idle' ? (
                <div className="text-center space-y-4 cursor-pointer hover:scale-105 transition-transform" onClick={startCamera}>
                  <Camera className="w-20 h-20 text-blue-300 mx-auto opacity-50" />
                  <p className="text-blue-200">Click to Turn on Camera</p>
                </div>
              ) : (
                <>
                  <img 
                    ref={videoRef}
                    src="/api/video_feed" 
                    alt="Video Feed" 
                    className="absolute inset-0 w-full h-full object-cover" 
                  />
                  
                  {/* Status Badges Overlaid onto the view */}
                  <div className="absolute top-4 left-4 px-4 py-2 rounded-lg bg-black/50 backdrop-blur-md border border-white/20 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-white text-sm font-medium">LIVE PREVIEW</span>
                  </div>
                  
                  {status === 'capturing' && (
                     <div className="absolute inset-0 bg-blue-500/20 backdrop-blur-[2px] flex items-center justify-center">
                        <div className="px-6 py-3 rounded-full bg-black/80 flex items-center gap-3 animate-pulse">
                           <Camera className="w-5 h-5 text-blue-400" />
                           <span className="text-white font-semibold">Capturing Frame...</span>
                        </div>
                     </div>
                  )}
                </>
              )}
            </div>
          </div>
          
           {status === 'success' && (
             <div className="p-4 rounded-xl bg-green-500/20 border border-green-500/50 flex items-center gap-3">
               <CheckCircle2 className="w-6 h-6 text-green-400 shrink-0" />
               <p className="text-green-100 font-medium">Employee face successfully saved and bound to the backend!</p>
             </div>
           )}
           
           {status === 'error' && (
             <div className="p-4 rounded-xl bg-red-500/20 border border-red-500/50 flex items-center gap-3">
               <AlertCircle className="w-6 h-6 text-red-400 shrink-0" />
               <p className="text-red-100 font-medium">{errorMessage}</p>
             </div>
           )}
        </div>

        {/* Input Details */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl space-y-6">
            <h3 className="text-xl font-bold text-white mb-2 border-b border-white/10 pb-4">Employee Details</h3>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-blue-200">Full Name</label>
              <input 
                type="text" 
                placeholder="e.g. John Doe"
                value={name}
                onChange={(e) => {
                   setName(e.target.value);
                   if(status === 'error' || status === 'success') setStatus('scanning');
                }}
                className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder-blue-200/30 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
              />
              <p className="text-xs text-blue-300 mt-1">This name will be registered in the OpenCV database.</p>
            </div>

            <div className="pt-4">
               <button
                  disabled={status === 'idle' || status === 'capturing' || !name}
                  onClick={handleCapture}
                  className={`w-full px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-3 shadow-lg transition-all duration-300
                     ${(status === 'idle' || !name) 
                        ? 'bg-white/10 text-white/40 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-blue-500/30 hover:shadow-cyan-500/50 hover:scale-[1.02]'
                     }`}
               >
                 <Save className="w-5 h-5" />
                 {status === 'capturing' ? 'Detecting Face...' : 'Capture & Register Identity'}
               </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
