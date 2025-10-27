import {
  Mail,
  MapPin,
  Linkedin,
  Briefcase,
  GraduationCap,
  Code2,
  Calendar,
  ExternalLink,
} from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CONTACT_INFO,
  EDUCATION,
  EXPERIENCES,
  SKILLS,
} from "@/utils/constants";

/**
 * About view component
 * @returns {JSX.Element} About view component
 */
export const AboutView: React.FC = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header Card */}
        <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-slate-900 to-slate-700 p-8 text-white shadow-xl">
          <div className="absolute top-0 right-0 h-40 w-40 translate-x-10 -translate-y-10 rounded-full bg-white/10" />
          <div className="absolute bottom-0 left-0 h-32 w-32 -translate-x-10 translate-y-10 rounded-full bg-white/10" />

          <div className="relative flex flex-col items-center gap-6 md:flex-row md:items-start">
            <div className="flex size-32 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm ring-4 ring-white/20">
              <span className="text-5xl font-bold">SE</span>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="mb-2 text-4xl font-bold tracking-tight">
                Sergio Eduardo Erazo Ortega
              </h1>
              <p className="mb-4 text-xl text-slate-200">
                Desarrollador Web Frontend
              </p>
              <p className="max-w-3xl text-slate-300 leading-relaxed">
                Dos años de experiencia como Desarrollador Web Frontend con
                Angular. Actualmente desarrollador Frontend en el proyecto EPS
                de la unidad de salud de la universidad del Cauca, enfocado en
                construir una plataforma segura, escalable e interoperable con
                otros sistemas de salud.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Info Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CONTACT_INFO.map((contact, index) => {
            const Icon = contact.icon;
            const content = (
              <div className="flex items-start gap-3 rounded-xl bg-white p-4 shadow-md transition-all hover:shadow-lg">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                  <Icon className="size-5 text-slate-700" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-slate-500">
                    {contact.label}
                  </p>
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {contact.value}
                  </p>
                </div>
                {contact.link && (
                  <ExternalLink className="size-4 shrink-0 text-slate-400" />
                )}
              </div>
            );

            return contact.link ? (
              <a
                key={index}
                href={contact.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block transition-transform hover:scale-105"
              >
                {content}
              </a>
            ) : (
              <div key={index}>{content}</div>
            );
          })}
        </div>

        {/* Experience Section */}
        <div className="rounded-2xl bg-white p-8 shadow-lg">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-xl bg-slate-900 text-white">
              <Briefcase className="size-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              Experiencia Profesional
            </h2>
          </div>

          <div className="space-y-8">
            {EXPERIENCES.map((exp, index) => (
              <div key={index} className="relative pl-8 pb-8 last:pb-0">
                {/* Timeline line */}
                {index !== EXPERIENCES.length - 1 && (
                  <div className="absolute left-[7px] top-8 bottom-0 w-0.5 bg-slate-200" />
                )}

                {/* Timeline dot */}
                <div className="absolute left-0 top-1.5 size-4 rounded-full bg-slate-900 ring-4 ring-slate-100" />

                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {exp.title}
                    </h3>
                    <p className="font-semibold text-slate-700">
                      {exp.company}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="size-4" />
                        {exp.period}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="size-4" />
                        {exp.location}
                      </span>
                    </div>
                  </div>

                  <ul className="space-y-2">
                    {exp.description.map((desc, i) => (
                      <li key={i} className="flex gap-2 text-sm text-slate-600">
                        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-slate-400" />
                        <span>{desc}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-2">
                    {exp.stack.map((tech, i) => (
                      <Badge
                        key={i}
                        variant="secondary"
                        className="bg-slate-100 text-slate-700 hover:bg-slate-200"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Education & Skills Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Education Section */}
          <div className="rounded-2xl bg-white p-8 shadow-lg">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-xl bg-slate-900 text-white">
                <GraduationCap className="size-6" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Educación</h2>
            </div>

            <div className="space-y-6">
              {EDUCATION.map((edu, index) => (
                <div key={index} className="space-y-2">
                  <h3 className="font-bold text-slate-900">{edu.degree}</h3>
                  <p className="font-semibold text-slate-700">
                    {edu.institution}
                  </p>
                  <p className="text-sm text-slate-500">{edu.location}</p>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        edu.status === "Completado" ? "default" : "secondary"
                      }
                      className={
                        edu.status === "Completado"
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                      }
                    >
                      {edu.status}
                    </Badge>
                    {edu.period && (
                      <span className="text-xs text-slate-500">
                        {edu.period}
                      </span>
                    )}
                  </div>
                  {index !== EDUCATION.length - 1 && (
                    <Separator className="mt-4" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Skills Section */}
          <div className="rounded-2xl bg-white p-8 shadow-lg">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-xl bg-slate-900 text-white">
                <Code2 className="size-6" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                Skills & Tecnologías
              </h2>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-slate-600">
                Experiencia en entornos y tecnologías como:
              </p>
              <div className="flex flex-wrap gap-2">
                {SKILLS.map((skill, index) => (
                  <Badge
                    key={index}
                    className="bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="rounded-2xl bg-linear-to-r from-slate-900 to-slate-700 p-6 text-center text-white shadow-lg">
          <p className="mb-4 text-sm text-slate-300">
            ¿Interesado en colaborar o necesitas más información?
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              asChild
              className="bg-white text-slate-900 hover:bg-white border-0 shadow-md"
            >
              <a href="mailto:erazosergio2@gmail.com">
                <Mail className="mr-2 size-4" />
                Enviar Email
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:border-white/50"
            >
              <a
                href="https://linkedin.com/in/sergioerazoortega"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="mr-2 size-4" />
                Ver LinkedIn
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
