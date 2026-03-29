
// import { Link } from "react-router-dom"
import { useState, useEffect, useRef } from "react"
import { Html5Qrcode } from "html5-qrcode"
import { scanPass } from "../../services/passService"

// import { getPassById } from "../../services/passService"
import Card from "../../components/common/Card"
import Button from "../../components/common/Button"
import Spinner from "../../components/common/Spinner"

import toast from "react-hot-toast"
import {
  FaCheckCircle,
  FaTimesCircle,
  // FaUser,
  FaQrcode,
  FaRedo,
  FaCamera,
  FaExclamationTriangle,
} from "react-icons/fa";

const ScanPage = () => {
  // const [isActive, setIsActive] = useState(false)
const [isScannerActive, setIsScannerActive] = useState(true)

// const [result, setResult] = useState(null)
const [scanResult, setScanResult] = useState(null)
const [processing, setProcessing] = useState(false)

// const [error, setError] = useState(null)
const [cameraError, setCameraError] = useState(null)

// const [deviceList, setDeviceList] = useState([])
const [cameras, setCameras] = useState([])
const [selectedCamera, setSelectedCamera] = useState(null)

// const [isInitializing, setIsInitializing] = useState(false)
const [isStarting, setIsStarting] = useState(false)

const scannerRef = useRef(null)
const scannerId = useRef(`qr-scanner-${Date.now()}`)
const containerRef = useRef(null)
const isMounted = useRef(true)
const isScanningRef = useRef(false)

  // useEffect(() => {
  //   return () => {
  //     stopScanner();
  //   };
  // }, [])

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      stopScanner();
    };
  }, [])

  useEffect(() => {
  const getCameras = async () => {
    try {
      const devices = await Html5Qrcode.getCameras();
      
      // console.log("Cameras found:", devices);      

      if (isMounted.current && devices && devices.length > 0) {
        setCameras(devices);
        
        const backCamera = devices.find((d) =>
          d.label.toLowerCase().includes("back")
        );
        
        // console.log("Looking for front camera...");
        const frontCamera = devices.find((d) =>
          d.label.toLowerCase().includes("front")
        );
        

        // console.log("Selected camera ID:", backCamera?.id || frontCamera?.id || devices[0].id);
        setSelectedCamera(backCamera?.id || frontCamera?.id || devices[0].id);
      } else if (isMounted.current) {
        // console.warn("No cameras detected on this device");
        setCameraError("No camera found on this device");
      }
    } catch (err) {
      // console.error("Error getting cameras:", err);
      toast.error(err.message);
      // console.error("Error details:", err.message);
            if (isMounted.current) {
        setCameraError("Unable to access camera. Please check permissions.");
      }
    }
  }
  
  // console.log("useEffect - getCameras triggered");
  // console.log("Component mounted, initializing camera setup")
  getCameras();
  }, [])

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
      } catch (e) {
      }
      // scannerRef.current = false;
      scannerRef.current = null;
    }
  }

  const startScanner = async () => {
    if (!isScannerActive || !selectedCamera || 
      isStarting) return;

    try {
      // setIsStarting(false)
      setIsStarting(true)
      setCameraError(null)

      await stopScanner();

      const html5QrCode = new Html5Qrcode(scannerId.current);
      scannerRef.current = html5QrCode;

      const config = {
        fps: 10, 
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      }

      await html5QrCode.start(
        selectedCamera,
        config,
        async (decodedText) => {

          if (isScanningRef.current || processing) return;
          isScanningRef.current = true;
          
          await stopScanner();
          
          if (isMounted.current && !processing) {
            onScanSuccess(decodedText);
          }
        },
        (err) => {

          if (err && !err.includes("No QR code found")) {
            console.warn("Scan error:", err);
          }
        }
      );
    } catch (err) {
      // console.error("Scanner error:", err);
      if (isMounted.current) {
        let msg = "Camera not accessible";
        if (err.message?.includes("Permission")) {
          msg = "Camera permission denied. Please allow camera access.";
        } else if (err.message?.includes("No camera")) {
          msg = "No camera detected on this device.";
        }
        setCameraError(msg)
        // console.log(msg)
        toast.error(msg)
        setIsScannerActive(false)
      }
    } finally {
      if (isMounted.current) {
        // setTimeout(() => {
        //     setIsStarting(false);
        // }, 1000)
        setIsStarting(false);
      }
    }
  };

  useEffect(() => {
    let timer;
    if (isScannerActive && selectedCamera && !scanResult && !processing) {
      timer = setTimeout(() => {
        if (isMounted.current) {
          startScanner();
        }
      }, 500);
    } else {
      stopScanner();
    }

    return () => {
      if (timer) clearTimeout(timer);
      stopScanner();
    };
  }, [isScannerActive, selectedCamera, scanResult, processing]); 

const onScanSuccess = async (decodedText) => {
  if (processing) return;

  setProcessing(true);
  setIsScannerActive(false);

  const toastId = toast.loading("Processing scan...");

  try {
    console.log("=" .repeat(50));
    console.log("🔵 QR SCANNED");
    console.log("Raw decodedText:", decodedText);
    console.log("decodedText type:", typeof decodedText);
    
    
    const payload = {
      qrData: String(decodedText)  
    }
    // console.log("Sending payload:", payload)
    const result = await scanPass(payload)
    // console.log("API Response:", result)
    
    toast.success(result.message || "Check-in/out successful", {
      id: toastId,
    })

    setScanResult({
      success: true,
      message: result.message,
      data: result.checkLog || result,
      visitorName: result.visitorName,
    })

    setTimeout(() => {
      resetToScanMode();
    }, 3000)
    
  } catch (error) {
    // console.error("Scan error:", error);
    // console.error("Error response:", error.response);
    const errorMsg = error.response?.data?.message || error.message || "Scan failed. Please try again.";
    toast.error(errorMsg, { id: toastId });

    setScanResult({
      success: false,
      message: errorMsg,
    })

    // setTimeout(() => {
    //   setProcessing(false);
    // }, 2000);
    setTimeout(() => {
      resetToScanMode();
    }, 2000);
  } finally {
    setProcessing(false);
  }
};

  const resetToScanMode = () => {
    if (!isMounted.current) return;
    // setScanResult(false);
    // setProcessing(true);
    setScanResult(null);
    setProcessing(false);
    setIsScannerActive(true);
    isScanningRef.current = false;
  };

  const switchCamera = () => {
    if (cameras.length > 1 && !processing) {
      const currentIndex = cameras.findIndex((c) => c.id === selectedCamera)
      const nextIndex = (currentIndex + 1) % cameras.length;
      setSelectedCamera(cameras[nextIndex].id)

      // setIsScannerActive(true)
      setIsScannerActive(false);
      setTimeout(() => {
        if (isMounted.current) {
          setIsScannerActive(true);
        }
      }, 500)
    }
  }

  const requestCameraPermission = async () => {
  try {
    // console.log("Requesting camera permission...");
    
    await navigator.mediaDevices.getUserMedia({ video: true });
    
    // console.log("Fetching available camera devices...");
    
    const devices = await Html5Qrcode.getCameras();
    
    // console.log("Devices found:", devices.length);
    // devices.forEach((device, index) => {
    //   console.log(`Device ${index + 1}:`, device.label);
    // });
    
    if (isMounted.current && devices && devices.length > 0) {
      setCameras(devices);
      
      // console.log("Looking for back camera...");
      const backCamera = devices.find((d) =>
        d.label.toLowerCase().includes("back")
      );
      
      // console.log("Selected camera:", backCamera?.id || devices[0].id);
      setSelectedCamera(backCamera?.id || devices[0].id);
      
      setCameraError(null);
      
      setIsScannerActive(true);
      
      // console.log("Camera setup completed successfully");
      toast.success("Camera setup completed successfully")
    } else {
      // console.warn("No cameras found after permission granted");
      toast.warn("No camera found after permission granted")
    }
  } catch (err) {
    // console.error("Permission error occurred:");

    console.error("Permission error:", err);
    toast.err(err);
    if (isMounted.current) {
      // Handle different types of permission errors
      // if (err.name === "NotAllowedError") {
      //   console.log(" denied camera permission");
      // } else if (err.name === "NotFoundError") {
      //   console.log("No camera hardware found");
      // } else if (err.name === "NotReadableError") {
      //   console.log("Camera already in use by another application");
      // }
      
      setCameraError("Camera permission denied. Please enable camera access.");
    }
  }
};

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto">

      <div className="text-center mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-[#0b1e3c] mb-2">
          QR Code Scanner
        </h1>
        <p className="text-sm text-[#5b6f87]">
          Check-in / Check-out visitors by scanning their pass
        </p>
      </div>

      <Card className="overflow-hidden">

        <div className="bg-indigo-600 px-6 py-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <FaQrcode className="text-white" size={20} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">
                  {isScannerActive ? "Scan Visitor Pass" : "Scan Result"}
                </h2>
                <p className="text-sm text-white/80">
                  {isScannerActive
                    ? "Position QR code within the frame"
                    : "Processing complete"}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              {cameras.length > 1 && isScannerActive && !processing && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={switchCamera}
                  className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                >
                  <FaCamera className="mr-2" size={12} />
                  Switch Camera
                </Button>
              )}
              {!isScannerActive && scanResult && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={resetToScanMode}
                  className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                >
                  <FaRedo className="mr-2" size={12} />
                  Scan Again
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="p-6">
          {cameraError ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <FaExclamationTriangle className="text-red-500 text-3xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Camera Access Required
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                {cameraError}
              </p>
              <Button onClick={requestCameraPermission} variant="primary">
                Allow Camera Access
              </Button>
            </div>
          ) : isScannerActive && !scanResult ? (
            <div className="space-y-4">
              <div className="relative bg-black rounded-xl overflow-hidden max-w-md mx-auto">
                <div
                  id={scannerId.current}
                  ref={containerRef}
                  className="w-full aspect-square max-w-md mx-auto bg-black rounded-xl overflow-hidden"
                />

                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-white rounded-xl shadow-[0_0_0_999px_rgba(0,0,0,0.3)]"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48">
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white"></div>
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white"></div>
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white"></div>
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white"></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-gray-500">
                  Scanner is active - position QR code in frame
                </span>
              </div>

              {isStarting && (
                <div className="text-center py-4">
                  <Spinner size="md" text="Starting camera..." />
                </div>
              )}
            </div>
          ) : (
            scanResult && (
              <div className="text-center py-8">
                {scanResult.success ? (
                  <div className="flex flex-col items-center animate-fade-in">
                    <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-4">
                      <FaCheckCircle size={48} className="text-green-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-green-600 mb-2">
                      {scanResult.message}
                    </h3>
                    {scanResult.visitorName && (
                      <p className="text-gray-600 mb-2">
                        Visitor: <strong>{scanResult.visitorName}</strong>
                      </p>
                    )}
                    {scanResult.data?.summary && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg text-left">
                        <p className="text-sm text-gray-600">
                          Check-in: {new Date(scanResult.data.summary.checkInTime).toLocaleTimeString()}
                        </p>
                        {scanResult.data.summary.checkOutTime && (
                          <>
                            <p className="text-sm text-gray-600">
                              Check-out: {new Date(scanResult.data.summary.checkOutTime).toLocaleTimeString()}
                            </p>
                            <p className="text-sm font-semibold text-gray-800 mt-1">
                              Duration: {scanResult.data.summary.totalTimeInsideMinutes} minutes
                            </p>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center animate-fade-in">
                    <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center mb-4">
                      <FaTimesCircle size={48} className="text-red-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-red-600 mb-2">
                      Scan Failed
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-md">
                      {scanResult.message}
                    </p>
                    <Button onClick={resetToScanMode}>
                      <FaRedo className="mr-2" /> Try Again
                    </Button>
                  </div>
                )}
              </div>
            )
          )}
        </div>
      </Card>


      <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-200">
        <h4 className="text-sm font-semibold text-blue-800 mb-2 flex items-center gap-2">
          <FaQrcode className="text-blue-600" />
          How to Scan
        </h4>
        <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
          <li>Position the QR code inside the scanning frame</li>
          <li>Ensure good lighting for better detection</li>
          <li>Hold steady until the scan completes</li>
          <li>For best results, keep the QR code flat and centered</li>
        </ul>
      </div>
    </div>
  );
};

export default ScanPage;