import apiConfig from "../../../apiConfig/apiConfig";
import type { InfoPageVM } from "../models/AssociatesVolunteersInfoType";
/** GET /associates-page */
export async function fetchAssociatesPage(): Promise<InfoPageVM> {
  const { data } = await apiConfig.get<InfoPageVM>("/associates-page");
  return data;
}
