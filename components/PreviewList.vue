<template>
  <v-card class="border-card mt-4" width="400px" max-width="90%" variant="elevated">
    <v-card-title class="text-center text-h5 font-weight-bold">
      <v-icon class="mr-2">mdi-map</v-icon>
      <span class="headline">{{ cardTitle }}</span>
    </v-card-title>
    <v-checkbox v-if="deletable && !!routes && routes.length > 0" v-model="editMode" class="edit-checkbox" label="Edit" color="black" hide-details />
    <div class="placeholder pa-2 text-center" v-if="!routes || routes.length === 0">{{ placeholder }}</div>
    <div class="route-preview pa-2 pl-3" v-for="(route, index) in routes" :key="index" @click="onPreviewClick(route)">
      <v-dialog v-model="showDeleteDialog" width="500px" max-width="90%">
        <template v-slot:activator="{ props: activatorProps }">
          <v-btn v-if="editMode" v-bind="activatorProps" class="icon-button" icon="mdi-minus" density="compact" variant="text" color="error" v-tooltip="'Delete route'"></v-btn>
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
      <div v-if="isUTCInRange(route.validFrom, route.validTo)">{{ route.name }}</div>
      <div v-else class="text-grey">{{ route.name }} <i>(Inactive)</i></div>
      <v-spacer />
      <v-icon>mdi-chevron-right</v-icon>
    </div>
  </v-card>
</template>

<script setup>
  defineProps({
    cardIcon: {
      type: String,
      required: true,
    },
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
    },
    placeholder: {
      type: String,
      required: false,
      default: 'You have no routes',
    },
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
</script>

<style scoped>
  .route-preview {
    
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
