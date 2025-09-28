import apiConfig from "../apiConfig";
import type { InfoPageVM } from "../models/VolunteersInfoType";

/** GET /associates-page */
export async function fetchAssociatesPage(): Promise<InfoPageVM> {
  const { data } = await apiConfig.get<InfoPageVM>("/associates-page");
  return data;
}
