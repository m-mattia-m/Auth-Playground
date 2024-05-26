<script setup lang="ts">

const credits = [
  { name: 'Nuxt', description: 'Framework, Design kit', source: '_nuxt/public/credits/nuxt.svg', href: 'https://nuxt.com', bgColor: 'bg-green-100', borderColor: 'border-green-300' },
  { name: 'Tailwind', description: 'Tailwind CSS, Tailwind UI', source: '_nuxt/public/credits/tailwindcss.svg', href: 'https://tailwindcss.com', bgColor: 'bg-blue-100', borderColor: 'border-blue-300' },
  { name: 'SVG Repo', description: 'SVGs', source: '_nuxt/public/credits/svg-repo.svg', href: 'https://www.svgrepo.com', bgColor: 'bg-blue-100', borderColor: 'border-blue-300' },
  { name: 'Zitadel', description: 'OIDC, OAuth2.0, Design Kit', source: '_nuxt/public/credits/zitadel-dark.svg', href: 'https://zitadel.com', bgColor: 'bg-pink-100', borderColor: 'border-pink-300' },
]

</script>

<template>
  <h1 class="text-4xl text-gray-900 mb-2">About</h1>
  <p class="text-base"><b>Auth Playground</b> is a playground &#x1F3AE; to help you to get all authentication codes and tokens during development &#x1F9D1;&#x200D;&#x1F4BB;. We do not save any token or code which you received to be sure about that &#128272;, you can check &#128065; our opensource Github Repository &#128214;. You are also welcome to contribute to this project.</p>

  <h1 class="text-4xl text-gray-900 mb-2 mt-32">Contribution</h1>
  <p class="text-base">We would love &#x2764;&#xFE0F; if you contribute &#x1F9D1;&#x200D;&#x1F4BB; to this project. You can for example add a new authentication provider &#127970;, fix some issues &#128308; which you found or do something else.</p>

  <h1 class="text-4xl text-gray-900 mb-2 mt-32">Credits</h1>
  <h2 class="text-2xl text-gray-900 mt-4 mb-2"> Tech Stack</h2>
  <div>
    <ul role="list" class="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
      <li v-for="credit in credits" :key="credit.name" class="col-span-1 flex rounded-md shadow-sm">
        <div :class="[credit.bgColor, credit.borderColor, 'flex w-16 flex-shrink-0 items-center justify-center rounded-l-md text-sm font-medium text-white border-[1px]']">

          <img class="h-8 w-8" v-if="credit.source != ''"
               :src="credit.source"
               :alt="credit.name"/>
        </div>
        <div class="flex flex-1 items-center justify-between truncate rounded-r-md border-b border-r border-t border-gray-200 bg-white">
          <div class="flex-1 truncate px-4 py-2 text-sm">
            <a :href="credit.href" class="font-medium text-gray-900 hover:text-gray-600">{{ credit.name }}</a>
            <p class="text-gray-500">{{ credit.description }}</p>
          </div>
        </div>
      </li>
    </ul>
  </div>


  <h2 class="text-2xl text-gray-900 mt-10 mb-2">Contributors</h2>
<!--  <p class="text-base mt-10 mb-6">And of course all our contributors.</p>-->

  <a href="https://github.com/m-mattia-m/auth-playground/graphs/contributors">
    <img src="https://contrib.rocks/image?repo=m-mattia-m/auth-playground" alt="contributors" />
  </a>

  <p class="text-base text-gray-300 mt-4">Made with <NuxtLink external="external" to="https://contrib.rocks">contrib.rocks</NuxtLink>.</p>

</template>

<style scoped>

</style>