<template>
<main class="user-overview-page container" >
  <div class="header row">
    <h1 class="col-6">My Account</h1>
    <button class="btn edit-button col-6">Edit My Data</button>
  </div>

  <div class="title row">
    <h3 class="col-6">My Questions</h3>
    <h3 class="col-6">My Answers</h3>
  </div>
  <div class="question-list row">
    <div class="col-6">
   <ul>
     <li>
       <h5>Question 1</h5>
     </li>
     <li>
       <h5>Question 2</h5>
     </li>
     <li>
       <h5>Question 3</h5>
     </li>
     <li>
       <h5>Question 4</h5>
     </li>
   </ul>
    </div>
    <div class="col-6">
      <ul>
        <li>
          <h5>Answer 1</h5>
        </li>
        <li>
          <h5>Answer 2</h5>
        </li>
        <li>
          <h5>Answer 3</h5>
        </li>
        <li>
          <h5>Answer 4</h5>
        </li>
      </ul>
  </div>
  </div>
</main>
</template>

<script>
export default {
  name: "UserCockpitOverview"
}
</script>

<style lang="scss" scoped>

.user-overview-page{
  display: flex;
  flex-direction:column;
  padding: 2rem 2rem;

}

.header{
  display: flex;
  margin-bottom: 2rem;

}

.btn{
  font-size: 1.5rem;
  background-color: var(--dark);
  border-radius: 2px;
  color: (var(--light));
  padding: 14px 20px;
  border: none;
  cursor: pointer;
  width: 200px;


  &:hover {
    background-color: var(--primary);
    transition: 0.3s ease-out;
  }
}

</style>