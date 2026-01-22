export function getNiceApiMessage(err: any) {
  const status = err?.response?.status;
  const data = err?.response?.data;

  // tu backend manda { code, message }
  if (status === 409 && data?.message) return data.message;
  if (status === 400 && data?.message) return data.message;

  return "Ocurrió un error. Intenta de nuevo.";
}

export const normalizeLookupToPersona = (res: any) => {
  if (!res) return null

  const p =
    res.persona ?? // PersonaFormLookupDto.persona
    res.representanteOrganizacion?.persona ?? 
    res.representante?.persona ??
    res.organizacion?.representante?.persona ??
    res.volunteerIndividual ?? // por si el lookup reusa este shape
    res

  const nombre =
    p.nombre ??
    p.name ??
    res.firstname ??
    res.firstName ??
    res.firstname1 ??
    ""

  const apellido1 =
    p.apellido1 ??
    p.lastName1 ??
    res.lastname1 ??
    res.lastName1 ??
    res.primerApellido ??
    ""

  const apellido2 =
    p.apellido2 ??
    p.lastName2 ??
    res.lastname2 ??
    res.lastName2 ??
    res.segundoApellido ??
    ""

  const telefono = p.telefono ?? p.phone ?? p.celular
  const email = p.email ?? p.mail
  const fechaNacimiento = p.fechaNacimiento ?? p.birthDate ?? p.fecha_nacimiento
  const direccion = p.direccion ?? p.address ?? p.domicilio

  const inferredSource =
    res.source ??
    (telefono || email || fechaNacimiento || direccion ? "DB" : "TSE")

  return {
    nombre,
    apellido1,
    apellido2,
    telefono,
    email,
    fechaNacimiento,
    direccion,
    source: inferredSource,
  }
}
