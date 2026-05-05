import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, MessageCircle, Facebook, Headset } from "lucide-react";

export function Contact() {
  const contactInfo = [
    {
      icon: MessageCircle,
      title: "WhatsApp",
      content: "+52 961 316 8341",
      subtitle: "Disponible para consultas",
      link: "https://wa.me/529613168341",
      delay: 0.1
    },
    {
      icon: Mail,
      title: "Correo Electrónico",
      content: "gerenciageneral@rentasok.com",
      subtitle: "Respuesta en 24 horas",
      link: "mailto:gerenciageneral@rentasok.com",
      delay: 0.2
    },
    {
      icon: Phone,
      title: "Teléfono",
      content: "+52 961 316 8341",
      subtitle: "Lunes a Viernes: 9:00 - 18:00",
      link: "tel:+529613168341",
      delay: 0.3
    },
    {
      icon: Facebook,
      title: "Facebook",
      content: "@precalificaciondeinquilinos",
      subtitle: "Síguenos en redes sociales",
      link: "https://www.facebook.com/precalificaciondeinquilinos",
      delay: 0.4
    },
    {
      icon: MapPin,
      title: "Ubicación",
      content: "Servicios Inmobiliarios Jucerama SA de CV",
      subtitle: "Ciudad de México, México",
      link: null,
      delay: 0.5
    }
  ];

  return (
    <section id="contact" className="min-h-screen py-12 bg-gradient-to-b from-background to-muted/30 relative overflow-hidden flex flex-col justify-center">
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
            <Headset className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary">Atención al Cliente</span>
          </motion.div>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="text-4xl md:text-6xl font-heading font-bold mb-6 pb-2 leading-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
          >
            Contáctanos
          </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            ¿Tienes preguntas? Nuestro equipo está listo para ayudarte
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {contactInfo.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ 
                  opacity: 0, 
                  x: index % 3 === 0 ? -60 : index % 3 === 1 ? 0 : 60,
                  y: index % 3 === 1 ? 60 : 30
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
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="pt-8 pb-8 text-center">
                    <div className="flex justify-center mb-6">
                      <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon className="h-10 w-10 text-primary" />
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-primary mb-3">
                      {item.title}
                    </h3>
                    
                    {item.link ? (
                      <a
                        href={item.link}
                        target={item.link.startsWith('http') ? '_blank' : undefined}
                        rel={item.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="block text-foreground hover:text-primary transition-colors mb-2 font-medium"
                      >
                        {item.content}
                      </a>
                    ) : (
                      <p className="text-foreground mb-2 font-medium">
                        {item.content}
                      </p>
                    )}
                    
                    <p className="text-sm text-muted-foreground">
                      {item.subtitle}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
