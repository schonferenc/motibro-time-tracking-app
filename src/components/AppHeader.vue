<template>
  <q-header elevated>
    <q-toolbar>
      <q-btn
        flat
        dense
        round
        icon="menu"
        aria-label="Menu"
        @click="props.toggleLeftDrawer"
      />
      <q-toolbar-title>{{ props.title }}</q-toolbar-title>
    </q-toolbar>
  </q-header>
</template>

<script setup lang="ts">
// Base
import { defineProps, withDefaults } from 'vue';

// Options
defineOptions({
  name: 'AppHeader',
});

// Props interface
interface Props {
  toggleLeftDrawer: () => void; // Function to toggle the left drawer
  title?: string; // Title of the header
}

// Defining props with default values
const props = withDefaults(defineProps<Props>(), {
  title: 'Motibro Időnyilvántartó App',
});
</script>
