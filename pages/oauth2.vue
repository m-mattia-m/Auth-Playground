<script setup lang="ts">
import {DocumentArrowDownIcon, DocumentArrowUpIcon, TrashIcon} from '@heroicons/vue/20/solid'
import {Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot} from '@headlessui/vue'
import shortUuid from "short-uuid";

// TODO: get endpoints, possible scopes, ... from .well-known/openid-configuration

const localStorageKey = "auth-playground::oauth2"
const request = ref({} as OAuthRequestElement)
const openShelveDialog = ref(false)
const openDataMigrationDialog = ref(false)
const scopesString = ref("")
const recentRequests = ref([] as OAuthRequestElement[])
const dataMigrationTextarea = ref("")

onMounted(() => {
  dataMigrationTextarea.value = JSON.stringify(loadLocalStorage())
  loadTableData()
})

function addRequestToShelf() {
  if (!process.client) return
  console.log(shortUuid().generate())

  const requestToShelf: OAuthRequestElement = {
    id: shortUuid().generate(),
    title: request.value.title,
    description: request.value.description,
    tokenUrl: request.value.tokenUrl,
    clientId: request.value.clientId,
    clientSecret: request.value.clientSecret,
    scopes: stringToArray(scopesString.value),
  }

  const storageData = loadLocalStorage()
  storageData.push(requestToShelf)
  setLocalStorage(storageData)
  loadTableData()
}

function loadTableData(): void {
  recentRequests.value = loadLocalStorage()
}

function deleteRequest(id: string): void {
  const storageData = loadLocalStorage()
  const elementIndex = storageData.findIndex(element => element.id === id)
  if (elementIndex != undefined) storageData.splice(elementIndex, 1);
  setLocalStorage(storageData)
  loadTableData()
}

function overWriteData() {
  const importedDataTyped: OAuthRequestElement[] = JSON.parse(dataMigrationTextarea.value || "[]");
  setLocalStorage(importedDataTyped)
}

function unshelveRequest(id: string): void {
  const storageData = loadLocalStorage()
  const elementIndex = storageData.findIndex(element => element.id === id)

  request.value = storageData[elementIndex]
  console.log(storageData[elementIndex])
  console.log(storageData[elementIndex].clientSecret)
  scopesString.value = arrayToString(storageData[elementIndex].scopes)
  loadTableData()
}

function stringToArray(input: string): string[] {
  return input?.split(" ")
}

function arrayToString(input: string[]): string {
  let response: string = "";
  input.forEach((element) => {
    response += `${element}, `
  })
  return response?.substring(0, response.length - 2)
}

function loadLocalStorage(): OAuthRequestElement[] {
  const storageDataResponse: OAuthRequestElement[] = [];
  try {
    const storageDataRaw = localStorage.getItem(localStorageKey)
    let storageDataTyped: OAuthRequestElement[] = JSON.parse(storageDataRaw || "[]");
    storageDataResponse.push(...storageDataTyped)
  } catch (e: any) {
    // TODO: create notification in UI
    console.log(e)
  }
  return storageDataResponse
}

function setLocalStorage(updatedStorage: OAuthRequestElement[]): void {
  try {
    localStorage.setItem(localStorageKey, JSON.stringify(updatedStorage))
  } catch (e: any) {
    // TODO: create notification in UI
    console.log(e)
  }
}

interface OAuthRequestElement {
  id: string,
  title: string,
  description: string,
  tokenUrl: string,
  clientId: string,
  clientSecret: string,
  scopes: string[],
}

</script>

<template>
  <div>
    <div class="mt-6">
      <label for="token-url" class="block text-sm font-medium leading-6 text-gray-900">Token URL</label>
      <div class="mt-2">
        <input type="text" name="token-url" id="token-url" v-model="request.tokenUrl"
               class="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
               placeholder="https://example.com/oauth/v2/token"/>
      </div>
    </div>

    <div class="mt-6">
      <label for="client-id" class="block text-sm font-medium leading-6 text-gray-900">Client-ID</label>
      <div class="mt-2">
        <input type="text" name="client-id" id="client-id" v-model="request.clientId"
               class="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
               placeholder="1234@example"/>
      </div>
    </div>

    <div class="mt-6">
      <label for="client-secret" class="block text-sm font-medium leading-6 text-gray-900">Client Secret</label>
      <div class="mt-2">
        <input type="text" name="client-secret" id="client-secret" v-model="request.clientSecret"
               class="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
               placeholder="abc123"/>
      </div>
    </div>

    <div class="mt-6">
      <label for="scopes" class="block text-sm font-medium leading-6 text-gray-900">Scopes</label>
      <div class="mt-2">
        <input type="text" name="scopes" id="scopes" v-model="scopesString"
               class="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
               placeholder="openid profile email roles"/>
      </div>
    </div>

    <div class="mt-6 flex flex-row justify-end">
      <div>
      <span class="isolate inline-flex rounded-md shadow-sm">
        <button type="button" @click="openShelveDialog = true"
                class="w-14 relative inline-flex justify-center items-center rounded-l-md bg-white px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10">
          <span class="sr-only">Shelf</span>
          <DocumentArrowDownIcon class="h-5 w-5" aria-hidden="true"/>
        </button>
        <button type="button" @click="openDataMigrationDialog = true"
                class="w-14 relative -ml-px inline-flex justify-center items-center rounded-r-md bg-white px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10">
          <span class="sr-only">Unshelve</span>
          <DocumentArrowUpIcon class="h-5 w-5" aria-hidden="true"/>
        </button>
      </span>
      </div>

      <div class="ml-4">
        <button type="button"
                class="w-20 h-full rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          Send
        </button>
      </div>
    </div>
  </div>

  <div v-if="recentRequests.length > 0">
    <div class="mt-40 px-4 sm:px-6 lg:px-8">
      <div class="mt-8 flow-root">
        <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div class="inline-block min-w-full py-2 align-middle">
            <table class="min-w-full divide-y divide-gray-300">
              <thead>
              <tr>
                <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Title
                </th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Description</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">ClientId</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Scopes</th>
                <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-0">
                  <span class="sr-only">Action</span>
                </th>
              </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
              <tr v-for="request in recentRequests" :key="request.id">
                <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                  {{ request.title }}
                </td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ request.description }}</td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ request.clientId }}</td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ request.scopes }}</td>
                <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                  <button type="button" class="text-indigo-600 hover:text-indigo-900"
                          @click="unshelveRequest(request.id)">
                    <DocumentArrowUpIcon class="h-5 w-5" aria-hidden="true"/>
                    <span class="sr-only">Unshelve</span>
                  </button>
                  <button type="button" class=" pl-2 text-red-600 hover:text-indigo-900"
                          @click="deleteRequest(request.id)">
                    <TrashIcon class="h-5 w-5" aria-hidden="true"/>
                    <span class="sr-only">Delete</span>
                  </button>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div>
    <TransitionRoot as="template" :show="openShelveDialog">
      <Dialog class="relative z-10" @close="openShelveDialog = false">
        <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100"
                         leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"/>
        </TransitionChild>

        <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div class="flex min-h-full items-end justify-center p-4 sm:items-center sm:p-0">
            <TransitionChild as="template" enter="ease-out duration-300"
                             enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                             enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200"
                             leave-from="opacity-100 translate-y-0 sm:scale-100"
                             leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
              <DialogPanel
                  class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div>
                  <div class="mt-3 sm:mt-5">
                    <DialogTitle as="h3" class="text-base font-semibold leading-6 text-gray-900">
                      Save request to local storage
                    </DialogTitle>
                    <div class="mt-2">
                      <div class="mt-6">
                        <label for="title" class="block text-sm font-medium leading-6 text-gray-900">Title</label>
                        <div class="mt-2">
                          <input type="text" name="title" id="title" v-model="request.title"
                                 class="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                 placeholder="Notion OAuth 2.0"/>
                        </div>
                      </div>
                      <div class="mt-6">
                        <label for="description"
                               class="block text-sm font-medium leading-6 text-gray-900">Description</label>
                        <div class="mt-2">
                          <textarea rows="4" name="description" id="description" v-model="request.description"
                                    class="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"/>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button type="button"
                          class="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                          @click="openShelveDialog = false; addRequestToShelf()">Save
                  </button>
                  <button type="button"
                          class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                          @click="openShelveDialog = false" ref="cancelButtonRef">Cancel
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
  <div>
    <TransitionRoot as="template" :show="openDataMigrationDialog">
      <Dialog class="relative z-10" @close="openDataMigrationDialog = false">
        <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100"
                         leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"/>
        </TransitionChild>

        <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div class="flex min-h-full items-end justify-center p-4 sm:items-center sm:p-0">
            <TransitionChild as="template" enter="ease-out duration-300"
                             enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                             enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200"
                             leave-from="opacity-100 translate-y-0 sm:scale-100"
                             leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
              <DialogPanel
                  class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div>
                  <div class="mt-3 sm:mt-5">
                    <DialogTitle as="h3" class="text-base font-semibold leading-6 text-gray-900">
                      Save request to local storage
                    </DialogTitle>
                    <div class="mt-2">
                      <p>Copy the value of this textarea to share or store your requests. Note that this content
                        contains visible secrets, and we <b>strongly recommend</b> that you don't share any secrets.</p>
                      <div class="mt-6">
                        <label for="description"
                               class="block text-sm font-medium leading-6 text-gray-900">Data migration </label>
                        <div class="mt-2">
                          <textarea rows="4" name="description" id="description" v-model="dataMigrationTextarea"
                                    class="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"/>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button type="button"
                          class="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                          @click="openDataMigrationDialog = false; overWriteData()">Overwrite
                  </button>
                  <button type="button"
                          class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                          @click="openDataMigrationDialog = false" ref="cancelButtonRef">Cancel
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>

</template>

<style scoped>

</style>