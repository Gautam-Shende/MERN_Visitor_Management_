import { useState, useEffect, useRef } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { scanPass } from '../../services/passService'

import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Spinner from '../../components/common/Spinner'
import toast from 'react-hot-toast'

import {
  FaCheckCircle, FaTimesCircle, FaQrcode,
  FaRedo, FaCamera, FaExclamationTriangle,
} from 'react-icons/fa'

const ScanPage = () => {
  const [scannerOn, setScannerOn] = useState(true)
  const [scanData, setScanData] = useState(null)
  
  const [isProcessing, setIsProcessing] = useState(false)
  
  const [camError, setCamError] = useState(null)
  const [cameras, setCameras] = useState([])
  
  const [selectedCam, setSelectedCam] = useState(null)
  const [starting, setStarting] = useState(false)
  
  const [toastId, setToastId] = useState(null)

  const scannerRef = useRef(null)
  const scannerId = useRef(`scanner-${Date.now()}`)
  
  const container = useRef(null)
  
  const isAlive = useRef(true)
  const scanning = useRef(false)

  useEffect(() => {
    isAlive.current = true
    return () => {
      isAlive.current = false
      stopScanner()
      if (toastId) toast.dismiss(toastId)
    }
  }, [toastId])

  useEffect(() => {
    const getCameras = async () => {
      try {
        const devices = await Html5Qrcode.getCameras()
        if (isAlive.current && devices?.length > 0) {
          setCameras(devices)
          // prefer back camera
          const backCam = devices.find((d) => d.label.toLowerCase().includes('back'))
          const frontCam = devices.find((d) => d.label.toLowerCase().includes('front'))
          setSelectedCam(backCam?.id || frontCam?.id || devices[0].id)
        } else if (isAlive.current) {
          setCamError('No camera found on this device')
        }
      } catch (err) {
        console.log('camera error:', err) // TODO: fix this properly
        if (isAlive.current) {
          setCamError('Unable to access camera. Please check permissions.')
        }
      }
    }
    getCameras()
  }, [])

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop()
        await scannerRef.current.clear()
      } catch (err) {
      }
      scannerRef.current = null
    }
  }

  const startScanner = async () => {

    if (!scannerOn || !selectedCam || starting) return
    
    try {
      setStarting(true)
      setCamError(null)
      await stopScanner()

      const qrScanner = new Html5Qrcode(scannerId.current)
      scannerRef.current = qrScanner

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      }

      await qrScanner.start(
        selectedCam,
        config,
        async (decodedText) => {
          // prevent multiple scans
          if (scanning.current || isProcessing) return
          scanning.current = true
          await stopScanner()
          if (isAlive.current && !isProcessing) processQR(decodedText)
        },
        (err) => {
          // ignore "no qr code" errors, they're annoying
          if (err && !err.includes('No QR code found')) {
            console.warn('scan error:', err)
          }
        }
      )
    } catch (err) {
      if (isAlive.current) {
        let msg = 'Camera not accessible'
        if (err.message?.includes('Permission')) msg = 'Camera permission denied. Please allow camera access.'
        else if (err.message?.includes('No camera')) msg = 'No camera detected on this device.'
        setCamError(msg)
        toast.error(msg)
        setScannerOn(false)
      }
    } finally {
      if (isAlive.current) setStarting(false)
    }
  }

  useEffect(() => {
    let timer;
    // this will start scanner
    if (scannerOn && selectedCam && !scanData && !isProcessing) {
      timer = setTimeout(() => {
        if (isAlive.current) startScanner()
      }, 500)
    } else {
      stopScanner()
    }
    return () => {
      if (timer) clearTimeout(timer)
      stopScanner()
    }
  }, [scannerOn, selectedCam, scanData, isProcessing])

  // main scan handler
  const processQR = async (qrCode) => {
    if (isProcessing) return
    
    setIsProcessing(true)
    setScannerOn(false)

    const loadingToast = toast.loading('Processing scan...', { duration: Infinity })
    setToastId(loadingToast)

    try {
      const result = await scanPass({ qrData: String(qrCode) })
      toast.dismiss(loadingToast)
      setToastId(null)

      let successMsg = ''
      let titleMsg = ''

      if (result.action === 'checkin') {
        successMsg = result.message || `${result.visitorName} checked in successfully!`
        titleMsg = 'Check-in Successful!'
      } else if (result.action === 'checkout') {
        successMsg = result.message || `${result.visitorName} checked out successfully! Pass expired.`
        titleMsg = 'Check-out Successful!'
      } else {
        successMsg = 'Scan successful!'
        titleMsg = 'Success!'
      }

      toast.success(successMsg)
      
      setScanData({
        success: true,
        title: titleMsg,
        message: successMsg,
        visitorName: result.visitorName,
        checkInTime: result.checkInTime,
        checkOutTime: result.checkOutTime,
        duration: result.duration,
        action: result.action,
      })

      // reset after some time
      setTimeout(() => {
        if (isAlive.current) resetScanner()
      }, 5000) // 5 seconds dalay scan's
      
    } catch (error) {
      toast.dismiss(loadingToast)
      setToastId(null)

      let errorMsg = error.response?.data?.error || error.message || 'Scan failed'
      
      // responsing error messages
      if (errorMsg.includes('expired')) {
        errorMsg = 'Pass expired! Contact security.'
      } else if (errorMsg.includes('Invalid')) {
        errorMsg = 'Invalid QR code.'
      } else if (errorMsg.includes('not found')) {
        errorMsg = 'Pass not found.'
      }

      toast.error(errorMsg)
      
      setScanData({ 
        success: false, 
        title: 'Scan Failed', 
        message: errorMsg 
      })

      setTimeout(() => {
        if (isAlive.current) resetScanner()
      }, 3000)
      
    } finally {
      setIsProcessing(false)
    }
  }

  const resetScanner = () => {
    if (!isAlive.current) return
    setScanData(null)
    setIsProcessing(false)
    setScannerOn(true)
    scanning.current = false
  }

  const switchCamera = () => {
    if (cameras.length > 1 && !isProcessing) {
      const currentIdx = cameras.findIndex((c) => c.id === selectedCam)
      const nextIdx = (currentIdx + 1) % cameras.length
      setSelectedCam(cameras[nextIdx].id)
      setScannerOn(false)
      setTimeout(() => {
        if (isAlive.current) setScannerOn(true)
      }, 500)
    }
  }

  const askCameraPermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true })
      const devices = await Html5Qrcode.getCameras()
      if (isAlive.current && devices?.length > 0) {
        setCameras(devices)
        const backCam = devices.find((d) => d.label.toLowerCase().includes('back'))
        setSelectedCam(backCam?.id || devices[0].id)
        setCamError(null)
        setScannerOn(true)
        toast.success('Camera setup completed successfully')
      }
    } catch (err) {
      console.log('permission error:', err)
      if (isAlive.current) {
        setCamError('Camera permission denied. Please enable camera access.')
      }
    }
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto">
      {/* header section */}
      <div className="text-center mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">QR Code Scanner</h1>
        <p className="text-sm text-gray-500">Check-in / Check-out visitors by scanning their pass</p>
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
                  {scannerOn ? 'Scan Visitor Pass' : 'Scan Result'}
                </h2>
                <p className="text-sm text-white/80">
                  {scannerOn ? 'Position QR code within the frame' : 'Processing complete'}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              {cameras.length > 1 && scannerOn && !isProcessing && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={switchCamera}
                  className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                >
                  <FaCamera className="mr-2" size={12} /> Switch Camera
                </Button>
              )}
              {!scannerOn && scanData && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={resetScanner}
                  className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                >
                  <FaRedo className="mr-2" size={12} /> Scan Again
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="p-6">
          {camError ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <FaExclamationTriangle className="text-red-500 text-3xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Camera Access Required</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">{camError}</p>
              <Button onClick={askCameraPermission} variant="primary">Allow Camera Access</Button>
            </div>
          ) : scannerOn && !scanData ? (
            <div className="space-y-4">
              <div className="relative bg-black rounded-xl overflow-hidden max-w-md mx-auto">
                <div
                  id={scannerId.current}
                  ref={container}
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
                <span className="text-gray-500">Scanner is active — position QR code in frame</span>
              </div>
              {starting && (
                <div className="text-center py-4">
                  <Spinner size="md" text="Starting camera..." />
                </div>
              )}
            </div>
          ) : (
            scanData && (
              <div className="text-center py-8">
                {scanData.success ? (
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-4">
                      <FaCheckCircle size={48} className="text-green-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-green-600 mb-2">{scanData.title}</h3>
                    <p className="text-gray-600 mb-2 text-center max-w-md">{scanData.message}</p>
                    {scanData.visitorName && (
                      <p className="text-gray-600 mb-2">Visitor: <strong>{scanData.visitorName}</strong></p>
                    )}
                    {scanData.checkInTime && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg text-left w-full max-w-sm">
                        <p className="text-sm text-gray-600">📅 Check-in: {new Date(scanData.checkInTime).toLocaleString()}</p>
                        {scanData.checkOutTime && (
                          <>
                            <p className="text-sm text-gray-600 mt-1">📅 Check-out: {new Date(scanData.checkOutTime).toLocaleString()}</p>
                            <p className="text-sm font-semibold text-gray-800 mt-2">⏱️ Duration: {scanData.duration}</p>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center mb-4">
                      <FaTimesCircle size={48} className="text-red-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-red-600 mb-2">{scanData.title}</h3>
                    <p className="text-gray-600 mb-6 max-w-md text-center">{scanData.message}</p>
                    <Button onClick={resetScanner}>
                      <FaRedo className="mr-2" /> Try Again
                    </Button>
                  </div>
                )}
              </div>
            )
          )}
        </div>
      </Card>

      {/* instructions */}
      {/* <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-200">
        <h4 className="text-sm font-semibold text-blue-800 mb-2 flex items-center gap-2">
          <FaQrcode className="text-blue-600" /> How to Scan
        </h4>
        <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
          <li>Position the QR code inside the scanning frame</li>
          <li>Ensure good lighting for better detection</li>
          <li>Hold steady until the scan completes</li>
          <li>For best results, keep the QR code flat and centered</li>
        </ul>
      </div> */}
    </div>
  )
}

export default ScanPage