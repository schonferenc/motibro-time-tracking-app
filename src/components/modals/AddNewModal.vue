<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <!-- Card Text -->
      <q-card-section>
        <div class="text-h6">Új adat felvétele</div>

        <q-form ref="formRef">
          <!-- User Selection -->
          <q-select
            v-model="selectedUser"
            :options="userOptions"
            label="Válassz felhasználót"
            emit-value
            map-options
            :rules="[(val) => !!val || 'Felhasználó kiválasztása kötelező']"
          />

          <!-- Date Input -->
          <q-input
            v-model="entryDate"
            label="Dátum"
            type="date"
            :rules="[(val) => !!val || 'Dátum megadása kötelező']"
          />

          <!-- Start Time Input -->
          <q-input
            v-model="startTime"
            label="Kezdési idő"
            type="time"
            :rules="[(val) => !!val || 'Kezdési idő megadása kötelező']"
          />

          <!-- End Time Input -->
          <q-input
            v-model="endTime"
            label="Befejezési idő"
            type="time"
            :rules="[
              (val) => !!val || 'Befejezési idő megadása kötelező',
              validateEndTime,
            ]"
          />

          <!-- Description Textarea -->
          <q-input
            v-model="description"
            label="Leírás"
            type="textarea"
            :rules="[(val) => !!val || 'Leírás megadása kötelező']"
            rows="3"
          />

          <!-- Tags Selection -->
          <q-select
            v-model="selectedTags"
            :options="tagOptions"
            label="Címkék"
            multiple
            emit-value
            map-options
          />
        </q-form>
      </q-card-section>

      <!-- Card Actions -->
      <q-card-actions align="right">
        <q-btn outline color="positive" label="Mentés" @click="onOKClick" />
        <q-btn outline color="primary" label="Bezár" @click="onDialogCancel" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useDialogPluginComponent } from 'quasar';
import { useStorage } from '@vueuse/core';

defineEmits(['saveEntry', ...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();

const formRef = ref(null);

const selectedUser = ref(null);
const entryDate = ref('');
const startTime = ref('');
const endTime = ref('');
const description = ref('');
const selectedTags = ref([]);

const tagOptions = [
  { label: 'Projekt', value: 'projekt' },
  { label: 'Ügyfél', value: 'ügyfél' },
];

// Fetch user options from localStorage and ensure uniqueness
const users = useStorage('timeEntries', []);

const userOptions = computed(() => {
  if (!users.value || users.value.length === 0) {
    return [];
  }

  const uniqueUsers = Array.from(
    new Set(users.value.map((user) => user.id))
  ).map((id) => users.value.find((user) => user.id === id));

  if (!uniqueUsers || uniqueUsers.length === 0) {
    return [];
  }

  return uniqueUsers.map((user) => ({
    label: user.userName,
    value: user.id,
  }));
});

const validateEndTime = (val) => {
  if (!startTime.value || !val) return true; // Skip validation if either value is empty
  const start = new Date(`1970-01-01T${startTime.value}:00`);
  const end = new Date(`1970-01-01T${val}:00`);
  return (
    end > start || 'A befejezési időnek nagyobbnak kell lennie a kezdési időnél'
  );
};

const onOKClick = () => {
  formRef.value.validate().then((success) => {
    if (success) {
      const newEntry = {
        id: selectedUser.value,
        date: entryDate.value,
        startTime: startTime.value,
        endTime: endTime.value,
        description: description.value,
        userName:
          userOptions.value.find((user) => user.value === selectedUser.value)
            ?.label || '',
        tags: selectedTags.value,
      };
      onDialogOK(newEntry);
    } else {
      console.error('Please fill in all required fields.');
    }
  });
};
</script>
