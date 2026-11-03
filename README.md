# Sabi Girl — Fun Sex Education App

**Free sexual and reproductive health support for girls and young women.**

Live app: **https://sabigirl.netlify.app**

Sabi Girl is an open-source, privacy-first sexual and reproductive health and rights (SRHR) education web app. It is made to give girls and young women accurate, stigma-free health information and tools, even with poor internet access.

## Features

- **Cycle and symptom tracker**: log period days, flow, symptoms and mood. The app estimates your next period, ovulation and fertile window.
- **Privacy vault**: all health logs stay on your own device (browser localStorage). Nothing is sent to a server. You can export a JSON backup or wipe everything with one tap.
- **AI SRHR educator**: ask sensitive questions about periods, contraception, STIs and wellbeing, and get kind, evidence-based answers. Questions go through a serverless function. No API keys are exposed in the browser, and conversations are not stored.
- **Youth clinic directory**: search and filter youth-friendly clinics by service (contraception, STI screening, mental health and GBV support).
- **Quick Shield**: blurs the screen instantly for privacy in shared spaces.
- **Offline mode**: simulates low-connectivity settings, with built-in fallback guidance.

> The clinic directory currently holds sample data for demonstration.

## Tech stack

- [React](https://react.dev) + [TypeScript](https://www.typescriptlang.org), built with [Vite](https://vite.dev)
- [Tailwind CSS](https://tailwindcss.com) and [Lucide](https://lucide.dev) icons
- [Netlify Functions](https://docs.netlify.com/functions/overview/) + [Netlify AI Gateway](https://docs.netlify.com/build/ai-gateway/overview/) (Google Gemini) for the AI educator
- Hosted on [Netlify](https://www.netlify.com)

## Running locally

```bash
npm install
npx netlify dev     # runs the app and the /api/chat function together
```

If you only need the frontend: `npm run dev`. In that mode the AI educator falls back to built-in guidance.

## Project structure

```
src/App.tsx               # Main app (tracker, AI educator, clinic directory)
src/main.tsx              # React entry point
netlify/functions/chat.ts # Serverless AI educator endpoint (/api/chat)
netlify.toml              # Netlify build configuration
```

## Contributing

Contributions are welcome. Open an issue or a pull request, especially for translations, accessibility, verified clinic data and health content reviewed by medical professionals.

## Disclaimer

Sabi Girl is for education only. It does not replace professional medical advice, diagnosis or treatment. Cycle predictions are estimates and must not be used as contraception.

## License

Released under the [MIT License](./LICENSE).
