<template>
  <PreviewList
  card-icon="mdi-car-multiple"
  :card-title="cardTitle"
  :n-elements="vehicles.length"
  :placeholder="placeholder"
  :deletable="deletable"
  deletion-warning="Routes that use this vehicle will not be able to calculate fuel costs anymore."
  @open="onOpen"
  @delete="onDelete"
  v-slot="{ dataIndex }">
    <div>{{ vehicles[dataIndex].name }}</div>
  </PreviewList>
</template>

<script setup>
  const props = defineProps({
    cardTitle: {
      type: String,
      required: true,
    },
    vehicles: {
      type: Array,
      required: true,
    },
    deletable: {
      type: Boolean,
      required: false,
      default: false,
    },
    placeholder: {
      type: String,
      required: false,
      default: 'You have no vehicles',
    },
  });

  const emit = defineEmits(['delete',]);

  async function onOpen(index) {
    await navigateTo(`/vehicles/${props.vehicles[index].vehicleID}`);
  }
  async function onDelete(index) {
    emit('delete', index);
  }
</script>

<style scoped>

</style>
