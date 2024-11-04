<template>
  <q-page class="q-pa-md">
    <q-table
      :grid="$q.screen.xs || $q.screen.sm"
      :rows="filteredTimeEntries"
      :columns="columns"
      :title="title"
      rows-per-page-label="Sorok száma oldalanként"
      row-key="id"
      class="q-mb-md"
      :wrap-cells="true"
    >
      <!-- Header -->
      <template v-slot:top-right>
        <q-btn
          round
          unelevated
          color="secondary"
          icon="add"
          @click="onAddNew()"
        >
          <q-tooltip class="bg-secondary">Új bejegyzés</q-tooltip>
        </q-btn>
      </template>

      <!-- Username -->
      <template v-slot:body-cell-userName="props">
        <q-td :props="props">
          <div>
            {{ props.row.userName }}
          </div>

          <!-- Tags -->
          <div
            v-if="props.row.tags && props.row.tags.length > 0"
            class="q-gutter-xs"
          >
            <q-chip
              v-for="(tag, index) in props.row.tags"
              :key="index"
              size="xs"
              color="light-grey"
            >
              {{ tag }}
            </q-chip>
          </div>
        </q-td>
      </template>

      <!-- Grid View -->
      <template v-slot:item="props">
        <div
          class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
        >
          <q-card bordered flat>
            <q-list dense>
              <q-item v-for="col in props.cols" :key="col.name">
                <q-item-section>
                  <q-item-label>{{ col.label }}</q-item-label>
                </q-item-section>

                <!-- Grid View Tagged Name -->
                <q-item-section side v-if="col.name === 'userName'">
                  <q-item-label caption>
                    <div>
                      {{ col.value }}
                    </div>
                    <div
                      v-if="props.row.tags && props.row.tags.length > 0"
                      class="q-gutter-xs"
                    >
                      <q-chip
                        v-for="(tag, index) in props.row.tags"
                        :key="index"
                        size="xs"
                        color="light-grey"
                      >
                        {{ tag }}
                      </q-chip>
                    </div>
                  </q-item-label>
                </q-item-section>

                <!-- Grid View Actions -->
                <q-item-section side v-if="col.name === 'actions'">
                  <q-item-label caption>
                    <q-btn
                      round
                      flat
                      size="sm"
                      icon="edit"
                      @click="onUpdate(props.row)"
                    />
                    <q-btn
                      round
                      flat
                      size="sm"
                      icon="delete"
                      @click="onDelete(props.row.id)"
                    />
                  </q-item-label>
                </q-item-section>

                <q-item-section
                  side
                  v-if="col.name !== 'userName' && col.name !== 'actions'"
                >
                  <q-item-label caption>{{ col.value }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </div>
      </template>

      <!-- Description -->
      <template v-slot:body-cell-description="props">
        <q-td :props="props" style="max-width: 100px; overflow: hidden">{{
          props.row.description
        }}</q-td>
      </template>

      <!-- Actions -->
      <template v-slot:body-cell-actions="props">
        <q-td class="q-pa-md q-gutter-sm" :props="props">
          <q-btn
            round
            flat
            size="sm"
            icon="edit"
            @click="onUpdate(props.row)"
          />
          <q-btn
            round
            flat
            size="sm"
            icon="delete"
            @click="onDelete(props.row.id)"
          />
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script setup lang="ts">
import { withDefaults, defineProps, computed } from 'vue';
import { date, Dialog, Notify, QTableColumn } from 'quasar';

// Components
import AddNewModal from 'src/components/modals/AddNewModal.vue';
import DeleteModal from 'src/components/modals/DeleteModal.vue';
import EditModal from 'src/components/modals/EditModal.vue';

// Composables
import { useTimeEntries } from 'src/composables/useTimeEntries';

// Modles
import { TimeEntry } from 'src/models/timeEntry';

// Props
const props = withDefaults(
  defineProps<{
    view?: 'daily' | 'weekly' | 'monthly';
    title?: string;
    columns?: QTableColumn[];
  }>(),
  {
    columns: () => [
      {
        name: 'userName',
        label: 'Felhasználó neve',
        align: 'left',
        field: 'userName',
      },
      {
        name: 'date',
        label: 'Dátum',
        align: 'left',
        field: 'date',
        format: (prop) => date.formatDate(prop, 'YYYY-MM-DD'),
      },
      {
        name: 'startTime',
        label: 'Kezdési idő',
        align: 'left',
        field: 'startTime',
        format: (prop) => date.formatDate(`1970-01-01 ${prop}`, 'HH:mm'),
      },
      {
        name: 'endTime',
        label: 'Befejezési idő',
        align: 'left',
        field: 'endTime',
        format: (prop) => date.formatDate(`1970-01-01 ${prop}`, 'HH:mm'),
      },
      {
        name: 'description',
        label: 'Feladat leírása',
        align: 'left',
        field: 'description',
      },
      {
        name: 'actions',
        label: 'Műveletek',
        align: 'center',
        field: 'actions',
      },
    ],
  }
);

// Composables
const { timeEntries, updateEntry, deleteEntry, addEntry } = useTimeEntries();

// Filter Views
const filteredTimeEntries = computed(() => {
  if (props.view === 'daily') {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    return timeEntries.value.filter((entry) => {
      const entryDate = new Date(entry.date);
      return entryDate >= startOfDay && entryDate <= endOfDay;
    });
  } else if (props.view === 'weekly') {
    const today = new Date();
    const startOfWeek = new Date(
      today.setDate(today.getDate() - today.getDay())
    );
    const endOfWeek = new Date(today.setDate(startOfWeek.getDate() + 6));

    return timeEntries.value.filter((entry) => {
      const entryDate = new Date(entry.date);
      return entryDate >= startOfWeek && entryDate <= endOfWeek;
    });
  } else if (props.view === 'monthly') {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    return timeEntries.value.filter((entry) => {
      const entryDate = new Date(entry.date);
      return entryDate >= startOfMonth && entryDate <= endOfMonth;
    });
  }
  return timeEntries.value;
});

// CRUD
const onAddNew = () => {
  Dialog.create({
    component: AddNewModal,
  }).onOk((entry: TimeEntry) => {
    const success = addEntry(entry);
    Notify.create({
      message: success ? 'Sikeres mentés' : 'Hiba történt a mentés során',
      timeout: 1500,
      color: success ? 'positive' : 'negative',
    });
  });
};

const onUpdate = (entry: TimeEntry) => {
  Dialog.create({
    component: EditModal,
    componentProps: { entry },
  }).onOk((e: TimeEntry) => {
    const success = updateEntry(e);
    Notify.create({
      message: success ? 'Sikeres módosítás' : 'Hiba történt a módosítás során',
      timeout: 1500,
      color: success ? 'positive' : 'negative',
    });
  });
};

const onDelete = (id: string) => {
  Dialog.create({
    component: DeleteModal,
  }).onOk(() => {
    const success = deleteEntry(id);
    Notify.create({
      message: success ? 'Sikeres törlés' : 'Hiba történt a törlés során',
      timeout: 1500,
      color: success ? 'positive' : 'negative',
    });
  });
};
</script>

<style scoped lang="scss">
.q-table {
  width: 100%;
}

.q-item__section--main {
  min-width: min-content;

  ~ .q-item__section--side {
    max-width: max-content;
  }
}
</style>
