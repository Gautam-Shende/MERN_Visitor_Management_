
import * as passService from "../services/passService.js"

import { checkInVisitor, 
  checkOutVisitor } from "./checkController.js"

export const generatePass = async (req, res) => {
  try {
    const { id } = req.params
    
    if (!id) {

      // console.log("Generate pass attempt missing visitor ID")
      return res.status(400).json({ 
        message: "Visitor ID is required to generate pass" 
      })
      // console.log("Error: Missing visitor ID")
    }
    
    // console.log("Generating pass for visitor ID:", id)
   
   
    const pass = await passService.generatePass(id)
    
    if (!pass) {
     
      // console.log("Pass generation failed for visitor ID:", id)
      return res.status(404).json({ 
        message: "Visitor not found or cannot generate pass" 
      })
      // console.log("Error: Pass generation failed")
    }
    
    // console.log("Pass generated successfully for visitor:", pass.visitorName)
    
    
    res.status(201).json({ 
      message: "Pass generated successfully", 
      pass 
    })
    // console.log("Pass response sent for visitor ID:", id)
  
  }
   catch (error) {
    // console.error("Error in generatePass controller:", error)
    
    if (error.message === "Visitor not found") {
      
      return res.status(404).json({ 
        message: "Visitor not found" 
      })
      // console.log("Error: Visitor not found for pass generation")
    }
    
    if (error.message === "Pass already exists for this visitor") {
      
      return res.status(409).json({ 
        message: "A pass already exists for this visitor",
        alreadyExists: true
      })
      // console.log("Error: Pass already exists")
    }
    
    if (error.message === "Visitor status is not approved") {
      
      return res.status(403).json({ 
        message: "Cannot generate pass. Visitor status is not approved",
        statusRequired: "approved"
      })
      // console.log("Error: Visitor not approved")
    }
    
    res.status(500).json({ 
      message: error.message || "Server error while generating pass" 
    })
    // console.log("Error: Server error during pass generation", error)
  }
}

export const scanPass = async (req, res) => {
  try {
    
    // console.log("qrData:", req.body.qrData);
    // console.log("qrData type:", typeof req.body.qrData);
    
    const { qrData } = req.body;
    
    if (!qrData) {
      // console.log(" No qrData in shows");
      return res.status(400).json({ message: "QR data is required to scan pass" });
    }
    
    let qrDataString = qrData;

    if (typeof qrData !== 'string') {
      qrDataString = JSON.stringify(qrData);
    }
    
    // console.log("Processed qrDataString:", qrDataString);
    
    const pass = await passService.scanPass(qrDataString);
    
    // console.log(" Pass found:", pass?._id, "Status:", pass?.status);
    
    if (!pass) {
      return res.status(404).json({ message: "Invalid or expired pass" });
    }
    
    req.body.passId = pass._id.toString();
    
    if (pass.status === "active") {
      // console.log("Calling checkInVisitor")
      return checkInVisitor(req, res); 
    } 
    else if (pass.status === "inside") {
      // console.log("Calling checkOutVisitor")
      return checkOutVisitor(req, res);
    } 
    else {
      return res.status(400).json({ 
        message: "Pass expired or invalid",
        status: pass.status
      });
    }
    
  } catch (error) {
    // console.error("Error in scanPass controller:", error);
    res.status(500).json({ message: error.message || "Server error while scanning pass" });
  }
}


export const getPasses = async (req, res) => {
  try {
    const { status, visitorId, date } = req.query
    
    // console.log("Fetching passes with filters:", { status, visitorId, date })
   
    const passes = await passService.getAllPasses()
    
    if (!passes || passes.length === 0) {
     
      // console.log("No passes found in system")
      return res.status(200).json({ 
        message: "No passes found", 
        passes: [] 
      })
      // console.log("Info: No passes available")
    }
    // console.log(`Fetched ${passes.length} passes successfully`)
   
   
    res.status(200).json(passes)
    // console.log("Passes response sent successfully")
  
  
  } catch (error) {
    // console.error("Error in getPasses controller:", error)
   
    res.status(500).json({ 
      message: error.message || "Failed to fetch passes" 
    })
    // console.log("Error: Failed to fetch passes", error)
  }
}

export const getPassById = async (req, res) => {
  try {
    const { id } = req.params
    if (!id) {
    
      // console.log("Get pass by ID attempt missing ID")
      return res.status(400).json({ 
        message: "Pass ID is required" 
      })
      // console.log("Error: Missing pass ID")
    }
    // console.log("Fetching pass by ID:", id)
    
    
    const pass = await passService.getPassById(id)
    
    if (!pass) {
    
      // console.log("Pass not found with ID:", id)
      return res.status(404).json({ 
        message: "Pass not found" 
      })
      // console.log("Error: Pass not found")
    }
    
    // console.log("Pass found:", pass._id)
   
   
    res.status(200).json(pass)
    // console.log("Pass response sent for ID:", id)
 
 
  } 
  catch (error) {
    // console.error("Error in getPassById controller:", error)
    
    if (error.name === "CastError") {
     
      return res.status(400).json({ 
        message: "Invalid pass ID format" 
      })
      // console.log("Error: Invalid pass ID format")
    }
    
    res.status(500).json({ 
      message: error.message || "Failed to fetch pass" 
    })
    // console.log("Error: Failed to fetch pass by ID", error)
  }
}

export const getCheckLogsByPassId = async (req, res) => {
  try {
    const { passId } = req.params
    
    if (!passId) {
     
      // console.log("Get check logs attempt missing pass ID")
      return res.status(400).json({ 
        message: "Pass ID is required to fetch logs" 
      })
      // console.log("Error: Missing pass ID")
    }
    
    // console.log("Fetching check logs for pass ID:", passId)
    
    
    const logs = await passService.getCheckLogsByPassId(passId)
    
    if (!logs) {
     
      // console.log("No logs found for pass ID:", passId)
      return res.status(404).json({ 
        message: "No check-in/out logs found for this pass" 
      })
      // console.log("Error: No logs found")
    }
    
    if (logs.length === 0) {
      
      // console.log("No check logs available for pass ID:", passId)
      return res.status(200).json({ 
        message: "No check-in/out records found",
        logs: [] 
      })
      // console.log("Info: No logs available for this pass")
    }
    
  
    res.status(200).json(logs)
    // console.log("Check logs response sent successfully")
  
  } catch (error) {
    // console.error("Error in getCheckLogsByPassId controller:", error)
    
    if (error.name === "CastError") {
      
      return res.status(400).json({ 
        message: "Invalid pass ID format" 
      })
      // console.log("Error: Invalid pass ID format")
    }
    
    res.status(500).json({ 
      message: error.message || "Failed to fetch check-in/out logs" 
    })
    // console.log("Error: Failed to fetch check logs", error)
  }
}