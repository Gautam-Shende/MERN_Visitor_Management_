
import { useEffect, useRef, useState } from "react"
import { Html5Qrcode } from "html5-qrcode"

import toast from "react-hot-toast";

import Card from "../../components/common/Card"
import Button from "../../components/common/Button"

import { FaQrcode, FaCheckCircle, 
  FaTimesCircle, FaRedo } from "react-icons/fa"

import { scanPass } from "../../services/passService"


const ScanPage = () => {
  const [scanData, setScanData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [camKey, setCamKey] = useState(0);

  const qrEngineRef = useRef(null)
  const lockRef = useRef(false)
  const divId = "qr-reader";

  useEffect(() => {
    // cameraAcess();
    initCamera();
    return () => {
      destroyCamera();
    };
  }, []);

  //Scanning start when security login
  const initCamera = async () => {
    if (qrEngineRef.current) return;

    try {
      const engine = new Html5Qrcode(divId);
      qrEngineRef.current = engine;

      // qr bar size 
      await engine.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: 300,
        },
        (text) => {
          processQrCode(text);
        }
      );
    } catch (err) {
      // console.log(err);
      toast.error("Camera start failed", err);
    }
  }

  const destroyCamera = async () => {
    if (!qrEngineRef.current) return;

    try {
      await qrEngineRef.current.stop();
    } catch (err) {
      // console.log(err)
      toast.error(err)
    }

    try {
      await qrEngineRef.current.clear()

    } catch (err) {
      // console.log(err);
      toast.error(err);
    }

    qrEngineRef.current = null;
  }

  const processQrCode = async (rawText) => {
    if (lockRef.current) return;

    lockRef.current = true;
    setIsLoading(true);

    await destroyCamera();

    try {
      const response = await scanPass({ qrData: rawText });

      if (response.status === "expired") {
        if (scanData?.action === "checkin") {
          setScanData({
            success: true,
            action: "checkout",
            visitorName: response.visitorName || "Visitor",
            message: "Visitor checked out successfully",
          });

          toast.success("Visitor Checked Out");
        } else {
          setScanData({
            success: false,
            message: "Pass already expired",
          });

          toast.error("Pass already expired");
        }

        setIsLoading(false);
        return;
      }

      setScanData({
        success: true,
        action: response.action,
        visitorName: response.visitorName,
        message: response.message,
      });

      if (response.action === "checkin") {
        toast.success("Visitor Checked In")
      }
      if (response.action === "checkout") {
        toast.success("Visitor Checked Out")
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || "Scan failed";
      // console.log(errmsg);
      setScanData({
        success: false,
        message: errMsg,
      });

      toast.error(errMsg);
    }
    setIsLoading(false);
  }

  // this is for new scannin when try again was clicked
  const resetAndRescan = async () => {

    await destroyCamera();

    lockRef.current = false;
    setScanData(null);
    setIsLoading(false);
    // setCamKey(null)
    setCamKey((prev) => prev + 1);

    setTimeout(() => {
      initCamera();
    }, 500);
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">QR Scanner</h1>
        <p className="text-sm text-gray-500 mt-1">Scan visitor pass</p>
      </div>

      <Card className="overflow-hidden">
        <div className="bg-indigo-600 px-5 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <FaQrcode className="text-white" size={20} />
          </div>

          <div>
            <h2 className="text-white font-semibold">
              {scanData ? "Scan Result" : "Scan Visitor Pass"}
            </h2>

            <p className="text-white/70 text-sm">
              {scanData ? "Scan completed" : "Hold QR code in front of camera"}
            </p>
          </div>
        </div>

        <div className="p-6">
          {!scanData && (
            <div>
              <div
                key={camKey}
                id={divId}
                className="w-full rounded-lg overflow-hidden"
                style={{ minHeight: "300px" }}
              />

              {/* {isLoading ? (
                <p className="text-center text-indigo-600 mt-3">
                  Processing...
                </p>
              ) : (<><Fatimes classname="" size="20"/> Please try Again</>)} */}
              {isLoading && (
                <p className="text-center text-indigo-600 mt-3">
                  Processing...
                </p>
              )}
            </div>
          )}

          {scanData && scanData.success && (
            <div className="text-center py-6">
              <FaCheckCircle className="text-green-500 mx-auto mb-4" size={70} />

              <h2 className="text-2xl font-semibold text-green-600 mb-2">
                {scanData.action === "checkin" ? "Checked In" : "Checked Out"}
              </h2>

              <p className="text-gray-700 font-medium">{scanData.visitorName}</p>

              <p className="text-gray-500 mt-2">{scanData.message}</p>

              <Button onClick={resetAndRescan} className="mt-5">
                <FaRedo className="mr-2" />
                Scan Again
              </Button>
            </div>
          )}

          {scanData && !scanData.success && (
            <div className="text-center py-6">
              <FaTimesCircle className="text-red-500 mx-auto mb-4" size={70} />

              <h2 className="text-2xl font-semibold text-red-600 mb-2">
                Scan Failed
              </h2>
              <p className="text-gray-600">{scanData.message}</p>
              <Button onClick={resetAndRescan} className="mt-5">
                <FaRedo className="mr-2" />
                Try Again
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ScanPage;