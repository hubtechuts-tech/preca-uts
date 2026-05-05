import { Footer7 } from "@/components/ui/footer-7";
import { FaWhatsapp, FaFacebook } from "react-icons/fa";

export function Footer() {
  return (
    <Footer7
      socialLinks={[
        {
          icon: <FaWhatsapp className="size-5" />,
          href: "https://wa.me/529613168341",
          label: "WhatsApp",
        },
        {
          icon: <FaFacebook className="size-5" />,
          href: "https://www.facebook.com/precalificaciondeinquilinos",
          label: "Facebook",
        },
      ]}
      copyright="© 2025 Preca - Servicios Inmobiliarios Jucerama SA de CV. Todos los derechos reservados."
    />
  );
}
