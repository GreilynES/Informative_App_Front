
import { useEffect, useState } from "react"
import { getAboutUs } from "../services/aboutUsService"
import type { AboutUsSection } from "../models/AboutUsType"

export const useAboutUs = () => {
  const [data, setData] = useState<AboutUsSection[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const result = await getAboutUs()
      setData(result)
      setIsLoading(false)
    }
    fetchData()
  }, [])

  return { data, isLoading }
}