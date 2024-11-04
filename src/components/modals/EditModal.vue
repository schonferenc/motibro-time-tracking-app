<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <!-- Card Text -->
      <q-card-section>
        <div class="text-h6">Új adat felvétele</div>

        <q-form ref="formRef">
          <!-- User Nem -->
          <q-input v-model="userName" label="Név" :readonly="true" />

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
import { ref } from 'vue';
import { useDialogPluginComponent } from 'quasar';

// Define props for the modal to accept an entry
const props = defineProps({
  entry: {
    type: Object,
    required: true,
  },
});

// Reactive variables for form fields
const userId = ref(props.entry.id || '');
const userName = ref(props.entry.userName || '');
const entryDate = ref(props.entry.date || '');
const startTime = ref(props.entry.startTime || '');
const endTime = ref(props.entry.endTime || '');
const description = ref(props.entry.description || '');
const selectedTags = ref(props.entry.tags || []);

defineEmits(['saveEntry', ...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();

const formRef = ref(null);

const tagOptions = [
  { label: 'Projekt', value: 'projekt' },
  { label: 'Ügyfél', value: 'ügyfél' },
];

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
        id: userId.value,
        date: entryDate.value,
        startTime: startTime.value,
        endTime: endTime.value,
        description: description.value,
        userName: userName.value,
        tags: selectedTags.value,
      };
      onDialogOK(newEntry);
    } else {
      console.error('Please fill in all required fields.');
    }
  });
};
</script>
