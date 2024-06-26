<script setup>
import {Disclosure, DisclosureButton, DisclosurePanel} from '@headlessui/vue'
import {Bars3Icon, XMarkIcon} from '@heroicons/vue/24/outline'

const route = useRoute()

const navActivation = ref({
  finishedInitLoad: false,
  home: false,
  oauth2: false,
  oidc: false,
  about: false,
})

watch(() => route.path, () => {
  checkRouteUpdateLayout()
});

onBeforeMount(() => {
  checkRouteUpdateLayout()
})

function setNavActivationToFalse() {
  Object.keys(navActivation.value).forEach(key => {
    navActivation.value[key] = false;
  });
}

function checkRouteUpdateLayout() {
  if (!process.client) return

  setNavActivationToFalse()
  navActivation.value.finishedInitLoad = true

  if (route.path.startsWith("/oauth2")) return navActivation.value.oauth2 = true
  if (route.path.startsWith("/oidc")) return navActivation.value.oidc = true
  if (route.path.startsWith("/about")) return navActivation.value.about = true

  navActivation.value.home = true
}

</script>

<template>
    <Disclosure as="nav" class="bg-white shadow" v-slot="{ open }" v-if="navActivation.finishedInitLoad">
      <div class="max-w-8xl px-2 sm:px-2 lg:px-6">
        <div class="relative flex h-16 justify-between">
          <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <!-- Mobile menu button -->
            <DisclosureButton
                class="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
              <span class="absolute -inset-0.5"/>
              <span class="sr-only">Open main menu</span>
              <Bars3Icon v-if="!open" class="block h-6 w-6" aria-hidden="true"/>
              <XMarkIcon v-else class="block h-6 w-6" aria-hidden="true"/>
            </DisclosureButton>
          </div>
          <div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <!-- logo -->
            <!-- <div class="flex flex-shrink-0 items-center">-->
            <!--     <img class="h-8 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" />-->
            <!-- </div>-->
            <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
              <!-- Current: "border-indigo-500 text-gray-900", Default: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700" -->
              <NuxtLink to="/"
                        :class="[navActivation.home ? 'border-indigo-500 text-gray-900' : 'border-transparent hover:border-gray-300 hover:text-gray-700' ]"
                        class="inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium text-gray-500">
                Home
              </NuxtLink>
              <NuxtLink to="/oauth2"
                        :class="[navActivation.oauth2 ? 'border-indigo-500 text-gray-900' : 'border-transparent hover:border-gray-300 hover:text-gray-700' ]"
                        class="inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium text-gray-500">
                OAuth 2.0
              </NuxtLink>
              <NuxtLink to="/oidc"
                        :class="[navActivation.oidc ? 'border-indigo-500 text-gray-900' : 'border-transparent hover:border-gray-300 hover:text-gray-700' ]"
                        class="inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium text-gray-500">
                OpenID Connect
              </NuxtLink>
              <NuxtLink to="/about"
                        :class="[navActivation.about ? 'border-indigo-500 text-gray-900' : 'border-transparent hover:border-gray-300 hover:text-gray-700' ]"
                        class="inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium text-gray-500">
                About
              </NuxtLink>
            </div>
          </div>

          <div class="relative ml-3">
            <NuxtLink to="https://github.com/m-mattia-m/auth-playground" external="external" target="_blank"
                class="relative flex rounded-full bg-white text-sm">
              <span class="absolute -inset-1.5"/>
              <span class="sr-only">Github</span>
              <img class="h-8 w-8 my-[16px] rounded-full"
                   src="~/public/github.svg"
                   alt="Github"/>
            </NuxtLink>
          </div>
        </div>
      </div>

      <DisclosurePanel class="sm:hidden">
        <div class="space-y-1 pb-4 pt-2">
          <!-- Current: "bg-indigo-50 border-indigo-500 text-indigo-700", Default: "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700" -->
          <DisclosureButton as="a" href="/"
                            :class="[navActivation.home ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-transparent hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700']"
                            class="block border-l-4 py-2 pl-3 pr-4 text-base font-medium text-gray-500">
            Home
          </DisclosureButton>
          <DisclosureButton as="a" href="/oauth2"
                            :class="[navActivation.oauth2 ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-transparent hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700']"
                            class="block border-l-4 py-2 pl-3 pr-4 text-base font-medium text-gray-500">
            OAuth2.0
          </DisclosureButton>
          <DisclosureButton as="a" href="/oidc"
                            :class="[navActivation.oidc ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-transparent hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700']"
                            class="block border-l-4 py-2 pl-3 pr-4 text-base font-medium text-gray-500">
            OpenID Connect
          </DisclosureButton>
          <DisclosureButton as="a" href="/about"
                            :class="[navActivation.about ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-transparent hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700']"
                            class="block border-l-4 py-2 pl-3 pr-4 text-base font-medium text-gray-500">
            About
          </DisclosureButton>
        </div>
      </DisclosurePanel>
    </Disclosure>

    <div class="py-4 sm:py-6 md:py-8 lg:py-10 px-4 sm:px-6 md:px-8 lg:px-10">
      <NuxtPage/>
    </div>
</template>

<style scoped>

</style>