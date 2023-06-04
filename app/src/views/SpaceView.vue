<script setup lang="ts">
import { computed, ref } from 'vue';
import InputSwitch from 'primevue/inputswitch';
import Dropdown from 'primevue/dropdown';
import type { CallbackTypes } from "vue3-google-login";
import SpaceLayout from '@/components/SpaceLayout.vue'
import { useUserStore } from '@/stores/user';
import { useThemeStore } from '@/stores/theme'
import { useSpaceStore } from '@/stores/space';
import { useWidgetStore } from '@/stores/widget';
import router from '@/router';

const props = defineProps({
  spaceUid: {
    type: String,
    required: true
  }
});

const themeStore = useThemeStore()
const userStore = useUserStore()
const spaceStore = useSpaceStore()
const widgetsStore = useWidgetStore()

const selectedSpace = ref(props.spaceUid)
const space = computed(() => {
  return spaceStore.collection[selectedSpace.value];
});

const isSpaceOwner = computed(() => {
  return userStore.user?.pk === space.value?.owner;
});

const isAuthenticated = computed(() => {
  return userStore.isAuthenticated;
});

const handleLoginWithGoogle: CallbackTypes.TokenResponseCallback = (response) => {
  userStore.loginWithGoogle(response.access_token)
};

const availableSpaces = computed(() => {
  return [
    {
      label: 'My Spaces',
      items: spaceStore.mySpaces.map((space) => {
        return {
          label: space.name,
          value: space.uid
        }
      })
    },
    {
      label: 'Bookmarked Spaces',
      items: spaceStore.myBookmarkedSpaces.map((space) => {
        return {
          label: space.name,
          value: space.uid
        }
      })
    }
  ]
})

function handleSelectSpaceChange() {
  router.push({
    name: 'Space',
    params: {
      spaceUid: selectedSpace.value
    }
  })
}

async function handleCreateSpace() {
  const space = await spaceStore.createSpace()
  router.push({ name: 'Space', params: { spaceUid: space.uid } })
}

async function handleCloneSpace() {
  const space = await spaceStore.cloneSpace(selectedSpace.value)
  router.push({ name: 'Space', params: { spaceUid: space.uid } })
}

async function handleDeleteSpace() {
  await spaceStore.deleteSpace(selectedSpace.value)
  await widgetsStore.deleteWidgetsBySpace(selectedSpace.value)
  router.push({ name: 'Home' })
}

function handleToggleDefaultSpace() {
  const spaceId = (space.value.is_default) ? selectedSpace.value : null
  spaceStore.setDefaultSpace(spaceId)
}

function handleToggleBookmark() {
  spaceStore.toggleBookmark(selectedSpace.value)
}
</script>

<template>
  <div class="space-view flex flex-col">
    <div class="space-view__background w-full h-full fixed top-0 left-0"></div>
    <header class="sticky top-0 flex flex-row items-center dark:text-white z-50">
      <Dropdown
        v-model="selectedSpace"
        :options="availableSpaces"
        optionLabel="label"
        optionValue="value"
        optionGroupLabel="label"
        optionGroupChildren="items"
        placeholder="Select a City"
        class="w-64"
        @change="handleSelectSpaceChange"
      >
        <template #value="slotProps">
          <div v-if="slotProps.value" class="flex align-items-center">
            <div>{{ spaceStore.collection[slotProps.value].name }}</div>
          </div>
          <span v-else>
            {{ slotProps.placeholder }}
          </span>
        </template>
        <template #optiongroup="slotProps">
          <div class="flex align-items-center">
            <div>{{ slotProps.option.label }}</div>
          </div>
        </template>
        <template #footer="slotProps">
          <div class="flex flex-row">
            <button @click="handleCreateSpace">
              Create Space
            </button>
            <button @click="handleCloneSpace">
              Clone Space
            </button>
            <button @click="handleDeleteSpace" v-if="isSpaceOwner">
              Delete Space
            </button>
            <label v-if="isSpaceOwner">
              <span>Make Default</span>
              <input type="checkbox" v-model="space.is_default" @change="handleToggleDefaultSpace" />
            </label>
            <label v-else>
              <span>Bookmark</span>
              <input type="checkbox" v-model="space.is_bookmarked" @change="handleToggleBookmark" />
            </label>
          </div>
        </template>
      </Dropdown>

      <template v-if="isAuthenticated">
        <button @click="userStore.logout()">Logout</button>
      </template>
      <template v-else>
        <GoogleLogin :callback="handleLoginWithGoogle" popup-type="TOKEN">
          <button>Login Using Google</button>
        </GoogleLogin>
      </template>
      <div class="flex flex-row items-center justify-center space-x-2">
        <InputSwitch v-model="themeStore.isDarkMode" />
      </div>
    </header>
    <main class="relative flex grow">
      <SpaceLayout v-if="spaceUid" :key="spaceUid" :spaceId="spaceUid" />
    </main>
  </div>
</template>

<style scoped>
.space-view {
  width: 100vw;
  height: 100vh;
  overflow: auto;
}

.space-view__background {
	background-size: 400% 400%;
	animation: gradient 10s ease infinite;

  &:before,
  &:after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-size: 400% 400%;
    animation: gradient 10s ease infinite;
  }
}

.space-view__background,
.light .space-view__background {
  background-color: rgb(229 255 221);
  background-image: linear-gradient(0deg, rgb(229 255 221) , rgb(255 255 255 / 0%));
  &:before {
    background-image: linear-gradient(120deg, rgb(201 255 252 / 60%) , rgb(255 255 255 / 0%));
  }
  &:after {
    background-image: linear-gradient(240deg, rgb(255 231 233 / 60%) , rgb(255 255 255 / 0%));
  }
}

.dark .space-view__background {
  background-color: rgb(3 0 34);
  background-image: linear-gradient(0deg, rgb(3 0 34) , rgb(0 0 0 / 0%));

  &:before {
    background-image: linear-gradient(120deg, rgb(62 39 76 / 60%) , rgb(0 0 0 / 0%));
  }
  &:after {
    background-image:linear-gradient(240deg, rgb(0 33 30 / 60%) , rgb(0 0 0 / 0%));
  }
}

@keyframes gradient {
	0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
}

:deep(.p-inputswitch:not(.p-inputswitch-checked) .p-inputswitch-slider) {
  background: theme("colors.yellow.300")
}

:deep(.p-inputswitch:not(.p-disabled):hover .p-inputswitch-slider) {
  background: theme('colors.yellow.500');
}

:deep(.p-inputswitch.p-inputswitch-checked .p-inputswitch-slider) {
  background: theme('colors.blue.900');
}
:deep(.p-inputswitch.p-inputswitch-checked:not(.p-disabled):hover .p-inputswitch-slider) {
  background: theme('colors.blue.950');
}
:deep(.p-inputswitch.p-inputswitch-checked .p-inputswitch-slider:before) {
  background-image: url("https://unpkg.com/lucide-static@latest/icons/moon.svg");
  background-size: 1rem;
  background-repeat: no-repeat;
  background-position: center center;
}
:deep(.p-inputswitch:not(.p-inputswitch-checked) .p-inputswitch-slider:before) {
  background-image: url("https://unpkg.com/lucide-static@latest/icons/sun.svg");
  background-size: 1rem;
  background-repeat: no-repeat;
  background-position: center center;
}
</style>
