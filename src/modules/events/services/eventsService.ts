import apiConfig from "../../../apiConfig/apiConfig";
import type { EventData } from "../models/EventType";

export async function getEventsData() {
const response = await apiConfig.get<EventData[]>("/event");
return response.data;
}
