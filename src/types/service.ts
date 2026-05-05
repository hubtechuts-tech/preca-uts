export interface FormField {
  id: string;
  name: string;
  label: string;
  type: "text" | "tel" | "email" | "number" | "boolean" | "file";
  required: boolean;
  placeholder?: string;
  order: number;
}

export interface FormSchema {
  version: string;
  fields: FormField[];
}

export interface Service {
  id: number;
  name: string;
  description: string;
  priceMxn: number;
  formattedPrice: string;
  formSchema: FormSchema;
  requiresApplicantDetails?: boolean;
  targetPersonType?: "physical" | "moral";
}

export interface ApplicantDetails {
  applicantPersonType: "physical" | "moral";
  applicantLegalRepresentative?: string;
  applicantRFC: string;
  applicantStreet: string;
  applicantColony: string;
  applicantMunicipality: string;
  applicantState: string;
  applicantZipCode: string;
}

export interface ScreeningRequest {
  serviceId: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  advisorId?: string;
  advisorName?: string;
  advisorPhone?: string;
  formData: Record<string, string | boolean>;
  // Applicant details fields (only when requiresApplicantDetails is true)
  applicantPersonType?: "physical" | "moral";
  applicantLegalRepresentative?: string;
  applicantRFC?: string;
  applicantStreet?: string;
  applicantColony?: string;
  applicantMunicipality?: string;
  applicantState?: string;
  applicantZipCode?: string;
}

export interface ScreeningResponse {
  paymentLinkUrl: string;
}
