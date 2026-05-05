import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, AlertCircle, MessageCircle, CheckCircle, User, Hash, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useServices } from "@/hooks/use-services";
import { createScreening, type ApiError } from "@/lib/screening-api";
import { useState, useEffect, useRef } from "react";
import type { FormField } from "@/types/service";

// Translate common API error messages to Spanish
const translateError = (error: string): string => {
  const translations: Record<string, string> = {
    "Advisor phone must be at least 10 characters": "El teléfono del asesor debe tener al menos 10 caracteres",
    "Advisor name must be at least 2 characters": "El nombre del asesor debe tener al menos 2 caracteres",
    "Advisor ID is invalid": "La clave del asesor no es válida",
    "Phone must be at least 10 characters": "El teléfono debe tener al menos 10 caracteres",
    "Email is invalid": "El correo electrónico no es válido",
    "Name must be at least 2 characters": "El nombre debe tener al menos 2 caracteres",
    "Service not found": "Servicio no encontrado",
    "Invalid request": "Solicitud inválida",
  };

  // Check for exact match
  if (translations[error]) return translations[error];

  // Check for partial matches
  const lowerError = error.toLowerCase();
  if (lowerError.includes("phone") && lowerError.includes("10")) 
    return "El teléfono debe tener al menos 10 caracteres";
  if (lowerError.includes("advisor phone")) 
    return "El teléfono del asesor debe tener al menos 10 caracteres";
  if (lowerError.includes("email") && lowerError.includes("invalid")) 
    return "El correo electrónico no es válido";
  if (lowerError.includes("required")) 
    return "Este campo es requerido";
  if (lowerError.includes("invalid")) 
    return "El valor ingresado no es válido";

  return error; // Return original if no translation found
};

export default function ServiceForm() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const { data: services, isLoading, error } = useServices();
  const errorRef = useRef<HTMLDivElement>(null);
  
  const [formData, setFormData] = useState<Record<string, string | boolean>>({});
  const [applicantName, setApplicantName] = useState("");
  const [applicantEmail, setApplicantEmail] = useState("");
  const [applicantPhone, setApplicantPhone] = useState("");
  const [advisorId, setAdvisorId] = useState("");
  const [advisorName, setAdvisorName] = useState("");
  const [advisorPhone, setAdvisorPhone] = useState("");
  // Applicant details fields (for billing/fiscal info)
  const [applicantRFC, setApplicantRFC] = useState("");
  const [applicantStreet, setApplicantStreet] = useState("");
  const [applicantColony, setApplicantColony] = useState("");
  const [applicantMunicipality, setApplicantMunicipality] = useState("");
  const [applicantState, setApplicantState] = useState("");
  const [applicantZipCode, setApplicantZipCode] = useState("");
  const [applicantLegalRepresentative, setApplicantLegalRepresentative] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const service = services?.find(s => s.id.toString() === serviceId);
  const isFileService = service?.formSchema.fields.some(f => f.type === "file");

  const handleFieldChange = (fieldName: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    // Clear field error when user starts typing
    if (fieldErrors[fieldName]) {
      setFieldErrors(prev => {
        const next = { ...prev };
        delete next[fieldName];
        return next;
      });
    }
    setApiError(null);
  };

  const clearFieldError = (fieldName: string) => {
    if (fieldErrors[fieldName]) {
      setFieldErrors(prev => {
        const next = { ...prev };
        delete next[fieldName];
        return next;
      });
    }
    setApiError(null);
  };

  const handleWhatsAppRedirect = () => {
    const message = encodeURIComponent(
      `Hola, me interesa el servicio: ${service?.name}. Me gustaría más información.`
    );
    window.open(`https://wa.me/529613168341?text=${message}`, "_blank");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!service) return;

    // Clear previous errors
    setFieldErrors({});
    setApiError(null);

    // Validate required fields
    const errors: Record<string, string> = {};
    
    if (!applicantName.trim()) errors.applicantName = "El nombre es requerido";
    if (!applicantEmail.trim()) errors.applicantEmail = "El correo es requerido";
    if (!applicantPhone.trim()) errors.applicantPhone = "El teléfono es requerido";

    // Validate applicant details if required
    if (service.requiresApplicantDetails) {
      if (!applicantRFC.trim()) errors.applicantRFC = "El RFC es requerido";
      if (!applicantStreet.trim()) errors.applicantStreet = "La calle es requerida";
      if (!applicantColony.trim()) errors.applicantColony = "La colonia es requerida";
      if (!applicantMunicipality.trim()) errors.applicantMunicipality = "El municipio es requerido";
      if (!applicantState.trim()) errors.applicantState = "El estado es requerido";
      if (!applicantZipCode.trim()) errors.applicantZipCode = "El código postal es requerido";
      // Legal representative only required for "moral" person type
      if (service.targetPersonType === "moral" && !applicantLegalRepresentative.trim()) {
        errors.applicantLegalRepresentative = "El representante legal es requerido";
      }
    }

    const requiredFields = service.formSchema.fields.filter(f => f.required);
    for (const field of requiredFields) {
      if (!formData[field.name]) {
        errors[field.name] = `${field.label} es requerido`;
      }
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setApiError("Por favor complete todos los campos requeridos.");
      errorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setIsSubmitting(true);

    // Build request with applicant details if required
    const requestData: Parameters<typeof createScreening>[0] = {
      serviceId: service.id.toString(),
      applicantName,
      applicantEmail,
      applicantPhone,
      ...(advisorId && { advisorId }),
      ...(advisorName && { advisorName }),
      ...(advisorPhone && { advisorPhone }),
      formData,
    };

    // Add applicant details if required
    if (service.requiresApplicantDetails) {
      requestData.applicantPersonType = service.targetPersonType || "physical";
      requestData.applicantRFC = applicantRFC;
      requestData.applicantStreet = applicantStreet;
      requestData.applicantColony = applicantColony;
      requestData.applicantMunicipality = applicantMunicipality;
      requestData.applicantState = applicantState;
      requestData.applicantZipCode = applicantZipCode;
      // Only include legal representative for "moral" type
      if (service.targetPersonType === "moral") {
        requestData.applicantLegalRepresentative = applicantLegalRepresentative;
      }
    }

    try {
      const result = await createScreening(requestData);

      // Open payment link in new tab
      window.open(result.paymentLinkUrl, "_blank");

      // Navigate to pending page with service info
      navigate("/pago-pendiente", {
        state: {
          serviceName: service.name,
          applicantEmail,
        },
      });
    } catch (err) {
      const apiErr = err as ApiError;
      const errorMessage = translateError(apiErr.error || "Hubo un error al procesar su solicitud. Intente nuevamente.");
      
      // Try to detect which field the error is about
      const errorLower = errorMessage.toLowerCase();
      if (errorLower.includes("advisor phone") || errorLower.includes("teléfono del asesor")) {
        setFieldErrors({ advisorPhone: errorMessage });
      } else if (errorLower.includes("advisor name") || errorLower.includes("nombre del asesor")) {
        setFieldErrors({ advisorName: errorMessage });
      } else if (errorLower.includes("advisor") || errorLower.includes("asesor")) {
        setFieldErrors({ advisorId: errorMessage });
      } else if (errorLower.includes("phone") || errorLower.includes("teléfono")) {
        setFieldErrors({ applicantPhone: errorMessage });
      } else if (errorLower.includes("email") || errorLower.includes("correo")) {
        setFieldErrors({ applicantEmail: errorMessage });
      } else if (errorLower.includes("name") || errorLower.includes("nombre")) {
        setFieldErrors({ applicantName: errorMessage });
      }
      
      setApiError(errorMessage);
      errorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: FormField) => {
    const sortedFields = [...(service?.formSchema.fields || [])].sort((a, b) => a.order - b.order);
    const fieldIndex = sortedFields.findIndex(f => f.id === field.id);

    if (field.type === "boolean") {
      return (
        <motion.div
          key={field.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: fieldIndex * 0.05 }}
          className="flex items-start space-x-3 py-3"
        >
          <Checkbox
            id={field.name}
            checked={!!formData[field.name]}
            onCheckedChange={(checked) => handleFieldChange(field.name, !!checked)}
          />
          <Label htmlFor={field.name} className="text-sm leading-relaxed cursor-pointer">
            {field.label}
            {field.required && <span className="text-destructive ml-1">*</span>}
          </Label>
        </motion.div>
      );
    }

    return (
      <motion.div
        key={field.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: fieldIndex * 0.05 }}
        className="space-y-2"
      >
        <Label htmlFor={field.name} className="text-sm font-medium">
          {field.label}
          {field.required && <span className="text-destructive ml-1">*</span>}
        </Label>
        <Input
          id={field.name}
          type={field.type === "tel" ? "tel" : field.type === "email" ? "email" : field.type === "number" ? "number" : "text"}
          placeholder={field.placeholder || ""}
          value={(formData[field.name] as string) || ""}
          onChange={(e) => handleFieldChange(field.name, e.target.value)}
          className={`transition-all duration-200 focus:ring-2 focus:ring-primary/20 ${
            fieldErrors[field.name] ? "border-destructive ring-2 ring-destructive/20" : ""
          }`}
        />
        {fieldErrors[field.name] && (
          <p className="text-xs text-destructive">{fieldErrors[field.name]}</p>
        )}
      </motion.div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/30">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando servicio...</p>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/30">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">Servicio no encontrado</p>
          <Button onClick={() => navigate("/")} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al inicio
          </Button>
        </div>
      </div>
    );
  }

  const sortedFields = [...service.formSchema.fields].sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-6 hover:bg-primary/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a servicios
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-2 shadow-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b">
              <CardTitle className="text-2xl md:text-3xl">{service.name}</CardTitle>
              <CardDescription className="text-base mt-2">
                {service.description}
              </CardDescription>
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 w-fit">
                <span className="text-lg font-bold text-primary">{service.formattedPrice}</span>
              </div>
            </CardHeader>

            <CardContent className="p-6 md:p-8">
              {isFileService ? (
                <div className="text-center py-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                    className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 mb-6"
                  >
                    <MessageCircle className="h-10 w-10 text-green-500" />
                  </motion.div>
                  
                  <h3 className="text-xl font-semibold mb-4">
                    Este servicio requiere envío de documentos
                  </h3>
                  
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Para completar este servicio necesitamos que nos envíes documentos.
                    Por tu seguridad, este proceso se realiza vía WhatsApp.
                  </p>

                  <div className="bg-muted/50 rounded-lg p-4 mb-6 max-w-md mx-auto">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Disponible 24/7 - Responde cuando puedas</span>
                    </div>
                  </div>

                  <Button
                    size="lg"
                    onClick={handleWhatsAppRedirect}
                    className="bg-green-500 hover:bg-green-600 text-white"
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Continuar por WhatsApp
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Error Alert */}
                  {apiError && (
                    <motion.div
                      ref={errorRef}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{apiError}</AlertDescription>
                      </Alert>
                    </motion.div>
                  )}

                  {/* Contact Information */}
                  <div className="space-y-4 pb-6 border-b">
                    <h3 className="font-semibold text-lg">Información de contacto</h3>
                    
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="applicantName">Nombre completo *</Label>
                        <Input
                          id="applicantName"
                          value={applicantName}
                          onChange={(e) => {
                            setApplicantName(e.target.value);
                            clearFieldError("applicantName");
                          }}
                          placeholder="Tu nombre completo"
                          className={fieldErrors.applicantName ? "border-destructive ring-2 ring-destructive/20" : ""}
                        />
                        {fieldErrors.applicantName && (
                          <p className="text-xs text-destructive">{fieldErrors.applicantName}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="applicantPhone">Teléfono *</Label>
                        <Input
                          id="applicantPhone"
                          type="tel"
                          value={applicantPhone}
                          onChange={(e) => {
                            setApplicantPhone(e.target.value);
                            clearFieldError("applicantPhone");
                          }}
                          placeholder="+52 55 1234 5678"
                          className={fieldErrors.applicantPhone ? "border-destructive ring-2 ring-destructive/20" : ""}
                        />
                        {fieldErrors.applicantPhone && (
                          <p className="text-xs text-destructive">{fieldErrors.applicantPhone}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="applicantEmail">Correo electrónico *</Label>
                      <Input
                        id="applicantEmail"
                        type="email"
                        value={applicantEmail}
                        onChange={(e) => {
                          setApplicantEmail(e.target.value);
                          clearFieldError("applicantEmail");
                        }}
                        placeholder="tu@email.com"
                        className={fieldErrors.applicantEmail ? "border-destructive ring-2 ring-destructive/20" : ""}
                      />
                      {fieldErrors.applicantEmail && (
                        <p className="text-xs text-destructive">{fieldErrors.applicantEmail}</p>
                      )}
                    </div>
                  </div>

                  {/* Advisor Information */}
                  <div className="space-y-4 pb-6 border-b">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">Información del asesor</h3>
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">Opcional</span>
                    </div>
                    <p className="text-sm text-muted-foreground -mt-2">
                      Si conoces la clave del asesor, ingrésala directamente. Si no, puedes proporcionar su nombre o teléfono.
                    </p>
                    
                    <div className="grid gap-4">
                      {/* Advisor ID - Primary option */}
                      <div className="space-y-2">
                        <Label htmlFor="advisorId" className="flex items-center gap-2">
                          <Hash className="h-4 w-4 text-primary" />
                          Clave de asesor
                        </Label>
                        <Input
                          id="advisorId"
                          value={advisorId}
                          onChange={(e) => {
                            setAdvisorId(e.target.value);
                            clearFieldError("advisorId");
                          }}
                          placeholder="Ej: 123"
                          className={fieldErrors.advisorId 
                            ? "border-destructive ring-2 ring-destructive/20" 
                            : advisorId ? "border-primary/50 bg-primary/5" : ""}
                        />
                        {fieldErrors.advisorId && (
                          <p className="text-xs text-destructive">{fieldErrors.advisorId}</p>
                        )}
                        {advisorId && !fieldErrors.advisorId && (
                          <p className="text-xs text-primary flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Con el ID del asesor es suficiente
                          </p>
                        )}
                      </div>

                      {/* Divider with "or" */}
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-dashed" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-card px-2 text-muted-foreground">o proporciona</span>
                        </div>
                      </div>

                      {/* Name and Phone - Alternative options */}
                      <div className={`grid gap-4 sm:grid-cols-2 transition-opacity duration-200 ${advisorId ? "opacity-50" : ""}`}>
                        <div className="space-y-2">
                          <Label htmlFor="advisorName" className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            Nombre del asesor
                          </Label>
                          <Input
                            id="advisorName"
                            value={advisorName}
                            onChange={(e) => {
                              setAdvisorName(e.target.value);
                              clearFieldError("advisorName");
                            }}
                            placeholder="Nombre completo"
                            disabled={!!advisorId}
                            className={fieldErrors.advisorName ? "border-destructive ring-2 ring-destructive/20" : ""}
                          />
                          {fieldErrors.advisorName && (
                            <p className="text-xs text-destructive">{fieldErrors.advisorName}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="advisorPhone" className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            Teléfono del asesor
                          </Label>
                          <Input
                            id="advisorPhone"
                            type="tel"
                            value={advisorPhone}
                            onChange={(e) => {
                              setAdvisorPhone(e.target.value);
                              clearFieldError("advisorPhone");
                            }}
                            placeholder="+52 55 9876 5432"
                            disabled={!!advisorId}
                            className={fieldErrors.advisorPhone ? "border-destructive ring-2 ring-destructive/20" : ""}
                          />
                          {fieldErrors.advisorPhone && (
                            <p className="text-xs text-destructive">{fieldErrors.advisorPhone}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Applicant Details (Fiscal/Billing Info) - Only if requiresApplicantDetails */}
                  {service.requiresApplicantDetails && (
                    <div className="space-y-4 pb-6 border-b">
                      <h3 className="font-semibold text-lg">
                        Datos fiscales {service.targetPersonType === "moral" ? "(Persona Moral)" : "(Persona Física)"}
                      </h3>
                      
                      {/* Legal Representative - only for moral */}
                      {service.targetPersonType === "moral" && (
                        <div className="space-y-2">
                          <Label htmlFor="applicantLegalRepresentative">Representante legal *</Label>
                          <Input
                            id="applicantLegalRepresentative"
                            value={applicantLegalRepresentative}
                            onChange={(e) => {
                              setApplicantLegalRepresentative(e.target.value);
                              clearFieldError("applicantLegalRepresentative");
                            }}
                            placeholder="Nombre del representante legal"
                            className={fieldErrors.applicantLegalRepresentative ? "border-destructive ring-2 ring-destructive/20" : ""}
                          />
                          {fieldErrors.applicantLegalRepresentative && (
                            <p className="text-xs text-destructive">{fieldErrors.applicantLegalRepresentative}</p>
                          )}
                        </div>
                      )}

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="applicantRFC">RFC *</Label>
                          <Input
                            id="applicantRFC"
                            value={applicantRFC}
                            onChange={(e) => {
                              setApplicantRFC(e.target.value.toUpperCase());
                              clearFieldError("applicantRFC");
                            }}
                            placeholder="XAXX010101000"
                            maxLength={13}
                            className={fieldErrors.applicantRFC ? "border-destructive ring-2 ring-destructive/20" : ""}
                          />
                          {fieldErrors.applicantRFC && (
                            <p className="text-xs text-destructive">{fieldErrors.applicantRFC}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="applicantZipCode">Código postal *</Label>
                          <Input
                            id="applicantZipCode"
                            value={applicantZipCode}
                            onChange={(e) => {
                              setApplicantZipCode(e.target.value);
                              clearFieldError("applicantZipCode");
                            }}
                            placeholder="12345"
                            maxLength={5}
                            className={fieldErrors.applicantZipCode ? "border-destructive ring-2 ring-destructive/20" : ""}
                          />
                          {fieldErrors.applicantZipCode && (
                            <p className="text-xs text-destructive">{fieldErrors.applicantZipCode}</p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="applicantStreet">Calle y número *</Label>
                        <Input
                          id="applicantStreet"
                          value={applicantStreet}
                          onChange={(e) => {
                            setApplicantStreet(e.target.value);
                            clearFieldError("applicantStreet");
                          }}
                          placeholder="Av. Reforma 123"
                          className={fieldErrors.applicantStreet ? "border-destructive ring-2 ring-destructive/20" : ""}
                        />
                        {fieldErrors.applicantStreet && (
                          <p className="text-xs text-destructive">{fieldErrors.applicantStreet}</p>
                        )}
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="applicantColony">Colonia *</Label>
                          <Input
                            id="applicantColony"
                            value={applicantColony}
                            onChange={(e) => {
                              setApplicantColony(e.target.value);
                              clearFieldError("applicantColony");
                            }}
                            placeholder="Centro"
                            className={fieldErrors.applicantColony ? "border-destructive ring-2 ring-destructive/20" : ""}
                          />
                          {fieldErrors.applicantColony && (
                            <p className="text-xs text-destructive">{fieldErrors.applicantColony}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="applicantMunicipality">Municipio/Alcaldía *</Label>
                          <Input
                            id="applicantMunicipality"
                            value={applicantMunicipality}
                            onChange={(e) => {
                              setApplicantMunicipality(e.target.value);
                              clearFieldError("applicantMunicipality");
                            }}
                            placeholder="Cuauhtémoc"
                            className={fieldErrors.applicantMunicipality ? "border-destructive ring-2 ring-destructive/20" : ""}
                          />
                          {fieldErrors.applicantMunicipality && (
                            <p className="text-xs text-destructive">{fieldErrors.applicantMunicipality}</p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="applicantState">Estado *</Label>
                        <Input
                          id="applicantState"
                          value={applicantState}
                          onChange={(e) => {
                            setApplicantState(e.target.value);
                            clearFieldError("applicantState");
                          }}
                          placeholder="Ciudad de México"
                          className={fieldErrors.applicantState ? "border-destructive ring-2 ring-destructive/20" : ""}
                        />
                        {fieldErrors.applicantState && (
                          <p className="text-xs text-destructive">{fieldErrors.applicantState}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Dynamic Form Fields */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Información del servicio</h3>
                    {sortedFields.map(renderField)}
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      <>
                        Continuar al pago - {service.formattedPrice}
                      </>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
