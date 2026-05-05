import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import {
  CustomAccordion,
  CustomAccordionItem,
  CustomAccordionTrigger,
  CustomAccordionContent,
} from "@/components/ui/custom-accordion";

const faqs = [
  {
    question: "¿Cuánto tiempo tarda el proceso de precalificación?",
    answer:
      "Hemos optimizado nuestros procesos para ofrecer resultados en menos de 1 hora hábil para todos nuestros servicios: PRECA INE, PRECA PRO, PRECA COMPLETA y PRECA EXTRANJEROS.",
  },
  {
    question: "¿Qué documentos necesito para la precalificación?",
    answer:
      "Los documentos básicos incluyen INE vigente, comprobantes de ingresos (recibos de nómina o estados de cuenta), comprobante de domicilio y referencias personales. Dependiendo del servicio, pueden requerirse documentos adicionales.",
  },
  {
    question: "¿La precalificación afecta mi historial crediticio?",
    answer:
      "No, nuestro proceso de consulta no afecta tu score crediticio. Realizamos consultas suaves que no quedan registradas como solicitudes de crédito en el buró.",
  },
  {
    question: "¿Trabajan con extranjeros?",
    answer:
      "Sí, contamos con PRECA EXTRANJEROS, un servicio especializado para personas extranjeras con residencia en México. Validamos documentos migratorios y adaptamos el proceso según las circunstancias particulares.",
  },
  {
    question: "¿En qué ciudades tienen cobertura?",
    answer:
      "Tenemos cobertura nacional en toda la República Mexicana. Nuestro equipo de asesores certificados puede realizar verificaciones en cualquier estado del país.",
  },
  {
    question: "¿Qué incluye el reporte de precalificación?",
    answer:
      "El reporte incluye verificación de identidad, análisis crediticio, validación de referencias laborales y personales, y una recomendación final sobre la viabilidad del arrendamiento. Los reportes más completos incluyen análisis de capacidad de pago y seguimiento.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="min-h-screen py-12 bg-gradient-to-b from-muted/30 to-background relative overflow-hidden flex flex-col justify-center">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-10"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mb-6"
          >
            <BookOpen className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary">Información Esencial</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="text-4xl md:text-6xl font-heading font-bold mb-6 pb-2 leading-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
          >
            Preguntas Frecuentes
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Resolvemos las dudas más comunes sobre nuestros servicios
          </motion.p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <CustomAccordion
            type="single"
            collapsible
            className="space-y-6"
          >
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{
                  opacity: 0,
                  x: index % 2 === 0 ? -60 : 60,
                  y: 30
                }}
                whileInView={{
                  opacity: 1,
                  x: 0,
                  y: 0
                }}
                viewport={{ once: false, margin: "-50px" }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
              >
                <CustomAccordionItem value={`item-${index}`}>
                  <CustomAccordionTrigger>{faq.question}</CustomAccordionTrigger>
                  <CustomAccordionContent>{faq.answer}</CustomAccordionContent>
                </CustomAccordionItem>
              </motion.div>
            ))}
          </CustomAccordion>
        </div>
      </div>
    </section>
  );
}
