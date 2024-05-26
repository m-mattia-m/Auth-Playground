<script setup lang="ts"></script>

<template>
<!--    <div class="">-->
      <div class="min-h-screen -mt-28 -mb-20 flex flex-row items-center">
        <div class="w-1/2">
          <h1 class="text-4xl text-gray-900 mb-2 font-bold">Auth Playground</h1>
          <h2 class="text-lg text-gray-600 mb-2">For OAuth 2.0 and OpenID Connect</h2>

          <div class="mt-10 flex items-center gap-x-6">
            <NuxtLink to="/oauth2"
                      class="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              Try OAuth 2.0
            </NuxtLink>
            <NuxtLink to="https://github.com/m-mattia-m/auth-playground" target="_blank" class="text-sm font-semibold leading-6 text-gray-900">Github<span
                aria-hidden="true">→</span></NuxtLink>
          </div>
        </div>

        <div class="w-1/2 grid grid-cols-2 gap-12 place-content-stretch">
          <div class="bg-white p-8 w-36 h-36 place-self-end rounded-md  shadow-2xl shadow-gray-200">
            <img src="~/public/providers/google.svg" alt="google">
          </div>
          <div class="bg-white p-8 w-36 h-36 rounded-md  shadow-2xl shadow-gray-200">
            <img src="~/public/providers/microsoft.svg" alt="microsoft">
          </div>
          <div class="bg-white p-8 w-36 h-36 place-self-end rounded-md flex items-center  shadow-2xl shadow-gray-200">
            <img src="~/public/providers/meta.svg" alt="meta">
          </div>
          <div class="bg-white p-8 w-36 h-36 rounded-md  shadow-2xl shadow-gray-200">
            <img src="~/public/providers/notion.svg" alt="notion">
          </div>
        </div>
      </div>
<!--    </div>-->
</template>

<style scoped>

</style>