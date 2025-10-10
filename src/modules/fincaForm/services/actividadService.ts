import apiConfig from "../../../apiConfig/apiConfig";
import type { CreateActividadDto } from "../../associatesForm/models/createAssociate";

const BASE = "/actividades-agropecuarias";

export const actividadAgropecuariaService = {
  async create(dto: CreateActividadDto) {
    const { data } = await apiConfig.post<CreateActividadDto>(BASE, dto, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(data);
    return data;
  },

  async listByFinca(idFinca: number) {
    const { data } = await apiConfig.get(`${BASE}/by-finca/${idFinca}`);
    return data;
  },

  async remove(id: number) {
    await apiConfig.delete(`${BASE}/${id}`);
  },
};
