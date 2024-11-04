<template>
  <q-drawer v-model="isOpen" show-if-above bordered>
    <q-list>
      <q-item-label header>{{ props.header }}</q-item-label>
      <app-drawer-link
        v-for="link in linksList"
        :key="link.title"
        v-bind="link"
      />
    </q-list>
  </q-drawer>
</template>

<script setup lang="ts">
// Base
import { defineProps, ref, withDefaults, watch, defineEmits } from 'vue';

// Components
import AppDrawerLink, {
  AppDrawerLinkProps,
} from 'components/AppDrawerLink.vue';

// Options
defineOptions({
  name: 'AppDrawer',
});

// Props interface
interface Props {
  linksList: AppDrawerLinkProps[]; // Expect an array of app drawer links
  isOpen: boolean; // Prop to control the drawer open state
  header?: string; // Prop for the drawer header
}

// Defining props with default values
const props = withDefaults(defineProps<Props>(), {
  header: 'Nézetek',
});

// Local ref for drawer open state
const isOpen = ref<boolean>(props.isOpen);

// Define emits
const emit = defineEmits<{
  (e: 'update:isOpen', value: boolean): void;
}>();

// Watch for prop changes to update local state
watch(
  () => props.isOpen,
  (newValue) => {
    isOpen.value = newValue;
    emit('update:isOpen', newValue);
  }
);
</script>
