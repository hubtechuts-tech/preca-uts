import type { ScreeningRequest, ScreeningResponse } from "@/types/service";

const SCREENING_API_URL = '/api/public';

export interface ApiError {
  error: string;
  field?: string;
}

export async function createScreening(data: ScreeningRequest): Promise<ScreeningResponse> {
  const url = `${SCREENING_API_URL}/screenings`;   // ← Agrega /screenings

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData: ApiError = await response.json().catch(() => ({ 
      error: "Error desconocido del servidor" 
    }));
    throw errorData;
  }

  return response.json();
}
