import { useQuery } from "@tanstack/react-query";
import type { Service } from "@/types/service";

// Usamos la variable de entorno, y dejamos la URL de producción como respaldo (opcional)
const API_URL = import.meta.env.VITE_API_URL || "https://preca.admin.centerai.cloud/api/public";

export function useServices() {
  return useQuery<Service[]>({
    queryKey: ["services"],
    queryFn: async () => {
      // Hacemos el fetch a la ruta correcta usando nuestra variable
      const response = await fetch(`${API_URL}/services`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Inyectamos la API Key exactamente en el formato que espera el backend
          "Authorization": `Bearer ${import.meta.env.VITE_API_KEY}`
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch services");
      }
      
      return response.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}