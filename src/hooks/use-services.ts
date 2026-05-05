import { useQuery } from "@tanstack/react-query";
import type { Service } from "@/types/service";

const SERVICES_API_URL = "https://preca.admin.centerai.cloud/api/public/services";

export function useServices() {
  return useQuery<Service[]>({
    queryKey: ["services"],
    queryFn: async () => {
      const response = await fetch(SERVICES_API_URL);
      if (!response.ok) {
        throw new Error("Failed to fetch services");
      }
      return response.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
