import Visitor from "../../models/Visitor.js";
import Pass from "../../models/Pass.js";
import CheckLog from "../../models/CheckLog.js";
import Appointment from "../../models/Appointment.js";

export const getDashboardStats = async () => {
  const totalVisitors = await Visitor.countDocuments();

  const pendingVisitors = await Visitor.countDocuments({
    status: "pending",
  });

  const approvedVisitors = await Visitor.countDocuments({
    status: "approved",
  });

  const rejectedVisitors = await Visitor.countDocuments({
    status: "rejected",
  });

  const totalPasses = await Pass.countDocuments();

  const activePasses = await Pass.countDocuments({
    status: "active",
  });
  const insidePasses = await Pass.countDocuments({
    status: "inside",
  });
  const expiredPasses = await Pass.countDocuments({
    status: "expired",
  });

  const totalCheckIns = await CheckLog.countDocuments({
    checkInTime: { $ne: null },
  });

  const totalCheckOuts = await CheckLog.countDocuments({
    checkOutTime: { $ne: null },
  });

  const totalAppointments = await Appointment.countDocuments();

  const requestedAppointments = await Appointment.countDocuments({
    status: "requested",
  });

  const pendingAppointments = await Appointment.countDocuments({
    status: "pending",
  });

  const approvedAppointments = await Appointment.countDocuments({
    status: "approved",
  });

  return {
    totalVisitors,
    pendingVisitors,
    approvedVisitors,
    rejectedVisitors,

    totalPasses,
    activePasses,
    insidePasses,
    expiredPasses,

    totalCheckIns,
    totalCheckOuts,

    totalAppointments,
    requestedAppointments,
    pendingAppointments,
    approvedAppointments,
  };
};
