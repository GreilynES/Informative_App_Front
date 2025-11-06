import apiConfig from "../../../apiConfig/apiConfig";
import type { FAQ } from "../models/FAQType";


export async function getFaqs(): Promise<FAQ[]> {
  const response = await apiConfig.get<FAQ[]>("/faq");
  return response.data;
}


