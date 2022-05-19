<template>
  <el-container>
    <el-header height="50px">
      <h1>Petri-Net Simulator</h1>
    </el-header>
    <el-main>
      <ENS/>
    </el-main>
  </el-container>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import ENS from "@/components/ENS.vue";

@Options({
  components: {
    ENS,
  },
})
export default class App extends Vue {
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  vertical-align: middle;
}
</style>
