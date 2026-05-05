import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, Download, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useRef, useState, useEffect } from "react";

const courses = [
  {
    title: "Por qué precalificar a un prospecto a inquilino",
    description: "Aprende a identificar y evaluar prospectos a inquilinos con herramientas prácticas para tomar decisiones informadas.",
    pdfUrl: "/courses/por-que-precalificar.pdf",
  },
  {
    title: "Cómo realizar una estimación de valor en inmueble en renta",
    description: "Domina los métodos de estimación de valor en propiedades de renta con ejemplos prácticos y herramientas de análisis.",
    pdfUrl: "/courses/estimacion-valor.pdf",
  },
  {
    title: "Como evitar fraudes inmobiliarios",
    description: "Identifica y previene fraudes inmobiliarios con estrategias prácticas y conocimiento legal aplicable en México.",
    pdfUrl: "/courses/evitar-fraudes.pdf",
  },
  {
    title: "El ROI en Inversión de Inmuebles en Arrendamiento",
    description: "Aprende a calcular y evaluar el ROI en inversiones inmobiliarias de arrendamiento para tomar decisiones financieras informadas.",
    pdfUrl: "/courses/roi-inmuebles.pdf",
  },
  {
    title: "Cumplimiento de la Ley Antilavado de Dinero",
    description: "Conoce los requisitos legales y mejores prácticas para cumplir con la ley antilavado de dinero en rentas inmobiliarias.",
    pdfUrl: "/courses/ley-antilavado.pdf",
  },
];

export function Courses() {
  const autoplayPlugin = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!carouselApi) return;

    setCurrent(carouselApi.selectedScrollSnap());

    carouselApi.on("select", () => {
      setCurrent(carouselApi.selectedScrollSnap());
    });
  }, [carouselApi]);

  const scrollToSlide = (index: number) => {
    carouselApi?.scrollTo(index);
  };

  return (
    <section id="courses" className="min-h-screen py-12 bg-gradient-to-b from-muted/30 to-muted/60 relative overflow-hidden flex flex-col justify-center">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.8, type: "spring", stiffness: 80 }}
          className="text-center mb-10"
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mb-6"
          >
            <GraduationCap className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary">Capacitación Profesional</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="text-4xl md:text-6xl font-heading font-bold mb-6 pb-2 leading-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
          >
            Nuestros Cursos
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Capacitación profesional para propietarios y administradores de propiedades
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="relative"
        >
          <Carousel
            opts={{
              align: "center",
              loop: true,
            }}
            plugins={[autoplayPlugin.current]}
            setApi={setCarouselApi}
            className="w-full max-w-6xl mx-auto"
            onMouseEnter={() => autoplayPlugin.current.stop()}
            onMouseLeave={() => autoplayPlugin.current.play()}
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {courses.map((course, index) => (
                <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.1,
                      ease: "easeOut"
                    }}
                    className="h-full p-1"
                  >
                    <Card className="h-full group relative overflow-hidden border-2 hover:border-primary/30 transition-all duration-500 flex flex-col bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-sm shadow-xl hover:shadow-2xl hover:scale-[1.02]">
                      {/* Gradient overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                      <CardHeader className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                          <motion.div
                            className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 ring-2 ring-primary/10 group-hover:ring-primary/30 transition-all duration-300"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                          >
                            <GraduationCap className="h-7 w-7 text-primary" />
                          </motion.div>
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-primary/30 group-hover:bg-primary transition-colors"></div>
                            <div className="w-2 h-2 rounded-full bg-primary/20 group-hover:bg-primary/70 transition-colors"></div>
                            <div className="w-2 h-2 rounded-full bg-primary/10 group-hover:bg-primary/40 transition-colors"></div>
                          </div>
                        </div>
                        <CardTitle className="text-xl mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-300">
                          {course.title}
                        </CardTitle>
                        <CardDescription className="text-sm leading-relaxed line-clamp-3">
                          {course.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="mt-auto relative z-10">
                        <Button
                          className="w-full group/btn relative overflow-hidden bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300"
                          asChild
                        >
                          <a href={course.pdfUrl} download>
                            <span className="relative z-10 flex items-center justify-center gap-2">
                              <Download className="h-4 w-4 group-hover/btn:animate-bounce" />
                              Obtener Curso
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-primary-foreground/10 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Custom styled navigation buttons */}
            <CarouselPrevious className="hidden md:flex left-[-50px] h-12 w-12 border-2 border-primary/20 bg-background/80 backdrop-blur-sm hover:bg-primary hover:border-primary shadow-lg hover:shadow-xl transition-all duration-300" />
            <CarouselNext className="hidden md:flex right-[-50px] h-12 w-12 border-2 border-primary/20 bg-background/80 backdrop-blur-sm hover:bg-primary hover:border-primary shadow-lg hover:shadow-xl transition-all duration-300" />
          </Carousel>

          {/* Interactive progress indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false }}
            className="flex justify-center gap-2 mt-8"
          >
            {courses.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToSlide(index)}
                className={`h-1.5 w-12 rounded-full transition-all duration-500 hover:scale-110 ${current === index
                  ? "bg-primary w-16 shadow-lg shadow-primary/50"
                  : "bg-primary/20 hover:bg-primary/40"
                  }`}
                aria-label={`Ir al curso ${index + 1}`}
              ></button>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
