<template>
  <q-item exact :to="props.link">
    <q-item-section v-if="props.icon" avatar>
      <q-icon :name="props.icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ props.title }}</q-item-label>
      <q-item-label caption>{{ props.caption }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
// Options
defineOptions({
  name: 'AppDrawerLink', // Name of the component
});

// Props interface
export interface AppDrawerLinkProps {
  title: string; // Title of the link
  caption?: string; // Optional caption for additional information
  link?: string; // URL for the link
  icon?: string; // Icon name to display
}

// Defining props with default values
const props = withDefaults(defineProps<AppDrawerLinkProps>(), {
  caption: '',
  link: '#',
  icon: '',
});
</script>
