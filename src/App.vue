<script setup lang="ts">
import { ref } from 'vue';
import BoardView from './modules/Editor/BoardView.vue';
import GraphView from './modules/Preview/GraphView.vue';

const isPreview = ref(false);
</script>

<template>
  <div class="app-root">
    <header class="top-bar">
      <h1>Graph Builder</h1>
      <button @click="isPreview = !isPreview">
        {{ isPreview ? 'Voltar para Editor' : 'Ver Preview' }}
      </button>
    </header>

    <main>
      <!-- Modo Editor -->
      <BoardView v-if="!isPreview" /> 
      
      <!-- Modo Preview (Grafo) -->
      <!-- Usamos v-if para garantir que ele recrie o grafo ao abrir -->
      <GraphView v-else /> 
    </main>
  </div>
</template>

<style>
/* Reset básico */
html, body, #app {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f8f9fa;
  color: #333;
}

.app-root {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.top-bar {
  background: #fff;
  border-bottom: 1px solid #ddd;
  padding: 0.5rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

main {
  flex: 1;
  padding: 20px;
  overflow: auto;
}
</style>