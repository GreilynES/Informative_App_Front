import apiConfig from "../../../apiConfig/apiConfig";

export async function getEventsData() {
const response = await apiConfig.get<Event[]>("/event");
return response.data;
}
