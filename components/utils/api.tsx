// utils/api.ts
import Cookies from 'js-cookie'

export const uploadContract = async (contractData: FormData) => {
  const token = Cookies.get('authToken')
  const response = await fetch('http://localhost:8080/uploadContract', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: contractData,
  })
  if (response.status !== 200) {
    throw new Error('Error al subir el contrato')
  }
  return response.json()
}

// Otras funciones exportadas
export const createCompany = async (companyData: {
    
    CompanyName: string
    CompanyDescription: string
    RepresentativeID: number
    BusinessTypeID: number
    CompanySize: number
  }) => {
    const token = Cookies.get('authToken')
    const response = await fetch('http://localhost:8080/createCompany', {
      method: 'POST',
      headers: {
        'Authorization': token,
      },
      body: JSON.stringify(companyData),
    })
    if (response.status !== 200) {
      throw new Error('Error al crear la empresa')
    }
    return response.json()
  }