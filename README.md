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
