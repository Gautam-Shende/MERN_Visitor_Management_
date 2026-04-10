import Visitor from "../../models/Visitor.js"

export const getAllVisitors = async () => {
  return await Visitor.find()
    .populate("host", "name email")
    .sort({ createdAt: -1 })
}

export const getVisitorById = async (id) => {
  const visitor = await Visitor.findById(id).populate("host", "name email")
  
  if (!visitor) {
    throw new Error("Visitor not found")
  }
  
  return visitor
}