import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Toast from '../components/Toast';

const API_URL = process.env.REACT_APP_API_URL || 'https://bluefin-6dzk.onrender.com/api';

const SpeedTest = () => {
  const [testing, setTesting] = useState(false);
  const [testPhase, setTestPhase] = useState(''); // 'ping', 'download', 'upload'
  const [results, setResults] = useState(null);
  const [history, setHistory] = useState([]);
  const [toast, setToast] = useState(null);
  const [progress, setProgress] = useState(0);
  const [currentSpeed, setCurrentSpeed] = useState({ download: 0, upload: 0, ping: 0 });

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`${API_URL}/usage/history`);
      setHistory(response.data.slice(0, 10));
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const simulateSpeedTest = () => {
    return new Promise((resolve) => {
      let ping = 0;
      let downloadSpeed = 0;
      let uploadSpeed = 0;
      let progressValue = 0;

      // Phase 1: Ping Test
      setTestPhase('ping');
      const pingInterval = setInterval(() => {
        ping = Math.random() * 30 + 10;
        setCurrentSpeed(prev => ({ ...prev, ping: ping.toFixed(0) }));
        progressValue += 1;
        setProgress(progressValue);
        if (progressValue >= 20) {
          clearInterval(pingInterval);
          setTestPhase('download');
          
          // Phase 2: Download Test
          const downloadInterval = setInterval(() => {
            downloadSpeed = Math.min(downloadSpeed + Math.random() * 15, 50 + Math.random() * 50);
            setCurrentSpeed(prev => ({ ...prev, download: downloadSpeed.toFixed(2) }));
            progressValue += 2;
            setProgress(Math.min(progressValue, 70));
            if (progressValue >= 70) {
              clearInterval(downloadInterval);
              setTestPhase('upload');
              
              // Phase 3: Upload Test
              const uploadInterval = setInterval(() => {
                uploadSpeed = Math.min(uploadSpeed + Math.random() * 12, downloadSpeed * 0.8);
                setCurrentSpeed(prev => ({ ...prev, upload: uploadSpeed.toFixed(2) }));
                progressValue += 2;
                setProgress(Math.min(progressValue, 100));
                if (progressValue >= 100) {
                  clearInterval(uploadInterval);
                  resolve({
                    downloadSpeed: downloadSpeed.toFixed(2),
                    uploadSpeed: uploadSpeed.toFixed(2),
                    ping: ping.toFixed(0),
                  });
                }
              }, 50);
            }
          }, 50);
        }
      }, 100);
    });
  };

  const runSpeedTest = async () => {
    setTesting(true);
    setResults(null);
    setProgress(0);
    setTestPhase('');
    setCurrentSpeed({ download: 0, upload: 0, ping: 0 });

    try {
      const testResults = await simulateSpeedTest();
      
      // Save to backend
      await axios.post(`${API_URL}/usage/speed-test`, testResults);
      
      setResults(testResults);
      setToast({ message: 'Speed test completed!', type: 'success' });
      fetchHistory();
    } catch (error) {
      setToast({ message: 'Speed test failed', type: 'error' });
    } finally {
      setTesting(false);
      setTestPhase('');
      setProgress(0);
    }
  };

  const getSpeedColor = (speed) => {
    if (speed >= 80) return 'text-green-600';
    if (speed >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPhaseText = () => {
    switch (testPhase) {
      case 'ping': return 'Testing Ping...';
      case 'download': return 'Testing Download Speed...';
      case 'upload': return 'Testing Upload Speed...';
      default: return 'Preparing test...';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 flex flex-col">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}

        <div className="text-center mb-12 animate-fadeIn">
          <h1 className="text-5xl font-bold gradient-text mb-4">Speed Test</h1>
          <p className="text-gray-600 text-lg">
            Test your internet connection speed
          </p>
        </div>

        {/* Speed Test Card */}
        <div className="card-gradient mb-8 animate-fadeIn min-h-[500px]">
          <div className="text-center py-12">
            {testing ? (
              <div className="space-y-8">
                {/* Progress Tracker */}
                <div className="mb-8">
                  <div className="text-white text-xl font-semibold mb-4">{getPhaseText()}</div>
                  <div className="w-full bg-white bg-opacity-20 rounded-full h-4 mb-2">
                    <div
                      className="bg-white h-4 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <div className="text-white text-sm">{progress}%</div>
                </div>

                {/* Speed Display */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white bg-opacity-20 rounded-xl p-6 backdrop-blur-sm">
                    <div className="text-white text-sm font-medium mb-2">Ping</div>
                    <div className="text-5xl font-bold text-white">
                      {currentSpeed.ping || '...'}
                    </div>
                    <div className="text-white text-sm mt-1">ms</div>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-xl p-6 backdrop-blur-sm">
                    <div className="text-white text-sm font-medium mb-2">Download</div>
                    <div className="text-5xl font-bold text-white">
                      {currentSpeed.download || '...'}
                    </div>
                    <div className="text-white text-sm mt-1">Mbps</div>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-xl p-6 backdrop-blur-sm">
                    <div className="text-white text-sm font-medium mb-2">Upload</div>
                    <div className="text-5xl font-bold text-white">
                      {currentSpeed.upload || '...'}
                    </div>
                    <div className="text-white text-sm mt-1">Mbps</div>
                  </div>
                </div>

                {/* Animated Indicator */}
                <div className="flex justify-center gap-2">
                  <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
                  <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            ) : results ? (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white bg-opacity-20 rounded-xl p-6 backdrop-blur-sm">
                    <div className="text-white text-sm font-medium mb-2">Download</div>
                    <div className={`text-5xl font-bold ${getSpeedColor(parseFloat(results.downloadSpeed))}`}>
                      {results.downloadSpeed}
                    </div>
                    <div className="text-white text-sm mt-1">Mbps</div>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-xl p-6 backdrop-blur-sm">
                    <div className="text-white text-sm font-medium mb-2">Upload</div>
                    <div className={`text-5xl font-bold ${getSpeedColor(parseFloat(results.uploadSpeed))}`}>
                      {results.uploadSpeed}
                    </div>
                    <div className="text-white text-sm mt-1">Mbps</div>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-xl p-6 backdrop-blur-sm">
                    <div className="text-white text-sm font-medium mb-2">Ping</div>
                    <div className="text-5xl font-bold text-white">
                      {results.ping}
                    </div>
                    <div className="text-white text-sm mt-1">ms</div>
                  </div>
                </div>
                <button
                  onClick={runSpeedTest}
                  className="btn-primary bg-white text-white hover:bg-gray-100 text-lg px-8 py-4"
                >
                  Test Again
                </button>
              </div>
            ) : (
              <div>
                <div className="text-6xl mb-6">🚀</div>
                <h2 className="text-2xl font-bold text-white mb-4">
                  Ready to test your speed?
                </h2>
                <p className="text-white text-opacity-90 mb-8">
                  Click the button below to start the test
                </p>
                <button
                  onClick={runSpeedTest}
                  className="btn-primary bg-white text-white hover:bg-gray-100 text-lg px-8 py-4 shadow-xl"
                >
                  Start Speed Test
                </button>
              </div>
            )}
          </div>
        </div>

        {/* History */}
        {history.length > 0 && (
          <div className="card animate-fadeIn">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Tests</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Download</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Upload</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ping</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {history.map((test, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(test.date).toLocaleDateString()}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${getSpeedColor(test.downloadSpeed)}`}>
                        {test.downloadSpeed?.toFixed(2) || 'N/A'} Mbps
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${getSpeedColor(test.uploadSpeed)}`}>
                        {test.uploadSpeed?.toFixed(2) || 'N/A'} Mbps
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {test.ping?.toFixed(0) || 'N/A'} ms
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default SpeedTest;
