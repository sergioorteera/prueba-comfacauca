# Sistema de Gestión de Visitas - Comfacauca

Sistema web integral para la administración eficiente de visitas, usuarios y áreas organizacionales desarrollado como prueba técnica para **Comfacauca**.

## Descripción del Proyecto

Sistema que permite gestionar de manera organizada las visitas empresariales e individuales, con un sistema robusto de autenticación, roles de usuario y seguimiento completo de auditoría.

## Funcionalidades Principales

### Gestión de Visitas

- Programación de visitas empresariales e individuales
- Asignación y reasignación de visitas a asesores
- Seguimiento del estado de visitas (Programada, En Progreso, Completada, Cancelada)
- Ejecución y completado de visitas con registro de detalles
- Cancelación de visitas con justificación

### Gestión de Usuarios

- Administración completa de perfiles de usuario
- Sistema de roles jerárquicos:
  - **Admin**: Control total del sistema
  - **Jefe de Área**: Gestión de su área y asesores
  - **Asesor**: Ejecución de visitas asignadas
- Cambio dinámico de roles
- Asignación de usuarios a áreas específicas

### Gestión de Áreas

- Creación y organización de áreas de trabajo
- Asignación de jefes de área
- Visualización de usuarios por área
- Edición y eliminación de áreas

### Historial de Cambios

- Registro completo de auditoría
- Seguimiento detallado de todas las acciones del sistema
- Filtros por tipo de acción, usuario y fecha
- Visualización de cambios en tiempo real

### Seguridad y Autenticación

- Autenticación con Google (OAuth)
- Verificación OTP (One-Time Password) por correo electrónico
- Gestión segura de sesiones con Supabase
- Control de acceso basado en roles

### Interfaz Moderna

- Diseño responsive adaptado a todos los dispositivos
- Experiencia de usuario optimizada
- Componentes accesibles (Shad Cn = Componentes custom a mano)
- Tema moderno con Tailwind CSS

## Tecnologías Utilizadas

### Frontend

- **React 19** - Framework frontend moderno con React Server Components
- **TypeScript** - Tipado estático para mayor robustez
- **Vite** - Build tool ultra-rápido con HMR
- **Tailwind CSS 4** - Framework de estilos utility-first
- **ShadCn UI** - Componentes accesibles y sin estilos predefinidos

### Backend & Base de Datos

- **Supabase** - Backend as a Service (BaaS)
  - PostgreSQL para base de datos
  - Autenticación y gestión de usuarios
  - Row Level Security (RLS)
  - Real-time subscriptions

### Herramientas de Desarrollo

- **React Router 7** - Navegación y enrutamiento
- **TanStack Table** - Tablas con funcionalidades avanzadas
- **Lucide React** - Iconos modernos
- **ESLint** - Linting y calidad de código

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 18 o superior)
- **npm** (versión 9 o superior)
- **Git**

## Instalación y Configuración

### 1. Clonar el Repositorio

```bash
git clone https://github.com/sergioorteera/prueba-comfacauca.git
cd prueba-comfacauca
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

> **Nota**: Solicitame las credenciales de Supabase para correr en local

### 4. Levantar el Proyecto en Desarrollo

```bash
npm run dev
```

El proyecto estará disponible en: `http://localhost:5173`

## Scripts Disponibles

| Script            | Descripción                                         |
| ----------------- | --------------------------------------------------- |
| `npm run dev`     | Inicia el servidor de desarrollo con hot-reload     |
| `npm run build`   | Compila el proyecto para producción                 |
| `npm run preview` | Previsualiza la versión de producción localmente    |
| `npm run lint`    | Ejecuta ESLint para verificar la calidad del código |

## Estructura del Proyecto

```
prueba-comfacauca/
├── src/
│   ├── assets/          # Recursos estáticos (logos, imágenes)
│   ├── components/      # Componentes reutilizables
│   │   ├── layouts/     # Layouts de la aplicación
│   │   ├── modals/      # Modales del sistema
│   │   └── ui/          # Componentes UI base (Radix UI)
│   ├── hooks/           # Custom hooks de React
│   ├── lib/             # Utilidades y configuraciones
│   ├── routes/          # Configuración de rutas
│   ├── store/           # Gestión de estado (Context API)
│   ├── types/           # Tipos TypeScript
│   ├── utils/           # Funciones utilitarias
│   └── views/           # Vistas/páginas principales
├── dist/                # Build de producción
├── public/              # Archivos públicos estáticos
└── package.json         # Dependencias y scripts
```

## Roles y Permisos

### Admin

- Acceso completo al sistema
- Gestión de usuarios, áreas y visitas
- Visualización del historial de cambios

### Jefe de Área

- Gestión de su área asignada
- Creación y asignación de visitas
- Gestión de asesores de su área

### Asesor

- Visualización de visitas asignadas
- Ejecución de visitas
- Actualización del estado de visitas

## Despliegue

El proyecto está configurado para desplegarse en **Vercel**. El archivo `vercel.json` incluye la configuración necesaria para el correcto funcionamiento de las rutas.

### Desplegar en Vercel

```bash
# Instalar Vercel CLI
npm install -g vercel

# Desplegar
vercel
```

## Autor

**Sergio Eduardo Erazo Ortega**  
Desarrollador Web Frontend

### Contacto

- **Email**: [erazosergio2@gmail.com](mailto:erazosergio2@gmail.com)
- **LinkedIn**: [linkedin.com/in/sergioerazoortega](https://linkedin.com/in/sergioerazoortega)
- **Ubicación**: Popayán, Colombia
- **Teléfono**: +57 315 307 7932

### Experiencia

Dos años de experiencia como Desarrollador Web Frontend con Angular. Actualmente desarrollador Frontend en el proyecto EPS de la unidad de salud de la Universidad del Cauca, enfocado en construir plataformas seguras, escalables e interoperables. Sin problema para adaptarme a cualquier tecnología.

### Stack Técnico

TypeScript, Angular, React, HTML, CSS, Bootstrap, PrimeNG, Laravel, Git, Scrum, Kanban

## Licencia

Este proyecto fue desarrollado como prueba técnica para Comfacauca.
