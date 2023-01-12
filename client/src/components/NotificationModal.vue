<template>
<Transition class="modal">
  <div v-if="show" class="modal-mask">
    <div class="modal-container">
      <span class="row col justify-content-center message" >{{message}}</span>
      <button @click="$emit('confirm')" class="btn ">OK</button>
    </div>

  </div>


</Transition>


</template>

<script>
export default {
  name: "NotificationModal",
  inject: ['host'],
  props: {
    show: Boolean,
    message: String
  },
}
</script>

<style lang="scss" scoped>

</style>