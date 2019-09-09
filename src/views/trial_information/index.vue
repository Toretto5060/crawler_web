<template>
  <div class="app-container">
    <h5>haha</h5>
  </div>
</template>

<script>
import { getCourt } from '../../api/index'
export default {
  data() {
    return {

    }
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      getCourt().then((res)=>{

      })
    }
  }
}
</script>
