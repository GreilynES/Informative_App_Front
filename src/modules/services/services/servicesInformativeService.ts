import apiConfig from "../../../apiConfig/apiConfig";
import type { Service } from "../models/ServicesType";

export async function getInformativeServices(): Promise<Service[]> {
  const response = await apiConfig.get<Service[]>("/servicesInformative");
  return response.data;
}

export async function updateInformativeService(
  id: number, 
  updatedService: Service
): Promise<Service> {
  const response = await apiConfig.put<Service>(
    `/servicesInformative/${id}`, 
    updatedService
  );
  return response.data;
}