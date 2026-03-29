
import Pass from "../models/Pass.js"
import CheckLog from "../models/CheckLog.js"

import emailService from "../utils/emailService.js";

const getMinutesDiff = (start, end) => {
  return Math.round((end - start) / 1000 / 60);
}

export const checkInVisitor = async (passId) => {

  if (!passId) 
    throw new Error("passId is required");
  // console.log("passId is not required...")

  // const pass = await Pass.findById(passId)
  const pass = await Pass.findById(passId).populate("visitor")

  if (!pass) 
    throw new Error("This pass does not exist")
  //  console.log("This pass does not exist")

  if (pass.status === "expired") 

    throw new Error("Pass has expired, entry is not allowed")
    // console.log("Pass has expired, entry is not allowed")

  if (pass.status === "inside") 

    throw new Error("Visitor is already inside")
// console.log("visitor is already inside...")

  if (pass.status !== "active") 

    throw new Error(`Pass is not active, current status: ${pass.status}`)
// console.log(`Pass is not active, current status: ${pass.status}`)

  const alreadyCheckedIn = await CheckLog.findOne({ pass: pass._id, checkOutTime: null })

  if (alreadyCheckedIn) 

    throw new Error("A check-in log already exists for this pass")
// console.log(""A check-in log already exists for this pass")

  const now = new Date()

  const checkLog = await CheckLog.create({ pass: pass._id, checkInTime: now })

  pass.status = "inside";
  await pass.save();

    const formattedDateTime = emailService.formatDateTime(now);
    
    await emailService.sendCheckIn({
        visitorName: pass.visitor?.name || "Visitor",
        visitorEmail: pass.visitor?.email,
        passId: pass._id,
        checkInDate: formattedDateTime.date,
        checkInTime: formattedDateTime.time,
        location: "Main Entrance",
        hostName: pass.visitor?.host?.name || "Security Team"
    });

  return { checkLog, visitorName: pass.visitor?.name || "Visitor" };
  // console.log(checklog)
}

export const checkOutVisitor = async (passId) => {
  
  if (!passId)
     throw new Error("passId is required")

  // console.log("pass is requried....")

  const pass = await Pass.findById(passId).populate("visitor")

  if (!pass) throw new Error("No pass found with this ID")

  if (pass.status !== "inside") 
    throw new Error(`Visitor is not currently inside,
   current status: ${pass.status}`)

  //  console.log(`Visitor is not currently inside,
  //  current status: ${pass.status}`)

  // const activeLog = await CheckLog.findOne({ pass: pass._id })
  const activeLog = await CheckLog.findOne({ pass: pass._id, checkOutTime: null })

  if (!activeLog) 

    throw new Error("Check-in record not found, please contact admin")
  // console.log("Check-in record not found, please contact admin")

  const now = new Date();
  activeLog.checkOutTime = now;
  await activeLog.save();

  pass.status = "expired";
  await pass.save();

  const totalMinutes = getMinutesDiff(activeLog.checkInTime, now);


    const checkInFormatted = emailService.formatDateTime(activeLog.checkInTime);
    const checkOutFormatted = emailService.formatDateTime(now);

    await emailService.sendCheckOut({
        visitorName: pass.visitor?.name || "Visitor",
        visitorEmail: pass.visitor?.email,
        passId: pass._id,
        checkInDate: checkInFormatted.date,
        checkInTime: checkInFormatted.time,
        checkOutDate: checkOutFormatted.date,
        checkOutTime: checkOutFormatted.time,
        location: "Main Entrance",
        duration: emailService.calculateDuration(activeLog.checkInTime, now)
    })



  return {
    checkLog: activeLog,
    summary: {
      checkInTime: activeLog.checkInTime,
      checkOutTime: now,
      totalTimeInsideMinutes: totalMinutes,
    },
    visitorName: pass.visitor?.name || "Visitor",
  };
}