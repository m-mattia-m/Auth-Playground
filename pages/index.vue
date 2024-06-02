<script setup lang="ts"></script>

<template>
      <div class="min-h-screen flex flex-col justify-normal sm:justify-between sm:flex-row sm:items-center sm:-mt-28 sm:-mb-20">
        <div>
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

        <!-- w-full sm:w-1/2 grid grid-cols-4 sm:grid-cols-2 gap-12 sm:gap-6 place-content-stretch mt-8 sm:mt-0 -->
        <div class="w-full sm:w-1/2 grid grid-cols-2 xs:grid-cols-4 sm:grid-cols-2 gap-12 sm:gap-6 place-content-stretch mt-8">
          <!-- bg-white p-2 w-12 h-12 xs:p-4 xs:w-16 xs:h-16 sm:p-8 sm:w-36 sm:h-36 rounded-md shadow-2xl shadow-gray-200 sm:place-self-end -->
          <div class="bg-white p-4 w-24 h-24 xs:p-2 xs:h-16 xs:w-16 sm:p-6 sm:w-32 sm:h-32 rounded-md shadow-2xl shadow-gray-200 sm:place-self-end">
            <img src="/providers/google.svg" alt="google">
          </div>
          <!-- bg-white p-2 w-12 h-12 xs:p-4 xs:w-16 xs:h-16 sm:p-8 sm:w-36 sm:h-36 rounded-md shadow-2xl shadow-gray-200 -->
          <div class="bg-white p-4 w-24 h-24 xs:p-2 xs:h-16 xs:w-16 sm:p-6 sm:w-32 sm:h-32 rounded-md shadow-2xl shadow-gray-200 ">
            <img src="/providers/microsoft.svg" alt="microsoft">
          </div>
          <!-- bg-white p-2 w-12 h-12 xs:p-4 xs:w-16 xs:h-16 sm:p-8 sm:w-36 sm:h-36 rounded-md shadow-2xl shadow-gray-200 sm:place-self-end flex items-center -->
          <div class="bg-white p-4 w-24 h-24 xs:p-2 xs:h-16 xs:w-16 sm:p-6 sm:w-32 sm:h-32 rounded-md shadow-2xl shadow-gray-200 sm:place-self-end flex items-center ">
            <img src="/providers/meta.svg" alt="meta">
          </div>
          <!-- bg-white p-2 w-12 h-12 xs:p-4 xs:w-16 xs:h-16 sm:p-8 sm:w-36 sm:h-36 rounded-md shadow-2xl shadow-gray-200 -->
          <div class="bg-white p-4 w-24 h-24 xs:p-2 xs:h-16 xs:w-16 sm:p-6 sm:w-32 sm:h-32 rounded-md shadow-2xl shadow-gray-200 ">
            <img src="/providers/notion.svg" alt="notion">
          </div>
        </div>
      </div>
</template>

<style scoped lang="scss"></style>