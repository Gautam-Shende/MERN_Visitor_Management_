import api from './api'

export const getVisitorReport = async (params) => {
  try {
    const response = await api.get('/reports/visitors', { params })
    // console.log(response.data)
    return response.data
  } catch (error) {
    // console.error('Report service error:', error)
    throw error
  }
}