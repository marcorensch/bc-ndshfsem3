<template>
<QuillEditor theme="snow" toolbar="essential" @change="getContent"  ></QuillEditor>
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
      content: {

      },
    }
  },
  methods:{
  getContent(){
  this.$emit('getContent', this.getContent() )
  }
  }
}
</script>

<style scoped>

</style>