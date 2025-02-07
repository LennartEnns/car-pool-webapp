<template>
  <v-card class="border-card mt-4" width="400px" max-width="90%" variant="elevated">
    <v-card-title class="text-center text-h5 font-weight-bold">
      <span class="headline">{{ cardTitle }}</span>
    </v-card-title>
    <v-checkbox v-if="deletable && !!routes && routes.length > 0" v-model="editMode" class="edit-checkbox" label="Edit" color="black" hide-details />
    <div class="placeholder pa-2 text-center" v-if="!routes || routes.length === 0">You have no routes</div>
    <div class="route-preview pa-2 pl-3" v-for="(route, index) in routes" :key="index" @click="onPreviewClick(route)">
      <v-dialog v-model="showDeleteDialog" width="500px" max-width="90%">
        <template v-slot:activator="{ props: activatorProps }">
          <v-btn v-if="editMode" v-bind="activatorProps" class="icon-button" icon="mdi-minus" density="compact" variant="text" color="error"></v-btn>
        </template>
        <v-card>
          <v-card-title>
            <v-icon color="warning">mdi-alert</v-icon>
            Confirm Deletion
          </v-card-title>
          <v-card-text>
            When you delete this route, all associated rides and costs will also be deleted.
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="showDeleteDialog = false">Cancel</v-btn>
            <v-btn @click="onDeleteConfirm(index)">Confirm</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <div v-if="isUTCInRange(route.startDate, route.endDate)">{{ route.name }}</div>
      <div v-else class="text-grey">{{ route.name }} (Inactive)</div>
      <v-spacer />
      <v-icon>mdi-chevron-right</v-icon>
    </div>
  </v-card>
</template>

<script setup>
  defineProps({
    cardTitle: {
      type: String,
      required: true,
    },
    routes: {
      type: Array,
      required: false,
      default: [],
    },
    deletable: {
      type: Boolean,
      required: false,
      default: false,
    }
  });

  const emit = defineEmits(['delete',]);

  const editMode = ref(false);
  const showDeleteDialog = ref(false);

  async function onPreviewClick(route) {
    await navigateTo(`/routes/${route.routeID}`);
  }
  async function onDeleteConfirm(index) {
    showDeleteDialog.value = false;
    emit('delete', index);
  }

  // Computes whether the current UTC date is within the range of the start and end dates
  const isUTCInRange = (startDate, endDate) => {
    const now = new Date();
    return new Date(startDate) <= now && now <= new Date(endDate);
  };
</script>

<style scoped>
  .route-preview {
    border-top: 1px solid grey;
    font-weight: bold;
    display: flex;
  }
  .route-preview:hover {
    background-color: aliceblue;
    cursor: pointer;
  }
  .edit-checkbox {
    margin-top: -30px;
  }
  .placeholder {
    color: #999;
  }
</style>
