import * as visitorService from "../services/visitorService.js"

export const getVisitors = async (req, res) => {
  try {
    const visitors = await visitorService.getAllVisitors()
    res.status(200).json(visitors)
  } catch (error) {
    console.log("Error fetching visitors:", error.message)
    res.status(500).json({ error: "Failed to fetch visitors" })
  }
}

export const getVisitorById = async (req, res) => {
  const { id } = req.params
  
  if (!id) {
    return res.status(400).json({ error: "Visitor ID required" })
  }
  
  try {
    const visitor = await visitorService.getVisitorById(id)
    if (!visitor) {
      return res.status(404).json({ error: "Visitor not found" })
    }
    res.status(200).json(visitor)
  } catch (error) {
    console.log("Error fetching visitor:", error.message)
    res.status(500).json({ error: "Failed to fetch visitor" })
  }
}