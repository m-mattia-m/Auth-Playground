<script setup lang="ts">
import {DocumentArrowDownIcon, DocumentArrowUpIcon, TrashIcon} from '@heroicons/vue/20/solid'
import {Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot} from '@headlessui/vue'
import shortUuid from "short-uuid";

// TODO: get endpoints, possible scopes, ... from .well-known/openid-configuration
// TODO: add tabs for different authentication methods: PKCE, ...
// TODO: add possibility to select which fields should be used for query parameters -> not every provider want the same queries
// TODO: add token-url with username/password to generate token
// TODO: improve user-experience in form (playground itself)

const route = useRoute()
const localStorageKey = "auth-playground::oauth2"
const request = ref({} as OAuthRequestElement)
const openShelveDialog = ref(false)
const openDataMigrationDialog = ref(false)
const openResponseDialog = ref(false)
const scopesString = ref("")
const customAttributesString = ref("")
const recentRequests = ref([] as OAuthRequestElement[])
const dataMigrationTextarea = ref("")
const responseCode = ref("")

onMounted(() => {
  dataMigrationTextarea.value = JSON.stringify(loadLocalStorage())
  loadTableData()
  fillResponseData()
})

async function sendRequest(): Promise<void> {
  const clientId = request.value.clientId ? `&client_id=${encodeURIComponent(request.value.clientId)}` : "";
  const redirectUri = request.value.redirectUri ? `&redirect_uri=${encodeURIComponent(request.value.redirectUri)}` : "";
  const responseType = request.value.responseType ? `&response_type=${encodeURIComponent(request.value.responseType)}` : "";
  const scope = scopesString.value ? `&scope=${encodeURIComponent(scopesString.value)}` : "";
  const codeChallenge = request.value.codeChallenge ? `&code_challenge=${(request.value.codeChallenge)}` : "";
  const codeChallengeMethod = request.value.codeChallengeMethode ? `&code_challenge_method=${encodeURIComponent(request.value.codeChallengeMethode)}` : "";

  const customAttributesArray: string[] = []
  customAttributesString.value.split(" ").forEach(element => {
    if (element == undefined || element == "") return
    const customAttributeElements : string[] = []
    element.trim().split("=").forEach(attribute => customAttributeElements.push(attribute))
    customAttributesArray.push(`&${customAttributeElements[0]}=${encodeURIComponent(customAttributeElements[1])}`)
  })

  let queries = `${clientId}${redirectUri}${responseType}${scope}${codeChallenge}${codeChallengeMethod}`
  customAttributesArray.forEach(element => queries += element)
  const url = `${request.value.authorizeUrl}?${queries.substring(1, queries.length)}`

  await navigateTo(url, {external: true})
}

function addRequestToShelf() {
  if (!process.client) return

  const requestToShelf: OAuthRequestElement = {
    id: shortUuid().generate(),
    title: request.value.title,
    description: request.value.description,
    authorizeUrl: request.value.authorizeUrl,
    redirectUri: request.value.redirectUri,
    clientId: request.value.clientId,
    clientSecret: request.value.clientSecret,
    responseType: request.value.responseType,
    codeChallenge: request.value.codeChallenge,
    codeChallengeMethode: request.value.codeChallengeMethode,
    scopes: stringToArray(scopesString.value),
    customAttributes: stringToArray(customAttributesString.value)
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
  scopesString.value = arrayToString(storageData[elementIndex].scopes)
  customAttributesString.value = arrayToString(storageData[elementIndex].customAttributes)

  loadTableData()
}

function fillResponseData() {
  responseCode.value = route.query.code as string
  if (responseCode.value != undefined && responseCode.value !== "") openResponseDialog.value = true
}

function copyCodeToClipboard() {
  navigator.clipboard.writeText(route.query.code as string)
}

function stringToArray(input: string): string[] {
  return input?.split(" ")
}

function arrayToString(input: string[]): string {
  let response: string = "";
  input.forEach((element) => {
    response += `${element} `
  })
  return response?.substring(0, response.length - 1)
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
  // metadata
  id: string,
  title: string,
  description: string,
  // required attributes for oauth2.0 process
  authorizeUrl: string,
  clientId: string,
  responseType: string,
  // optional widespread attributes
  redirectUri: string,
  clientSecret: string,
  codeChallenge: string,
  codeChallengeMethode: string,
  scopes: string[],
  customAttributes: string[],
}

</script>

<template>
  <div>

    <h1 class="text-4xl text-gray-900 mb-2">URL generation</h1>

    <div class="mt-6">
      <label for="authorize-url" class="block text-sm font-medium leading-6 text-gray-900">Authorize URL <i class="font-light text-red-600">(required)</i></label>
      <div class="mt-2">
        <input type="text" name="authorize-url" id="authorize-url" v-model="request.authorizeUrl"
               class="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
               placeholder="https://example.com/oauth/v2/authorize"/>
      </div>
    </div>

    <div class="mt-6">
      <label for="redirect-url" class="block text-sm font-medium leading-6 text-gray-900">Redirect URL <i class="font-light text-red-600">(required)</i></label>
      <div class="mt-2">
        <input type="text" name="redirect-url" id="redirect-url" v-model="request.redirectUri"
               class="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
               placeholder="https://auth-playground.makefermion.com/oauth2"/>
      </div>
    </div>

    <div class="mt-6">
      <label for="client-id" class="block text-sm font-medium leading-6 text-gray-900">Client-ID <i class="font-light text-red-600">(required)</i></label>
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
      <label for="response-type" class="block text-sm font-medium leading-6 text-gray-900">Response type</label>
      <div class="mt-2">
        <input type="text" name="response-type" id="response-type" v-model="request.responseType"
               class="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
               placeholder="code"/>
      </div>
    </div>

    <div class="mt-6">
      <label for="code-challenge" class="block text-sm font-medium leading-6 text-gray-900">Code challenge</label>
      <div class="mt-2">
        <input type="text" name="code-challenge" id="code-challenge" v-model="request.codeChallenge"
               class="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
               placeholder="code_verifier"/>
      </div>
    </div>

    <div class="mt-6">
      <label for="code-challenge-methode" class="block text-sm font-medium leading-6 text-gray-900">Code challenge
        methode</label>
      <div class="mt-2">
        <input type="text" name="code-challenge-methode" id="code-challenge-methode"
               v-model="request.codeChallengeMethode"
               class="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
               placeholder="S256"/>
      </div>
    </div>

    <div class="mt-6">
      <label for="scopes" class="block text-sm font-medium leading-6 text-gray-900">Scopes</label>
      <div class="mt-2">
        <input type="text" name="scopes" id="scopes" v-model="scopesString"
               class="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
               placeholder="openid profile email roles"/>
      </div>
      <p class="mt-2 text-sm text-gray-500" id="email-description">Split the scopes with a empty space.</p>
    </div>

    <div class="mt-6">
      <label for="custom-attributes" class="block text-sm font-medium leading-6 text-gray-900">Custom attributes</label>
      <div class="mt-2">
        <input type="text" name="custom-attributes" id="custom-attributes" v-model="customAttributesString"
               class="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
               placeholder="owner=me hello=world"/>
      </div>
      <p class="mt-2 text-sm text-gray-500" id="email-description">Split the custom attributes with a empty space.</p>
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
        <button type="button" @click="sendRequest()"
                class="w-20 h-full rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          Send
        </button>
      </div>
    </div>
  </div>

  <h2 class="mt-16 text-2xl text-gray-900 mb-2">Saved requests</h2>
  <div v-if="recentRequests.length > 0">
    <div class="px-4 sm:px-6 lg:px-8">
      <div class="mt-4 flow-root">
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
                      Import or export data
                    </DialogTitle>
                    <div class="mt-2">
                      <p>Copy the value of this textarea to share or store your requests. Note that this content
                        contains visible secrets, and we <b>strongly recommend</b> that you don't share any secrets.</p>
                      <div class="mt-6">
                        <label for="description"
                               class="block text-sm font-medium leading-6 text-gray-900">Your current saved
                          requests</label>
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
                          @click="openDataMigrationDialog = false; overWriteData()">Import and overwrite
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

  <div>
    <TransitionRoot as="template" :show="openResponseDialog">
      <Dialog class="relative z-10" @close="openResponseDialog = false">
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
                      Response
                    </DialogTitle>
                    <div class="mt-2">
                      <div class="mt-6">
                        <label for="response-code" class="block text-sm font-medium leading-6 text-gray-900">Response
                          Code</label>
                        <div class="mt-2">
                          <input type="text" name="response-code" id="response-code" v-model="responseCode"
                                 class="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"/>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button type="button"
                          class="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                          @click="copyCodeToClipboard()">Copy code
                  </button>
                  <button type="button"
                          class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                          @click="openResponseDialog = false" ref="cancelButtonRef">Cancel
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