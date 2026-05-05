import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Service } from "@/types/service";

interface GroupedService {
  baseName: string;
  displayName: string;
  fisica: Service | undefined;
  moral: Service | undefined;
}

interface ServiceTypeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupedService: GroupedService | null;
}

export function ServiceTypeDialog({
  open,
  onOpenChange,
  groupedService,
}: ServiceTypeDialogProps) {
  const navigate = useNavigate();

  if (!groupedService) return null;

  const handleSelect = (service: Service | undefined) => {
    if (service) {
      navigate(`/servicio/${service.id}`);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            {groupedService.displayName}
          </DialogTitle>
          <DialogDescription className="text-center">
            Selecciona el tipo de persona para continuar
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 mt-4">
          {/* Persona Física */}
          <button
            onClick={() => handleSelect(groupedService.fisica)}
            disabled={!groupedService.fisica}
            className="group p-6 rounded-xl border-2 border-border hover:border-primary/50 bg-card hover:bg-primary/5 transition-all duration-300 flex flex-col items-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-foreground mb-1">Persona Física</h3>
              <p className="text-xs text-muted-foreground mb-2">
                Para evaluación de personas individuales
              </p>
              {groupedService.fisica && (
                <span className="text-lg font-bold text-primary">
                  {groupedService.fisica.formattedPrice}
                </span>
              )}
            </div>
          </button>

          {/* Persona Moral */}
          <button
            onClick={() => handleSelect(groupedService.moral)}
            disabled={!groupedService.moral}
            className="group p-6 rounded-xl border-2 border-border hover:border-primary/50 bg-card hover:bg-primary/5 transition-all duration-300 flex flex-col items-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-foreground mb-1">Persona Moral</h3>
              <p className="text-xs text-muted-foreground mb-2">
                Para evaluación de empresas
              </p>
              {groupedService.moral && (
                <span className="text-lg font-bold text-primary">
                  {groupedService.moral.formattedPrice}
                </span>
              )}
            </div>
          </button>
        </div>

        <Button
          variant="ghost"
          className="mt-4 w-full"
          onClick={() => onOpenChange(false)}
        >
          Cancelar
        </Button>
      </DialogContent>
    </Dialog>
  );
}

export type { GroupedService };
