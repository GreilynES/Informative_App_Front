import apiConfig from "../../../apiConfig/apiConfig";
import type { AboutUsSection } from "../models/AboutUsType";

export async function getAboutUs(): Promise<AboutUsSection[]> {   
const response = await apiConfig.get<AboutUsSection[]>("/aboutUs");
return response.data;

}
