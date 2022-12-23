<template>
<main class="user-overview-page container" >
  <div class="header row text-center">
    <h1 class="col-6">My Account</h1>
    <button class="btn edit-button col-6">Edit My Data</button>
  </div>

  <div class="title row text-center">
    <h3 class="col-6">My Questions</h3>
    <h3 class="col-6">My Answers</h3>
  </div>
  <div class="question-list row text-center">
    <div class="col-6">
   <ul>
     <li>
       <span class="list-item">Question 1</span>
     </li>
     <li>
       <span class="list-item">Question 2</span>
     </li>
     <li>
       <span class="list-item">Question 3</span>
     </li>
     <li>
       <span class="list-item">Question 4</span>
     </li>
   </ul>
    </div>

    <div class="col-6">
      <ul>
        <li>
          <span class="list-item">Answer 1</span>
        </li>
        <li>
          <span class="list-item">Answer 2</span>
        </li>
        <li>
          <span class="list-item">Answer 3</span>
        </li>
        <li>
          <span class="list-item">Answer 4</span>
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
  justify-content: center;
  flex-direction:column;
  padding: 2rem 2rem;

}
ul{
  list-style: none;
  li{

    margin: 20px 30px;
  }
}
.list-item {
  background-color: var(--primary);
  font-size: 1.5rem;
  margin: 20px 30px;
}

.header{
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;

}

.title {

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