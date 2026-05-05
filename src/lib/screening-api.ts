import type { ScreeningRequest, ScreeningResponse } from "@/types/service";

const API_URL = import.meta.env.VITE_API_URL || "https://preca.admin.centerai.cloud/api/public";
const SCREENING_API_URL = `${API_URL}/screenings`;

export interface ApiError {
  error: string;
  field?: string;
}

export async function createScreening(data: ScreeningRequest): Promise<ScreeningResponse> {
  const response = await fetch(SCREENING_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${import.meta.env.VITE_API_KEY}`
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData: ApiError = await response.json().catch(() => ({ error: "Error desconocido" }));
    throw errorData;
  }

  return response.json();
}