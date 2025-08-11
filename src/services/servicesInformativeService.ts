import type { Service } from "../models/ServicesType"


const API_URL = "http://localhost:3000/servicesInformative"

export async function getInformativeServices() {
  const response = await fetch(API_URL)

  if (!response.ok) throw new Error("Error al obtener los servicios informativos")
  return response.json()
}

export async function updateInformativeService(id: number, updatedService: Service) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedService),
  })

  if (!response.ok) {
    throw new Error("Error al actualizar el servicio informativo")
  }

  return response.json()
}
