import { aboutUs, type AboutUsSection } from "../models/AboutUsType"

export const getAboutUs = (): AboutUsSection[] => {
  return aboutUs
}