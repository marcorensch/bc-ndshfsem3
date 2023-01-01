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
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}
.modal-container {
  width: 400px;
  height: 250px;
  margin: 300px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.message {
  font-size: 1.5rem;
  font-weight: bold;
  margin-top: 1rem;
}
.btn {
  font-size: 1.5rem;
  background-color: var(--dark);
  border-radius: 2px;
  color: (var(--light));
  padding: 14px 20px;
  margin: 0 auto;
  border: none;
  cursor: pointer;
  width: 50%;
  transition: 0.2s ease-out;


&:hover {
   background-color: var(--primary);
 }
}

</style>