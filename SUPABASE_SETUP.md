# Configuración de Supabase

## Variables de Entorno

Para usar Supabase en tu proyecto, necesitas crear un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```env
VITE_SUPABASE_URL=https://xvdzjwavpnrgzlcpqyoe.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2ZHpqd2F2cG5yZ3psY3BxeW9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwODM1NDcsImV4cCI6MjA3NjY1OTU0N30.xjmUL0cI_4wEwzBiAZhngEpXuNSJJnQ7Clr3RHAfLbU
```

## Archivos Creados

1. **`src/lib/supabase.ts`** - Cliente de Supabase configurado
2. **`src/hooks/use-supabase.ts`** - Hook personalizado para manejar autenticación
3. **`src/types/supabase.ts`** - Tipos de TypeScript para la base de datos
4. **`src/views/auth-view.tsx`** - Vista de autenticación actualizada

## Funcionalidades Implementadas

- ✅ Cliente de Supabase configurado
- ✅ Hook de autenticación con estado de usuario
- ✅ Vista de login con Google OAuth
- ✅ Manejo de sesiones
- ✅ Cierre de sesión
- ✅ Redirección automática al dashboard

## Uso

```typescript
import { useSupabase } from '../hooks/use-supabase';

function MiComponente() {
  const { supabase, user, session, loading } = useSupabase();
  
  // Usar supabase para operaciones de base de datos
  // user contiene la información del usuario autenticado
  // loading indica si está cargando la sesión
}
```

## Configuración de Google OAuth

Para que funcione el inicio de sesión con Google, necesitas configurar OAuth en tu proyecto de Supabase:

1. Ve a tu proyecto de Supabase Dashboard
2. Navega a Authentication > Providers
3. Habilita Google como proveedor
4. Configura las credenciales de Google OAuth:
   - Client ID
   - Client Secret
5. Agrega tu dominio a la lista de URLs permitidas

## Próximos Pasos

1. Crear el archivo `.env.local` con las variables de entorno
2. Configurar Google OAuth en Supabase
3. Configurar las tablas en tu proyecto de Supabase
4. Actualizar los tipos en `src/types/supabase.ts` según tu esquema
5. Implementar las operaciones CRUD específicas de tu aplicación
