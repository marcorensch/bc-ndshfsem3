<template>
  <div v-if="string" class="error-message-container">
    <span>
      {{ string }}
    </span>
  </div>
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

</style>