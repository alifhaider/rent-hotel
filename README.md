# Rent-Hotel App

Book your Hotel from Anywhere. Live site
[Hotel-Rental](https://rent-hotel.fly.dev/)

## What is this app for

- Book a hotel room from anywhere
- Make payment
- Review system for a hotel & rooms

## Flow

- Sign In/Sign Up User
- Book a room as User, Make payment done
- Review a hotel as User
- Review a room as User
- Become a Host (Add your hotel)
- Add hotel details, facilities, pricing
- Search by hotel type, facilities, foods, price-range

## Upccoming Features

- Message system (Real time)
- Admin Dashboard (Currently this is maintainable with prisma)

## What's in the stack

This project is initialized with
[Remix indie Stacks](https://github.com/remix-run/indie-stack)

- Cookie Based
  [Authentication](https://remix.run/docs/en/v1/api/remix#createcookiesessionstorage)
- [Prisma](https://prisma.io) Orm with [SQLite Database](https://sqlite.org)
- Deployed in [Fly app deployment](https://fly.io) with
  [Docker](https://www.docker.com/)
- [Healthcheck endpoint](https://rent-hotel.fly.dev/healthcheck)
- Cypress tests in
  [GitHub Actions](https://github.com/alifhaider/rent-hotel/actions)
- Styling with [Tailwind](https://tailwindcss.com/)
- End-to-end testing with [Cypress](https://cypress.io)
- Local third party request mocking with [MSW](https://mswjs.io)
- Unit testing with [Vitest](https://vitest.dev) and
  [Testing Library](https://testing-library.com)
- Code formatting with [Prettier](https://prettier.io)
- Linting with [ESLint](https://eslint.org)
- Static Types with [TypeScript](https://typescriptlang.org)

## Development

- Initial setup: Clone the
  [Repository](https://github.com/alifhaider/rent-hotel/) and then run

  ```sh
  npm run setup
  ```

- Start dev server:

  ```sh
  npm run dev
  ```

This starts your app in development mode, rebuilding assets on file changes.

The database seed script creates a new user with some data you can use to get
started:

- Username: `alif@renthotel.dev`
- Password: `alifiscool`

## Good Luck!
