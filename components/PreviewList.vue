<template>
  <v-card class="border-card mt-4" max-width="90%" variant="elevated">
    <v-card-title class="text-center text-h5 font-weight-bold">
      <v-icon class="mr-2">{{ cardIcon }}</v-icon>
      <span class="headline">{{ cardTitle }}</span>
    </v-card-title>
    <v-checkbox v-if="deletable && nElements > 0" v-model="editMode" class="edit-checkbox" label="Edit" color="black" hide-details />
    <div class="placeholder pa-2 text-center" v-if="nElements === 0">{{ placeholder }}</div>
    <div class="preview pa-2 pl-3" v-for="index in nElements" :key="index" @click="emit('open', index - 1)">
      <v-btn v-if="editMode" icon="mdi-minus" density="compact" variant="text" color="error" v-tooltip="'Delete'" @click.stop="startDelete(index - 1)"></v-btn>

      <slot :dataIndex="index - 1" />
      <v-spacer />
      <v-icon>mdi-chevron-right</v-icon>

    </div>
    <v-dialog v-model="showDeleteDialog" width="500px" max-width="90%">
      <v-card>
        <v-card-title>
          <v-icon color="warning">mdi-alert</v-icon>
          Confirm Deletion
        </v-card-title>
        <v-card-text>
          {{ deletionWarning }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="showDeleteDialog = false">Cancel</v-btn>
          <v-btn @click="onDeleteConfirm()">Confirm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
    nElements: {
      type: Number,
      required: true,
    },
    placeholder: {
      type: String,
      required: true,
    },
    deletable: {
      type: Boolean,
      required: false,
      default: false,
    },
    deletionWarning: {
      type: String,
      required: false,
      default: 'Before you play with fire, do think twice!',
    },
  });

  const emit = defineEmits(['delete', 'open']);

  const editMode = ref(false);
  const showDeleteDialog = ref(false);
  let indexToDelete = null;

  async function startDelete(index) {
    indexToDelete = index;
    showDeleteDialog.value = true;
  }
  async function onDeleteConfirm() {
    showDeleteDialog.value = false;
    console.log(indexToDelete);
    emit('delete', indexToDelete);
  }
</script>

<style scoped>
  .preview {
    font-weight: bold;
    display: flex;
  }
  .preview:hover {
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
