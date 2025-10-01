import apiConfig from "../../../apiConfig/apiConfig";
import type { InfoPageVM } from "../../associatesInformation/models/AssociatesVolunteersInfoType";

/** GET /volunteers-page */
export async function fetchVolunteersPage(): Promise<InfoPageVM> {
  const { data } = await apiConfig.get<InfoPageVM>("/volunteers-page");
  return data;
}
