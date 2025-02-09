<template>
  <PreviewList
  card-icon="mdi-map"
  :card-title="cardTitle"
  :n-elements="routeData.length"
  :placeholder="placeholder"
  :deletable="deletable"
  deletion-warning="When you delete this route, all associated rides and costs will also be deleted."
  @open="onOpen"
  @delete="onDelete"
  v-slot="{ dataIndex }">
    <div v-if="isUTCInRange(routeData[dataIndex].validFrom, routeData[dataIndex].validTo)">{{ routeData[dataIndex].name }}</div>
    <div v-else class="text-grey">{{ routeData[dataIndex].name }} <i>(Inactive)</i></div>
  </PreviewList>
</template>

<script setup>
  const props = defineProps({
    cardTitle: {
      type: String,
      required: true,
    },
    routeData: {
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
      default: 'You have no routes',
    },
  });

  const emit = defineEmits(['delete',]);

  async function onOpen(index) {
    await navigateTo(`/routes/${props.routeData[index].routeID}`);
  }
  async function onDelete(index) {
    emit('delete', index);
  }

  // Computes whether the current UTC date is within the range of the start and end dates
  const isUTCInRange = (startDate, endDate) => {
    const now = new Date();
    return (!startDate || new Date(startDate) <= now) && (!endDate || now <= new Date(endDate));
  };
</script>

<style scoped>

</style>
