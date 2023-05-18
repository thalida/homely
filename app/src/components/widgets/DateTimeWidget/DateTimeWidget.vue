<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, watchEffect, ref } from 'vue'
import { useWidgetStore } from '@/stores/widget'
import { useDateTimeStore } from '@/stores/datetime'
import type { IDateTime, IDateTimeWidget } from '@/types/widget'
import { SunIcon } from 'lucide-vue-next';
import { MoonIcon } from 'lucide-vue-next';

const props = defineProps({
  widgetId: {
    type: String,
    required: false,
    default: null
  }
})

const widgetStore = useWidgetStore()
const dateTimeStore = useDateTimeStore()
const widget = computed(() => {
  return widgetStore.getWidgetById(props.widgetId) as IDateTimeWidget
})
const widgetId = ref<string | null>(null)

watchEffect(() => {
  if (widget.value) {
    widgetId.value = widget.value.id
  }
})

onMounted(() => {
  if (!widget.value) {
    return
  }

  dateTimeStore.connect(widget.value.id)
})

onBeforeUnmount(() => {
  if (!widgetId.value) {
    return
  }

  dateTimeStore.disconnect(widgetId.value)
})

function onChangeUseLocalTime(e: Event, datetime: IDateTime) {
  if (datetime.useLocalTime) {
    datetime.timezone = null
  } else {
    datetime.timezone = dateTimeStore.localTimezone
  }
}

function handleAddDateTime() {
  if (!widget.value) {
    return
  }

  const defaults = {
    timezone: null,
    useLocalTime: true,
    showIsLocalTimeLabel: true,
    formatLine1: "h:mm A",
    formatLine2: "dddd, MMMM D",
    showCity: true,
    showLine1: true,
    showLine2: true,
    showDayNightIcon: true,
    showDayNightBackground: true,
  }

  const copyFrom = widget.value.content.datetimes.length > 0 ? widget.value.content.datetimes[widget.value.content.datetimes.length - 1] : defaults
  const newDatetime = Object.assign({}, copyFrom)
  newDatetime.timezone = null
  newDatetime.useLocalTime = true

  widget.value.content.datetimes.push(newDatetime)
}

function handleRemoveDateTime(e: Event, datetime: IDateTime, index: number) {
  if (!widget.value) {
    return
  }

  widget.value.content.datetimes.splice(index, 1)
}

function timezoneDisplay(datetime: IDateTime) {
  const timezone = datetime.useLocalTime ? dateTimeStore.localTimezone : datetime.timezone
  if (!timezone) {
    return
  }

  const timezoneParts = timezone.split('/')
  if (timezoneParts.length === 1) {
    return timezone
  }

  const [, ...cityParts] = timezoneParts
  const cityStr = cityParts.join(' - ').replaceAll('_', ' ')

  return cityStr
}

</script>

<template>
  <div
    v-bind="$attrs"
    class="flex flex-col">
    <div
      v-for="(datetime, index) in widget.content.datetimes"
      :key="index"
      class="flex flex-row items-center justify-between px-4 py-2 grow"
      :class="{
        'bg-blue-950 text-white': datetime.showDayNightBackground && dateTimeStore.isNight(datetime),
        'bg-yellow-300': datetime.showDayNightBackground && !dateTimeStore.isNight(datetime),
      }">
      <div v-if="datetime.showDayNightIcon || datetime.showCity" class="flex flex-row items-center space-x-4 grow">
        <div v-if="datetime.showDayNightIcon">
          <MoonIcon v-if="dateTimeStore.isNight(datetime)" />
          <SunIcon v-else />
        </div>
        <div class="flex flex-col" v-if="datetime.showCity">
          <span class="text-lg">{{ timezoneDisplay(datetime) }}</span>
          <span v-if="datetime.useLocalTime && datetime.showIsLocalTimeLabel" class="text-xs">Current Location</span>
        </div>
      </div>
      <div
        v-if="datetime.showLine1 || datetime.showLine2"
        class="flex flex-col justify-center grow"
        :class="{
          'scale-text items-center text-center': !datetime.showDayNightIcon && !datetime.showCity,
          'items-end text-right': datetime.showDayNightIcon || datetime.showCity,
        }"
      >
        <div
          v-if="datetime.showLine1"
          :class="{
            'text-lg': datetime.showDayNightIcon || datetime.showCity,
            'font-bold': !datetime.showDayNightIcon && !datetime.showCity,
          }"
        >
          {{ dateTimeStore.format(datetime, datetime.formatLine1) }}
        </div>
        <div
          v-if="datetime.showLine2"
          :class="{
            'text-lg': datetime.showDayNightIcon || datetime.showCity,
            'font-bold': !datetime.showDayNightIcon && !datetime.showCity,
          }">
          {{ dateTimeStore.format(datetime, datetime.formatLine2) }}
        </div>
      </div>
    </div>
  </div>
  <teleport to="#space__widget-menu">
    <div v-if="widget.state.selected">
      <div v-for="(datetime, index) in widget.content.datetimes" :key="index" class="flex flex-col">
        <label>
          <span>Use Local Time</span>
          <input type="checkbox" v-model="datetime.useLocalTime" @change="onChangeUseLocalTime($event, datetime)" />
        </label>
        <label v-if="datetime.useLocalTime">
          <span>Show Is Local Time Label</span>
          <input type="checkbox" v-model="datetime.showIsLocalTimeLabel" />
        </label>
        <label v-if="!datetime.useLocalTime">
          <span>Timezone</span>
          <select v-model="datetime.timezone">
            <option v-for="timezone in dateTimeStore.supportedTimezones" :key="timezone" :value="timezone">{{ timezone }}</option>
          </select>
        </label>
        <label>
          <span>Show City</span>
          <input type="checkbox" v-model="datetime.showCity" />
        </label>
        <label>
          <span>Show Line 1</span>
          <input type="checkbox" v-model="datetime.showLine1" />
        </label>
        <label v-if="datetime.showLine1">
          <span>Format Line 1</span>
          <input type="text" v-model="datetime.formatLine1" />
        </label>
        <label>
          <span>Show Line 2</span>
          <input type="checkbox" v-model="datetime.showLine2" />
        </label>
        <label v-if="datetime.showLine2">
          <span>Format Line 2</span>
          <input type="text" v-model="datetime.formatLine2" />
        </label>
        <label>
          <span>Show Day/Night Icon</span>
          <input type="checkbox" v-model="datetime.showDayNightIcon" />
        </label>
        <label>
          <span>Show Day/Night Background</span>
          <input type="checkbox" v-model="datetime.showDayNightBackground" />
        </label>
        <button @click="handleRemoveDateTime($event, datetime, index)">Remove</button>
      </div>
      <div>
        <button @click="handleAddDateTime">Add</button>
      </div>
    </div>
  </teleport>
</template>

<style scoped>
.scale-text {
  container-type: inline-size;
}
/* fit font to container */
.scale-text * {
  font-size: min(50cqw, 10cqh);
  line-height: 1;
  width: 100%;
  word-wrap: break-word;
}
</style>
