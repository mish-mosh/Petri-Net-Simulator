<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import ENS from "@/components/ENS.vue";
import HeaderComponent from "@/components/HeaderComponent.vue";
import FooterComponent from './components/FooterComponent.vue';

@Options({
  components: {
    ENS,
    HeaderComponent,
    FooterComponent,
  },
})
export default class App extends Vue {
}
</script>

<template>
  <el-container>
    <el-header height="50px">
      <HeaderComponent />
    </el-header>
    <el-main>
      <ENS />
    </el-main>
    <el-footer height="50px">
      <FooterComponent />
    </el-footer>
  </el-container>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  vertical-align: middle;
}
</style>
