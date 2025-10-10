import apiConfig from "../../../apiConfig/apiConfig";
import type { CreateInfraestructuraProduccionDto } from "../../associatesForm/models/createAssociate";

const BASE = "/infraestructura-produccion";

export async function getByFinca(idFinca: number) {
  const { data } = await apiConfig.get(`${BASE}/finca/${idFinca}`);
  console.log("[getByFinca] data:", data);
  return data;
}
export async function createInfraestructuraProduccion(dto: CreateInfraestructuraProduccionDto) {
  const { data } = await apiConfig.post(BASE, dto, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log("[createInfraestructuraProduccion] data:", data);
  return data;
}
