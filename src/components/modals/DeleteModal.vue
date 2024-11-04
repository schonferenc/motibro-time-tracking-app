<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <!-- Card Text -->
      <q-card-section>
        <div class="text-h6">Törlés</div>
        <div class="text-subtitle2">Biztosan tötölni szeretné?</div>
      </q-card-section>

      <!-- Card Actions -->
      <q-card-actions align="right">
        <q-btn outline color="negative" label="Törlés" @click="onOKClick" />
        <q-btn outline color="primary" label="Bezár" @click="onDialogCancel" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent } from 'quasar';

defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();

const onOKClick = () => {
  onDialogOK();
};
</script>
