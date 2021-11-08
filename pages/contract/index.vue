<template>
  <div class="contract">
    CONTRACT
    <Overview />
    <InfoItem />
  </div>
</template>
<script>
import Overview from '~/components/Overview.vue';
import InfoItem from '~/components/InfoItem.vue';

export default {
  name: 'Contract',
  components: {
    Overview,
    InfoItem,
  },
  data: () => ({
  }),
  computed: {
  },
  async mounted() {
    this.SetLoader(true);
    this.SetLoader(false);
  },
};
</script>
