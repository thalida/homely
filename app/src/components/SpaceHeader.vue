<script setup lang="ts">
import { computed, ref } from 'vue';
import InputSwitch from 'primevue/inputswitch';
import SplitButton from 'primevue/splitbutton';
import Dropdown from 'primevue/dropdown';
import type { CallbackTypes } from "vue3-google-login";
import { useUserStore } from '@/stores/user';
import { useThemeStore } from '@/stores/theme'
import { useSpaceStore } from '@/stores/space';
import { useWidgetStore } from '@/stores/widget';
import router from '@/router';
import HomelyLogo from '@/components/HomelyLogo.vue';

const props = defineProps({
  spaceId: {
    type: String,
    required: true
  }
});

const themeStore = useThemeStore()
const userStore = useUserStore()
const spaceStore = useSpaceStore()
const widgetsStore = useWidgetStore()

const selectedSpace = ref(props.spaceId)
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
      spaceId: selectedSpace.value
    }
  })
}

async function handleCreateSpace() {
  const space = await spaceStore.createSpace()
  router.push({ name: 'Space', params: { spaceId: space.uid } })
}

async function handleCloneSpace() {
  const space = await spaceStore.cloneSpace(selectedSpace.value)
  router.push({ name: 'Space', params: { spaceId: space.uid } })
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

const menuItems = ref([
  {
    label: "Demo Spaces",
    items: [
      {
        label: "Homepage",
        command: async () => {
          await spaceStore.fetchHomepageSpaces()
          const homepage = spaceStore.homepageSpaces[0].uid
          router.push({
            name: 'Space',
            params: {
              spaceId: homepage
            }
          })
        }
      },
      {
        label: "All Widgets",
      },
      {
        label: "Daily Dashboard",
      },
      {
        label: "Work Space",
      },
      {
        label: "Brainstorming",
      },
    ],
  },
  {
    separator: true
  },
  {
    label: 'Logout',
    icon: 'pi pi-refresh',
    command: () => {
      userStore.logout()
    }
  },
]);

function handleMenuClick() {
  router.push("/")
}
</script>

<template>
  <header class="sticky top-0 grid grid-cols-3 items-center justify-between dark:text-white z-50 bg-white/80 dark:bg-black/80 backdrop-blur p-4">
    <div class="flex flex-row space-x-4">
      <SplitButton :model="menuItems" icon="pi pi-plus" text>
        <button class="p-button p-component p-splitbutton-defaultbutton p-1" type="button" @click="handleMenuClick">
          <HomelyLogo class="w-8 h-8" />
        </button>
      </SplitButton>
      <div class="flex flex-row items-center justify-center space-x-2">
        <InputSwitch v-model="themeStore.isDarkMode" />
      </div>
      <GoogleLogin v-if="!isAuthenticated" :callback="handleLoginWithGoogle" popup-type="TOKEN">
        <button>Login Using Google</button>
      </GoogleLogin>
    </div>

    <div class="flex flex-col items-center justify-center">
      <Dropdown
        v-if="isAuthenticated"
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
          <div class="flex flex-row flex-wrap">
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
    </div>

    <div>
    </div>
  </header>
</template>

<style scoped>
:deep(.p-button.p-button-icon-only) {
  width: auto;
  padding: 0 0.5rem;
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
