<script setup lang="ts">
import { useProjectStore } from '@/shared/stores/projectStore';
import CategoryColumn from '@/editor/components/board/CategoryColumn.vue';
import PropertiesPanel from '@/editor/components/panels/PropertiesPanel.vue';

const store = useProjectStore();

if (store.project.categories.length === 0) {
  store.addCategory('Início');
}

const handleNewCategory = () => {
  const name = prompt('Nome da nova categoria:', 'Nova Seção');
  if (name) {
    store.addCategory(name);
  }
};
</script>

<template>
  <div class="editor-layout">
    
    <!-- Área Esquerda: O Board (Scroll Horizontal) -->
    <div class="board-container">
      <div class="board-canvas">
        <CategoryColumn 
          v-for="cat in store.project.categories" 
          :key="cat.id" 
          :category="cat" 
        />

        <div class="add-column-placeholder">
          <button @click="handleNewCategory">
            + Nova Categoria
          </button>
        </div>
      </div>
    </div>

    <!-- Área Direita: Painel de Propriedades (Fixo) -->
    <div class="panel-container">
      <PropertiesPanel />
    </div>

  </div>
</template>

<style scoped>
.editor-layout {
  display: flex;
  height: 100%; /* Ocupa toda a altura disponível do main */
  overflow: hidden;
}

.board-container {
  flex: 1; /* Ocupa o espaço restante */
  overflow-x: auto; /* Scroll horizontal nas colunas */
  background-image: radial-gradient(#e5e7eb 1px, transparent 1px);
  background-size: 20px 20px;
  padding: 20px;
}

.board-canvas {
  display: flex;
  gap: 16px;
  height: 100%;
  align-items: flex-start;
}

.panel-container {
  width: 300px;
  min-width: 300px;
  border-left: 1px solid #ddd;
  background: white;
  z-index: 10;
}

.add-column-placeholder {
  min-width: 280px;
}

.add-column-placeholder button {
  width: 100%;
  padding: 12px;
  background: rgba(255,255,255,0.5);
  border: 2px dashed #cbd5e1;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  color: #64748b;
}

.add-column-placeholder button:hover {
  background: white;
  border-color: #94a3b8;
}
</style>