<template>
<QuillEditor theme="snow" toolbar="essential" v-model="text" />
  <button @click="getFieldContent">Get</button>
</template>

<script>
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';


export default {
  name: "TextEditor",
  components:{
    QuillEditor
  },
  data(){
    return {
      text:""
    }
  },
  methods:{
    getFieldContent(){
      console.log(this.text)
    }
  }
}
</script>

<style scoped>

</style>