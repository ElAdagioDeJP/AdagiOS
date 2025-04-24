# AdagiOS

AdagiOS nació de la pasión por entender cómo funcionan los sistemas operativos desde dentro y por traer esa experiencia tanto a dispositivos móviles como a escritorios. A través de dos ramas independientes —**MobileOS** y **DesktopOS**— exploramos interfaces, gestión de ventanas y la lógica interna que hace latir cada plataforma.


## 📂 Ramas del repositorio

- **main**  
  - Contiene el archivo `LICENSE` (MIT) y este `README.md`.  
  - Punto de entrada principal; aquí documentamos el proyecto.

- **MobileOS**
  - https://adagiosmobile.netlify.app    
  - Versión “móvil” del simulador.  
  - Basada en Vite + TypeScript + Tailwind CSS.  
  - Su código fuente vive en `src/`, con configuración en `vite.config.ts`, `tailwind.config.js`, etc.

- **DesktopOS**
  - https://adagiosdesktop.netlify.app
  - Versión “desktop” del simulador.  
  - Desarrollada con Next.js 13 (app router) + Tailwind CSS.  
  - Contiene carpetas `app/`, `components/`, `hooks/`, `public/`, `styles/`, y config (`next.config.mjs`, `tailwind.config.ts`).

---

## 🚀 Tecnologías principales

- **MobileOS**  
  - [Vite](https://vitejs.dev/)  
  - [TypeScript](https://www.typescriptlang.org/)  
  - [Tailwind CSS](https://tailwindcss.com/)

- **DesktopOS**  
  - [Next.js 13](https://nextjs.org/) (App Router)  
  - [TypeScript](https://www.typescriptlang.org/)  
  - [Tailwind CSS](https://tailwindcss.com/)

---

## 📦 Instalación y ejecución

1. Clona el repositorio:
   
   ```
   git clone https://github.com/<tu_usuario>/AdagiOS.git
   cd AdagiOS
   ```
2. MobileOS:
   
   ```
   git checkout MobileOS
   pnpm install
   pnpm dev
   # Visita http://localhost:5173
   ```
3. DesktopOS:
   ```
   git checkout DesktopOS
   pnpm install
   pnpm dev
   # Visita http://localhost:3000
   ```
Si quieres regresar a la rama principal:
    ```
    git checkout main
    ```

## 📝 Descripción de cada versión
### MobileOS

- **Simula una interfaz de sistema operativo móvil.**
- **Pantalla de inicio, gestor de ventanas, notificaciones y menú de aplicaciones.**

### DesktopOS

- **Simula un entorno de escritorio clásico.**
- **Barra de tareas, múltiples ventanas, explorador de archivos y accesos directos.**

## 🤝 Contribuciones
¡Todas las contribuciones son bienvenidas!

1. Haz un **fork** del repositorio.  
2. Crea una rama con tu feature o corrección:  
   ```git checkout -b feature/nombre-feature```  
3. Haz **commit** de tus cambios:  
   ```git commit -m "Añade feature X"```  
4. Envía un **pull request** describiendo tu aportación.
   
Por favor, respeta las convenciones de código y añade pruebas si aplica.

<img src="https://st1.uvnimg.com/dims4/default/176533a/2147483647/thumbnail/1024x576>/quality/75/format/jpg/?url=https%3A%2F%2Fuvn-brightspot.s3.amazonaws.com%2Fassets%2Fvixes%2Fimj%2Ft%2Ftruco-choca-los-cinco-1.gif">

## 📄 Licencia
Este proyecto se distribuye bajo la licencia GNU Affero General Public License v3.0.
Consulta el archivo LICENSE para más detalles.
```
Con esto tendrás una guía clara y profesional para cualquiera que visite tu repositorio y quiera probar o colaborar en tus simuladores de sistemas operativos.
```
<img src="https://hips.hearstapps.com/hmg-prod/images/frases-de-exito-y-motivacion-65d693cde8f8e.jpg"
     alt="Frases de éxito y motivación"
     style="width: 80%; height: auto; display: inline-block;">
