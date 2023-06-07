<script setup lang="ts">
import { computed, ref } from 'vue';
import InputSwitch from 'primevue/inputswitch';
import SplitButton from 'primevue/splitbutton';
import Dropdown from 'primevue/dropdown';
import { SettingsIcon } from 'lucide-vue-next';
import type { CallbackTypes } from "vue3-google-login";
import { useUserStore } from '@/stores/user';
import { useUIStore } from '@/stores/ui'
import { useWidgetStore } from '@/stores/widget';
import { useSpaceStore } from '@/stores/space';
import router from '@/router';
import HomelyLogo from '@/components/HomelyLogo.vue';
import { ESidebarSection } from '@/constants/ui';
import type { ISpace } from '@/types/space';

const props = defineProps({
  spaceId: {
    type: String,
    required: true
  }
});

const uiStore = useUIStore()
const userStore = useUserStore()
const spaceStore = useSpaceStore()
const widgetStore = useWidgetStore()

const selectedSpace = ref(props.spaceId)

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
      items: spaceStore.mySpaces.map((space: ISpace) => {
        return {
          label: space.name,
          value: space.uid
        }
      })
    },
    {
      label: 'Bookmarked Spaces',
      items: spaceStore.myBookmarkedSpaces.map((space: ISpace) => {
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

function toggleOpenSidebar(sidebarSection: ESidebarSection) {
  const activeSidebar = uiStore.toggleActiveSidebar(props.spaceId, sidebarSection)

  if (activeSidebar === null) {
    widgetStore.discardAndStopEditMode(props.spaceId)
  }
}
</script>

<template>
  <header class="sticky h-20 top-0 grid grid-cols-3 items-center justify-between dark:text-white z-50 bg-white/80 dark:bg-black/80 backdrop-blur p-4">
    <div class="flex flex-row space-x-4">
      <SplitButton :model="menuItems" icon="pi pi-plus" text>
        <button class="p-button p-component p-splitbutton-defaultbutton p-1" type="button" @click="handleMenuClick">
          <HomelyLogo class="w-8 h-8" />
        </button>
      </SplitButton>
      <div class="flex flex-row items-center justify-center space-x-2">
        <InputSwitch v-model="uiStore.isDarkMode" />
      </div>
      <GoogleLogin v-if="!isAuthenticated" :callback="handleLoginWithGoogle" popup-type="TOKEN">
        <button>Login Using Google</button>
      </GoogleLogin>
    </div>

    <div class="flex flex-row items-center justify-center">
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
      </Dropdown>
      <button @click="handleCreateSpace">
        + Create Space
      </button>
    </div>

    <div class="flex flex-row items-center justify-end">
      <button @click="toggleOpenSidebar(ESidebarSection.SPACE)" class="flex flex-row p-2 bg-blue-300">
        <SettingsIcon />
      </button>
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
