import {
  Building2,
  CalendarCheck,
  History,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Shield,
  Users,
  Zap,
} from "lucide-react";

/**
 * Constants for the routes titles
 */
export const ROUTE_TITLES = {
  "/dashboard/gestion-de-visitas": "Gestión de visitas",
  "/dashboard/gestion-de-areas": "Gestión de áreas",
  "/dashboard/gestion-de-usuarios": "Gestión de usuarios",
  "/dashboard/historial-de-cambios": "Historial de cambios",
  "/dashboard/acerca-de": "Acerca de",
};

/**
 * Constants for the contact information
 */
export const CONTACT_INFO = [
  {
    icon: MapPin,
    label: "Ubicación",
    value: "Popayán, Colombia",
    link: null,
  },
  {
    icon: Mail,
    label: "Email",
    value: "erazosergio2@gmail.com",
    link: "mailto:erazosergio2@gmail.com",
  },
  {
    icon: Phone,
    label: "Teléfono",
    value: "+57 315 307 7932",
    link: "tel:+573153077932",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: "sergioerazoortega",
    link: "https://linkedin.com/in/sergioerazoortega",
  },
];

export const EXPERIENCES = [
  {
    title: "Desarrollador Frontend",
    company: "Universidad del Cauca – EPS Unidad de Salud",
    location: "Popayán, Colombia",
    period: "Julio 2023 – Presente",
    description: [
      "Estructuré la arquitectura del sistema Front-End, implementando prácticas de desarrollo escalables y mantenibles, mejorando la modularidad y la coherencia del sistema.",
      "Diseñé y desarrollé componentes reutilizables y funcionalidades a medida, mejorando la eficiencia del desarrollo y asegurando la coherencia de la UI en toda la plataforma.",
      "Colaboré con el diseñador UX/UI brindando soporte en la implementación de diseños y asegurando que los requisitos del usuario fueran reflejados adecuadamente en la interfaz de usuario.",
      "Colaboré con otros miembros del equipo en la integración de avances de desarrollo, asegurando la correcta integración y funcionamiento del sistema mediante revisiones de código y pruebas de integración.",
    ],
    stack: ["TypeScript", "Angular", "HTML", "CSS", "Bootstrap"],
  },
  {
    title: "Desarrollador Frontend",
    company:
      "Universidad del Cauca – Centro de Educación Continúa Abierta y Virtual",
    location: "Popayán, Colombia",
    period: "Abril 2022 – Junio 2023",
    description: [
      "Colaboré en el desarrollo e implementación de un sistema web utilizando Laravel, Blade, HTML, CSS, y Bootstrap, siguiendo los requisitos del proyecto.",
      "Implementé los diseños de la interfaz de usuario, asegurando que los requisitos visuales y funcionales establecidos fueran reflejados de forma precisa.",
    ],
    stack: ["Laravel", "Blade", "HTML", "CSS", "Bootstrap"],
  },
  {
    title: "Desarrollador Frontend",
    company: "Freelance",
    location: "Popayán, Colombia",
    period: "Mayo 2021 – Noviembre 2022",
    description: [
      "Desarrollé y optimicé Landing Pages personalizadas para empresas utilizando Angular, HTML, CSS, y TypeScript, asegurando un diseño interactivo y adaptable a las necesidades comerciales del cliente.",
    ],
    stack: ["Angular", "TypeScript", "HTML", "CSS"],
  },
];

export const EDUCATION = [
  {
    degree: "Ingeniería de Sistemas",
    institution: "Universidad del Cauca",
    location: "Presencial - Colombia",
    status: "En curso - Trabajo de grado",
    period: null,
  },
  {
    degree: "Técnico de Sistemas",
    institution: "Servicio Nacional de Aprendizaje - SENA",
    location: "Presencial - Colombia",
    status: "Completado",
    period: "Enero 2016 – Noviembre 2016",
  },
];

export const SKILLS = [
  "TypeScript",
  "Angular",
  "React",
  "HTML",
  "CSS",
  "Bootstrap",
  "PrimeNG",
  "Laravel",
  "Git",
  "Scrum",
  "Kanban",
];

/**
 * Constants for translations
 */
export const ACTION_TRANSLATIONS: Record<string, string> = {
  CREATE: "Creación",
  INSERT: "Creación",
  ASSIGN: "Asignación",
  REASSIGN: "Reasignación",
  EDIT: "Edición",
  UPDATE: "Actualización",
  CANCEL: "Cancelación",
  EXECUTE: "Completado",
  COMPLETE: "Completado",
  DELETE: "Eliminación",
};

export const STATUS_TRANSLATIONS: Record<string, string> = {
  SCHEDULED: "Programada",
  IN_PROGRESS: "En Progreso",
  COMPLETED: "Completada",
  CANCELLED: "Cancelada",
};

export const VISIT_TYPE_TRANSLATIONS: Record<string, string> = {
  BUSINESS: "Empresarial",
  INDIVIDUAL: "Individual",
};

/**
 * Constants for badge configurations
 */
export const ACTION_BADGE_CONFIG: Record<
  string,
  {
    variant: "default" | "secondary" | "outline" | "destructive";
    color: string;
  }
> = {
  CREATE: {
    variant: "default",
    color: "bg-green-100 text-green-800 border-green-300",
  },
  INSERT: {
    variant: "default",
    color: "bg-green-100 text-green-800 border-green-300",
  },
  ASSIGN: {
    variant: "secondary",
    color: "bg-blue-100 text-blue-800 border-blue-300",
  },
  REASSIGN: {
    variant: "secondary",
    color: "bg-purple-100 text-purple-800 border-purple-300",
  },
  EDIT: {
    variant: "secondary",
    color: "bg-blue-100 text-blue-800 border-blue-300",
  },
  UPDATE: {
    variant: "secondary",
    color: "bg-blue-100 text-blue-800 border-blue-300",
  },
  CANCEL: {
    variant: "destructive",
    color: "bg-orange-100 text-orange-800 border-orange-300",
  },
  EXECUTE: {
    variant: "default",
    color: "bg-green-100 text-green-800 border-green-300",
  },
  COMPLETE: {
    variant: "default",
    color: "bg-green-100 text-green-800 border-green-300",
  },
  DELETE: {
    variant: "destructive",
    color: "bg-red-100 text-red-800 border-red-300",
  },
};

export const STATUS_BADGE_CONFIG: Record<
  string,
  {
    variant: "default" | "secondary" | "outline" | "destructive";
    className?: string;
  }
> = {
  SCHEDULED: {
    variant: "default",
    className: "bg-blue-100 text-blue-800 border-blue-300",
  },
  IN_PROGRESS: {
    variant: "secondary",
    className: "bg-yellow-100 text-yellow-800 border-yellow-300",
  },
  COMPLETED: {
    variant: "default",
    className: "bg-green-100 text-green-800 border-green-300",
  },
  CANCELLED: {
    variant: "destructive",
    className: "bg-red-100 text-red-800 border-red-300",
  },
};

/**
 * Landing page constants
 */

export const FEATURES = [
  {
    icon: CalendarCheck,
    title: "Gestión de Visitas",
    description:
      "Programa, ejecuta y realiza seguimiento de visitas de forma eficiente y organizada.",
  },
  {
    icon: Users,
    title: "Gestión de Usuarios",
    description:
      "Administra perfiles de usuarios con roles personalizados (Admin, Jefes, Asesores).",
  },
  {
    icon: Building2,
    title: "Gestión de Áreas",
    description:
      "Organiza y estructura las diferentes áreas de trabajo de tu organización.",
  },
  {
    icon: History,
    title: "Historial de Cambios",
    description:
      "Mantén un registro detallado de todas las modificaciones y auditorías del sistema.",
  },
  {
    icon: Shield,
    title: "Seguridad Avanzada",
    description:
      "Autenticación robusta con verificación OTP y gestión de sesiones seguras.",
  },
  {
    icon: Zap,
    title: "Interfaz Moderna",
    description:
      "Diseño responsive y experiencia de usuario optimizada para máxima productividad.",
  },
];

export const TECHNOLOGIES = [
  {
    name: "React 19",
    description: "Framework frontend moderno",
    color: "from-cyan-500 to-blue-500",
  },
  {
    name: "TypeScript",
    description: "Tipado estático robusto",
    color: "from-blue-600 to-blue-700",
  },
  {
    name: "Tailwind CSS",
    description: "Diseño utility-first",
    color: "from-sky-400 to-cyan-500",
  },
  {
    name: "Vite",
    description: "Build tool ultra-rápido",
    color: "from-purple-500 to-purple-600",
  },
  {
    name: "React Router",
    description: "Navegación optimizada",
    color: "from-red-500 to-pink-500",
  },
  {
    name: "Shad Cn",
    description: "Componentes accesibles",
    color: "from-slate-700 to-slate-800",
  },
];
