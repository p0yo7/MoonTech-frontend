Importante:
Las funciones de A.I. requieren una API KEY de openAI, por cuestiones de seguridad no se puede subir a internet, pero se puede agregar una api key en el archivo .env, que se encuentra en la direccion backend/.env dentro de este repositorio.

The business logic with the operation and the user interface were separated into two repositories, so first you have to install both and install docker desktop (https://www.docker.com/products/docker-desktop/) to monitor their correct operation.

Important Links
Administration Plan https://app.plane.so/moontech/projects/9b58f816-09e2-4b1c-a17c-f7ab9177761f/modules/
Backend for this Project https://github.com/p0yo7/MoonTech-Backend

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, install dependencies:
```bash
npm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Create a user
To create a user with access to the platform, it is necessary to make a request from a tool like Postman. To make a POST to the http://localhost:8080/createUser directory, the request must have the following data:
{
  "Username": "poyo", // This will be the user used in the login page
  "FirstName": "Sylvia",
  "LastName": "Cortes",
  "WorkEmail": "sylvia.rojas@nsg-engineering.com",
  "Password": "poyoyon!", // This will be the password used in the login page
  "TeamID": 1,
  "LeaderID": null, // Omitir el LeaderID si no existe
  "Position": "Comercial",
  "Role": "Admin"
}

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# MoonTech Prototipo de Software

**Nos desvelamos para ti.**

## Descripción

El prototipo de software de **MoonTech** es una herramienta diseñada para facilitar la administración de proyectos, enfocándose en la organización y generación rápida de propuestas. Este proyecto es parte de una iniciativa educativa desarrollada para NEORIS, con el objetivo de optimizar sus procesos de gestión de proyectos.

## Características

- **Generación de Propuestas:** Automatiza la creación de propuestas de proyectos, basadas en plantillas personalizables.
- **Gestión de Tareas:** Organiza y asigna tareas, monitorea el progreso, y visualiza el estado de cada proyecto.
- **Integración con Metodologías Ágiles:** Soporta el uso de metodologías ágiles como Scrum y Kanban.
- **Colaboración en Equipo:** Facilita la colaboración y comunicación entre los miembros del equipo, manteniendo todos los documentos y archivos en un solo lugar.

## Requisitos del Sistema

- **Lenguaje de Programación:** React
- **Dependencias:** TailwindCSS, Node.js, Go
- **Plataforma:** Web

## Instalación

Sigue estos pasos para instalar y ejecutar el prototipo en tu entorno local:

1. Clona este repositorio:
   ```bash
   git clone https://github.com/p0yo7/MoonTech-frontend.git

2. Navega al directorio del proyecto de la finalSprint branch:
cd MoonTech

3. Ejecuta el proyecto:
```bash
npm run dev
```

## Uso

Una vez que el proyecto esté en funcionamiento, puedes acceder a la interfaz principal a través de tu navegador web. Desde allí, podrás:

- **Crear y gestionar proyectos:** Permite la organización de proyectos en diferentes categorías y facilita la asignación de tareas a los miembros del equipo.
- **Crear tareas y seguir el progreso:** Monitorea el estado de las tareas asignadas y realiza un seguimiento del progreso general del proyecto.
- **Generar informes y propuestas para clientes:** Automatiza la creación de documentos que resumen el avance del proyecto y generan propuestas personalizadas para los clientes.

## Contribución

Si deseas contribuir a este proyecto, sigue estos pasos:

1. Realiza un fork del repositorio.
2. Crea una nueva rama para tu función o corrección de errores:
   ```bash
   git checkout -b nombre-de-la-rama
3. Realiza los cambios necesarios y confirma tus commits:
git commit -m "Descripción de los cambios"

4. Envía tus cambios a tu repositorio fork:
git push origin nombre-de-la-rama

5. Crea una Pull Request en este repositorio principal:
Ve a la página de tu repositorio fork en GitHub y selecciona la rama que acabas de enviar.
Haz clic en "Compare & pull request" y proporciona una descripción clara de tus cambios.
Envía la Pull Request para que sea revisada y fusionada por los mantenedores del repositorio principal.

## Contacto

Para cualquier pregunta o sugerencia, no dudes en ponerte en contacto con nosotros:

- **Oscar (Sylvia Aurora) Cortes Rojas** - A00825972 - [Correo Electrónico](mailto:correo@example.com)
- **Luis Fernando Manzanares** - A01283738 - [Correo Electrónico](mailto:correo@example.com)
- **Yudith Korina Hernández Palacios** - A00834231 - [Correo Electrónico](mailto:correo@example.com)
