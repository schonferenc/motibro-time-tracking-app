<template>
  <q-page class="q-pa-md">
    <app-table title="Összesített nézet" :rows="timeEntries" />
  </q-page>
</template>

<script setup lang="ts">
import AppTable from 'src/components/AppTable.vue';
import { useTimeEntries } from 'src/composables/useTimeEntries';

const { timeEntries } = useTimeEntries();

</script>

<style scoped lang="scss"></style>
