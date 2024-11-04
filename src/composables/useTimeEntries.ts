import { useStorage } from '@vueuse/core';
import { TimeEntry } from 'src/models/timeEntry';
import { generateDummyTimeEntries } from 'src/utils/dummyTimeEntries';

/**
 * Custom composable for managing time entries.
 */
export function useTimeEntries() {
  // Data storage using localStorage with `useStorage`
  const timeEntries = useStorage<TimeEntry[]>('timeEntries', []);

  /**
   * Initializes the time entries with dummy data if localStorage is empty.
   */
  const initializeTimeEntries = () => {
    if (timeEntries.value.length === 0) {
      timeEntries.value = generateDummyTimeEntries();
    }
  };

  /**
   * Adds a new time entry.
   * @param entry - The time entry to be added, excluding the id.
   * @returns boolean - Indicates if the addition was successful.
   */
  const addEntry = (entry: TimeEntry) => {
    if (!entry || Object.keys(entry).length === 0) {
      return false;
    }

    const newEntry: TimeEntry = {
      ...entry,
    };

    timeEntries.value.unshift(newEntry);
    saveEntries();

    return true;
  };

  /**
   * Updates an existing time entry.
   * @param updatedEntry - The time entry with updated information.
   */
  const updateEntry = (updatedEntry: TimeEntry) => {
    const index = timeEntries.value.findIndex(
      (entry) => entry.id === updatedEntry.id
    );
    
    if (index !== -1) {
      timeEntries.value[index] = updatedEntry;
      saveEntries();
      return true;
    }
    return false;
  };

  /**
   * Deletes a time entry by id.
   * @param entryId - The id of the time entry to be deleted.
   * @returns boolean - Indicates if the deletion was successful.
   */
  const deleteEntry = (entryId: string) => {
    const initialLength = timeEntries.value.length;
    timeEntries.value = timeEntries.value.filter(
      (entry) => entry.id !== entryId
    );
    saveEntries();
    return initialLength > timeEntries.value.length;
  };

  /**
   * Saves the current entries to localStorage.
   */
  const saveEntries = () => {
    localStorage.setItem('timeEntries', JSON.stringify(timeEntries.value));
  };

  return {
    timeEntries,
    initializeTimeEntries,
    addEntry,
    updateEntry,
    deleteEntry,
  };
}
