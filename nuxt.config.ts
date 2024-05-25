// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: "Auth Playground",
      meta: [
        { name: 'description', content: 'Test your OAuth 2.0, OpenID Connect and SAML application. Generate your tokens for development without a working frontend.' }
      ],
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
    }
  },
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  ssr: true,
})
