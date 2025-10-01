import apiConfig from "../../../apiConfig/apiConfig";
import type { CreateAssociatePayload } from "../models/createAssociate";

export async function createAssociate(payload: CreateAssociatePayload) {
  try {
    const { data } = await apiConfig.post("/associates", payload, {
      headers: { "Content-Type": "application/json" },
    });
    return data;
  } catch (err: any) {
    console.error("POST /associates failed:", err?.response?.data ?? err);
    throw err;
  }
}
