import { Link } from "react-router";
import { Zap, ArrowRight, CheckCircle2 } from "lucide-react";

import { FEATURES, TECHNOLOGIES } from "@/utils/constants";
import { PublicHeader } from "@/components/public-header";
import { PublicFooter } from "@/components/public-footer";
import { Button } from "@/components/ui/button";

/**
 * Landing view component
 * @returns {JSX.Element} Landing view component
 */
export const LandingView: React.FC = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-slate-100">
      <PublicHeader
        actions={
          <Button asChild size="lg">
            <Link to="/login">
              Iniciar Sesión
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        }
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-slate-900 to-slate-700">
          <div className="absolute top-0 right-0 h-96 w-96 translate-x-32 -translate-y-32 rounded-full bg-white/10" />
          <div className="absolute bottom-0 left-0 h-80 w-80 -translate-x-32 translate-y-32 rounded-full bg-white/10" />
        </div>

        <div className="container relative mx-auto px-6 py-24 md:py-32">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-4 py-2 text-sm border border-white/20">
              <Zap className="size-4 text-yellow-300" />
              <span>Versión 1.0 - Sistema en Producción</span>
            </div>

            <h1 className="mb-6 text-5xl md:text-7xl font-bold tracking-tight">
              Sistema de Gestión
              <span className="block mt-2 bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                de Visitas
              </span>
            </h1>

            <p className="mb-8 text-xl text-slate-200 leading-relaxed max-w-2xl mx-auto">
              Plataforma integral para la administración eficiente de visitas,
              usuarios y áreas organizacionales.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="bg-white text-slate-900 hover:bg-white/90 shadow-xl"
              >
                <Link to="/login">
                  Acceder al Sistema
                  <ArrowRight className="ml-2 size-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-slate-900">
              Funcionalidades Principales
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Todo lo que necesitas para gestionar eficientemente las
              operaciones de tu organización
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-2xl border-2 border-slate-200 bg-white p-8 transition-all hover:border-slate-800 hover:shadow-xl"
                >
                  <div className="mb-4 inline-flex size-14 items-center justify-center rounded-xl bg-slate-100 text-slate-800 transition-all group-hover:bg-slate-800 group-hover:text-white">
                    <Icon className="size-7" />
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-slate-900">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="absolute bottom-0 left-0 h-1 w-0 bg-slate-800 transition-all duration-300 group-hover:w-full" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-slate-900">
              Tecnologías Modernas
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Construido con las mejores herramientas para garantizar
              rendimiento y escalabilidad
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {TECHNOLOGIES.map((tech, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-md transition-all hover:shadow-xl"
              >
                <div
                  className={`absolute inset-0 bg-linear-to-br ${tech.color} opacity-0 transition-opacity group-hover:opacity-10`}
                />
                <div className="relative">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-900">
                      {tech.name}
                    </h3>
                    <CheckCircle2 className="size-5 text-green-500" />
                  </div>
                  <p className="text-sm text-slate-600">{tech.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-linear-to-r from-slate-900 to-slate-700 py-20">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 h-96 w-96 -translate-y-1/2 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 h-96 w-96 translate-y-1/2 rounded-full bg-cyan-500/20 blur-3xl" />
        </div>

        <div className="container relative mx-auto px-6 text-center">
          <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">
            ¿Listo para comenzar?
          </h2>
          <p className="mb-8 text-xl text-slate-200 max-w-2xl mx-auto">
            Accede al sistema y comienza a gestionar tus visitas
          </p>
          <Button
            asChild
            size="lg"
            className="bg-white text-slate-900 hover:bg-white/90 shadow-xl"
          >
            <Link to="/login">
              Iniciar Sesión Ahora
              <ArrowRight className="ml-2 size-5" />
            </Link>
          </Button>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};
