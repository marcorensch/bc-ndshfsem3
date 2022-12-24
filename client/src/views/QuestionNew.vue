<template>
  <main class="question-page">
    <div class="container">
      <h1>Your Question</h1>
      <div class="editor">
<TextEditor @getContent="saveContent"></TextEditor>
      </div>
      <div class="select-section">
        <ul>
          <li>
            <label for="checkbox">Category: {{ checked }}
              <select v-model="selected">
                <option disabled value="">Please select one</option>
                <option>A</option>
                <option>B</option>
                <option>C</option>
              </select></label>
          </li>
          <li>
            <label for="checkbox">Tags: {{ checked }}</label>
          </li>
          <li>
            <label for="checkbox">  Anonymous: {{ checked }} <input type="checkbox" id="checkbox" v-model="checked"></label>
          </li>
        </ul>

        <button class="btn btn-primary" @click="getContent">confirm</button>

      </div>
    </div>

  </main>
</template>

<script>
import TextEditor from "@/components/TextEditor";
export default {
  name: "QuestionNew",
  components:{
    TextEditor
  },
  data(){
    return {
      content:""
    }
  },
  methods:{
    getContent(){
      console.log(this.content)
    },
    saveContent(){

    }
  }
}
</script>

<style lang="scss" scoped>

.select-section{
  display: flex;
  flex-direction: column;
}

ul{
  list-style: none;
}

.btn{
  font-size: 1rem;
  background-color: var(--dark);
  border-radius: 2px;
  color: (var(--light));
  padding: 14px 20px;
  margin: 10px 10px;
  border: none;
  cursor: pointer;
  width: 200px;
  transition: 0.2s ease-out;

  &:hover {
    background-color: var(--primary);
  }
}
</style>