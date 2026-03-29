import Visitor from "../models/Visitor.js"

export const getAllVisitors = async () => {
  const visitors = await Visitor.find()
    .populate("host", "name email")
    .sort({ createdAt: -1 })
  
  // console.log(`Fetched ${visitors.length} visitors`)
  return visitors
}

export const getVisitorById = async (id) => {

  const visitor = await Visitor.findById(id)
    .populate("host", "name email")
  
  if (!visitor) {
    // console.log("Visitor not found with ID:", id)
    throw new Error("Visitor not found")
  }
  
  // console.log("Visitor found:", visitor.name)
  return visitor
}