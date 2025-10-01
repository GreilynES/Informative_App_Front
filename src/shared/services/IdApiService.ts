export async function fetchCedulaData(cedula: string) {
  const res = await fetch(`https://apis.gometa.org/cedulas/${cedula}`)
  if (!res.ok) throw new Error("Error al consultar la API")
  const data = await res.json()

  // Validación mínima
  if (!data.results || data.results.length === 0) throw new Error("Sin resultados")
  
  const persona = data.results[0]
  if (persona.fullname?.toUpperCase().includes("NO REGISTRADA")) {
    throw new Error("Cédula no registrada")
  }

  return persona
}