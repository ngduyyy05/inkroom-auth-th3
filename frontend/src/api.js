import axios from 'axios'

export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api', timeout: 15000 })
export const authHeaders = token => ({ headers: { Authorization: `Bearer ${token}` } })

export function errorMessage(error) {
  const data = error.response?.data
  if (data?.errors) return Object.values(data.errors).flat().join(' ')
  return data?.message || 'Không kết nối được máy chủ. Vui lòng thử lại.'
}
