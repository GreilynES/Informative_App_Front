import type { AboutUsSection } from "../models/AboutUsType";

export async function getAboutUs(): Promise<AboutUsSection[]> {   
 const response = await fetch("http://localhost:3000/aboutUs");
 
 if (!response.ok) throw new Error("Failed to fetch About Us data");
 return response.json();
}
