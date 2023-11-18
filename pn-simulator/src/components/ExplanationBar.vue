<script setup lang="ts">

import {simMode} from "@/simulation";
</script>
<template>
  <el-alert v-if="simMode" title="Simulation mode"
            type="info">
    Click on any active (green) transition to make it fire.
  </el-alert>
  <el-alert v-if="!simMode" title="Edit mode"
            type="info">
    Edit the network or its places, transitions and flow relations.
  </el-alert>
</template>
