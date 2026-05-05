import type { ScreeningRequest, ScreeningResponse } from "@/types/service";

const SCREENING_API_URL = "https://preca.admin.centerai.cloud/api/public/screenings";

export interface ApiError {
  error: string;
  field?: string;
}

export async function createScreening(data: ScreeningRequest): Promise<ScreeningResponse> {
  const response = await fetch(SCREENING_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData: ApiError = await response.json().catch(() => ({ error: "Error desconocido" }));
    throw errorData;
  }

  return response.json();
}
