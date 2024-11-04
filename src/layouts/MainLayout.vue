<template>
  <q-layout view="lHh Lpr lFf">
    <app-header :toggleLeftDrawer="toggleLeftDrawer" />

    <app-drawer
      :linksList="linksList"
      :isOpen="leftDrawerOpen"
      v-model="leftDrawerOpen"
    />

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AppHeader from 'src/components/AppHeader.vue';
import AppDrawer from 'src/components/AppDrawer.vue';
import { AppDrawerLinkProps } from 'src/components/AppDrawerLink.vue';
import { useQuasar } from 'quasar';
import { useTimeEntries } from 'src/composables/useTimeEntries';
import { onMounted } from 'vue';

const { initializeTimeEntries } = useTimeEntries();

// Initialize time entries on component mount
onMounted(() => {
  initializeTimeEntries();
});

// Links for the app drawer
const linksList: AppDrawerLinkProps[] = [
  {
    title: 'Összesített nézet',
    caption: 'Feladatok megtekintése az összesített nézetben',
    icon: 'view_list',
    link: '/',
  },
  {
    title: 'Napi nézet',
    caption: 'Feladatok megtekintése napi nézetben',
    icon: 'today',
    link: '/daily',
  },
  {
    title: 'Heti nézet',
    caption: 'Feladatok megtekintése heti nézetben',
    icon: 'calendar_today',
    link: '/weekly',
  },
  {
    title: 'Havi nézet',
    caption: 'Feladatok megtekintése havi nézetben',
    icon: 'calendar_month',
    link: '/monthly',
  },
];

const { screen } = useQuasar();
const leftDrawerOpen = ref(screen.gt.md);

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};
</script>
