<script setup lang="ts">
import { ref } from 'vue';
import { useProjectStore } from '@/shared/stores/projectStore';
import CategoryColumn from '@/editor/components/board/CategoryColumn.vue';
import PropertiesPanel from '@/editor/components/panels/PropertiesPanel.vue';
import CategoryEditModal from '@/editor/components/modals/CategoryEditModal.vue';

const store = useProjectStore();
const showCreateModal = ref(false);

</script>

<template>
  <div class="editor-layout">
    
    <div class="board-container">
      <div class="board-canvas">
        <CategoryColumn 
          v-for="cat in store.project.categories" 
          :key="cat.id" 
          :category="cat" 
        />

        <!-- Botão agora abre o Modal -->
        <div class="add-column-placeholder">
          <button @click="showCreateModal = true">
            + Nova Categoria
          </button>
        </div>
      </div>
    </div>

     <!-- Área Direita: Painel de Propriedades (Fixo) -->
    <div class="panel-container">
      <PropertiesPanel />
    </div>
     
    <!-- Modal de Criação (Sem passar categoria = Modo Criação) -->
    <CategoryEditModal 
      v-if="showCreateModal" 
      @close="showCreateModal = false" 
    />

  </div>
</template>

<style scoped>
.editor-layout {
  display: flex;
  height: 100%;
  overflow: hidden;
  background-color: #f8fafc;
}

.board-container {
  flex: 1; 
  overflow-x: auto; 
  background-image: radial-gradient(#cbd5e1 1px, transparent 1px);
  background-size: 20px 20px;
  padding: 20px;
}

.board-canvas {
  display: flex;
  gap: 16px;
  height: 100%;
  align-items: flex-start;
  padding-right: 40px;
}

.panel-container {
  width: 360px;
  min-width: 360px;
  background: white;
  box-shadow: -5px 0 25px rgba(0,0,0,0.05);
  z-index: 20;
  display: flex;
  flex-direction: column;
}

.add-column-placeholder {
  min-width: 280px;
}

.add-column-placeholder button {
  width: 100%;
  padding: 12px;
  background: rgba(255,255,255,0.6);
  border: 2px dashed #cbd5e1;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  color: #64748b;
  transition: all 0.2s;
}

.add-column-placeholder button:hover {
  background: white;
  border-color: #94a3b8;
  color: #334155;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
}
</style>