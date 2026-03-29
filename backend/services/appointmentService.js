
// 
import Appointment from "../models/Appointment.js"

import Visitor from "../models/Visitor.js"

import User from "../models/User.js"
import Pass from "../models/Pass.js"

import emailService from "../utils/emailService.js";

export const createAppointment = async (visitorId, date) => {

  if (!visitorId) 
    throw new Error("Please Enter visitor ID...")
    // console.log(visitorId)

  if (!date) 
    throw new Error("Please Enter date....")
  // console.log(date, "Please enter date...")

  // const visitor = await Visitor.findById(visitorId)
  const visitor = await Visitor.findById(visitorId)
  if (!visitor) throw new Error("Visitor Not Found.....")

    // console.log(visitor, "Visitor Not found")


    // host(employee/admin)
    let hostId = null;
  if (visitor.host) {

    hostId = visitor.host;
  } else {

    // const defaultHost = User.findById({ role:["admin", "employee"]}})
    const defaultHost = await User.findOne({ role: { $in: ["admin", "employee"] } })

    if (defaultHost) {
      hostId = defaultHost._id;
    }
  }

  const newAppointment = await Appointment.create({
    visitor: visitorId,
    host: hostId,
    date,
  })

  // email mssage
  await emailService.sendAppointmentCreated({
        visitorName: visitor.name,
        visitorEmail: visitor.email,
        date: newAppointment.date,
        id: newAppointment._id,
        location: "Main Office",
        hostName: visitor.host?.name || "Admin (To be assigned)",
        status: newAppointment.status
    });

  return newAppointment;
  // console.log(newAppointment)
}

export const approveAppointment = async (id) => {

  // const appointment = await Appointment.findById(id)
  const appointment = await Appointment.findById(id).populate("visitor")

  if (!appointment) 
    throw new Error("Appointment not found")
    // console.log("Appointment not found....")

  if (appointment.status === "approved")
    throw new Error("Appointment already approved")
  // console.log("appointment already approved....")


    await emailService.sendApproval({
        visitorName: appointment.visitor.name,
        visitorEmail: appointment.visitor.email,
        date: appointment.date,
        location: "Main Office",
        hostName: appointment.host?.name || "Admin",
        id: appointment._id
    });


  appointment.status = "approved";
  await appointment.save();

  await Visitor.findByIdAndUpdate(appointment.visitor._id, { status: "approved" });

  return appointment;
  // console.log(appointment)
}

export const rejectAppointment = async (id) => {

  const appointment = await Appointment.findById(id).populate("visitor")

  if (!appointment) 
     // console.log("appointment not found.....")
    throw new Error("Appointment not found")
   

  if (appointment.status === "rejected")
     //  console.log("appointment already rejected....")
     throw new Error("Appointment already rejected")


    await emailService.sendRejection({
        visitorName: appointment.visitor.name,
        visitorEmail: appointment.visitor.email,
        date: appointment.date,
        reason: reason
    });


  appointment.status = "rejected";
  await appointment.save();

  await Visitor.findByIdAndUpdate(appointment.visitor._id, { status: "rejected" });

  return appointment;
  // console.log(appointment)
}

export const getAllAppointments = async () => {

  // const appointments = await Appointment.find()
  //   .populate("visitor")
  //   // .populate("host")
  //   .sort({ createdAt: -1 })

  const appointments = await Appointment.find()
    .populate("visitor")
    // .populate("host")
    .populate("host", "name email")
    .lean()
    .sort({ createdAt: -1 })

  const appointmentIds = appointments.map(a => a._id)

  const passes = await Pass.find({ appointment: { $in: appointmentIds } }).select("appointment")

  const passAppointmentIds = new Set(passes.map(p => 
    p.appointment.toString()))

  // return appointments.map(
  //   passGenerated: passAppointmentIds.has(appointmentId.toString())
  
  return appointments.map(a => ({
    ...a,
    passGenerated: passAppointmentIds.has(a._id.toString())

  }))
}

export const getAppointmentById = async (id) => {

  const appointment = await Appointment.findById(id)
    .populate("visitor")
    .populate("host", "name email")

  if (!appointment) 
    // console.log("No appointment found with this ID")
    throw new Error("No appointment found with this ID");
  return appointment;
  // console.log(appointment)
}