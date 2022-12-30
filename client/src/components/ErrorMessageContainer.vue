<template>
  <div v-if="string" class="error-message-container"><span>{{string}}</span></div>
</template>

<script>
export default {
  name: "ErrorMessageContainer",
  props: {
    string: {
      type: String,
      required: true
    }
  },
}
</script>

<style lang="scss" scoped>
.error-message-container{
  text-align: center;
  background-color: #f44336;
  border: 1px solid #d93427;
  color: rgb(246, 221, 221);
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
}
</style>