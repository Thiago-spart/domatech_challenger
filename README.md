# Domatech Challenger

## Introduction

Este projeto é uma aplicação web desenvolvida como parte de um desafio técnico, focada na gestão de pacientes. A aplicação permite o cadastro, edição e listagem de pacientes, oferecendo uma interface intuitiva para gerenciamento de dados cadastrais.

## Features

- Cadastro de pacientes com validação de dados.
- Edição de pacientes existentes.
- Listagem de pacientes com filtros e paginação.
- Interface responsiva e intuitiva.

## Technologies Used

- Next.js
- React
- React Query
- TypeScript
- SCSS/Sass
- Node.js
- pnpm

## Installation

To set up the project locally, follow these steps:

1. **Clone the repository:**

    ```bash
    git clone git@github.com:Thiago-spart/domatech_challenger.git
    cd ./domatech_challenger
    ```

2. **Install dependencies using pnpm:**

    ```bash
    pnpm install
    ```

3. **Set up environment variables:**
    Create a `.env.local` file in the root directory based on `.env.example` (if available) and fill in the necessary environment variables.

## Usage

To run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature-name`).
3. Make your changes.
4. Commit your changes (`git commit -m 'feat: Add new feature'`).
5. Push to the branch (`git push origin feature/your-feature-name`).
6. Open a Pull Request.

## Future features

- Clean sass styles
- sass variables for fonts, sizes and screens
- Edit user information at home
- Add a list of patients with a document and one click
- loading and error state for empty list at home
- login with google or facebook
- hydration with react query and nextjs
- fix files names patterns for the components
- testing following google recommendations (60% unit, 20% integration, 20% e2e)
- Also add storybook configuration to help out design integration
- figma mcp server configuration
- potman mcp server configuration
- configuration of fragments for the components and styling pattens
- docker configuration
- migration of middleware to proxy in next.js
- infinity loading
- rethink table for mobile
- rethink sidenav for mobile as it takes a lot of space(bottom navigation should work better)
- bundle analyzer to clean up not used libraries

## Decisions

- for the UI I've decide to use atomic design patten
- for state management as we don't really have a great client need for data I've decide to follow only with server state management using react query with cache and next js cookies feature to protect back end route and token usage.
- I also had to make components quickly, because of that they don't have a great pattens and quality, in a normal scenarios I would create a code quality with more reusable compound components
- I've decide to use next.js ssr features to protect back-end, and also have more performance
- I've used spec driven development for this project
- I used shadcn to abstract my components accessibility and integration with other libraries such as react hook form and tanstack.
- I've used a mix of SSR and ISG, I didn't find a good scenario to use SSG, as it doesn't have static content to send for the user that often

## License

This project is licensed under the [Insert License] - see the [LICENSE](LICENSE) file for details.
