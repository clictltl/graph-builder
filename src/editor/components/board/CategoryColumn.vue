<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Category } from '@/shared/types';
import { useProjectStore } from '@/shared/stores/projectStore';
import NodeCard from './NodeCard.vue';
import CategoryEditModal from '../modals/CategoryEditModal.vue';

const props = defineProps<{
  category: Category;
}>();

const store = useProjectStore();
const myNodes = computed(() => store.nodesByCategory(props.category.id));
const showEditModal = ref(false);

const handleAddNode = () => {
  store.addNode(props.category.id);
};
</script>

<template>
  <div class="category-column">
    <div class="column-header" :style="{ borderTopColor: category.color }">
      <!-- Nome e Cor -->
      <h3 :style="{ color: category.color }">
        {{ category.name }}
      </h3>
      
      <div class="actions">
        <span class="count">{{ myNodes.length }}</span>
        
        <!-- Botão de Edição (Lápis) -->
        <button class="btn-icon" @click="showEditModal = true" title="Editar Categoria">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </button>
      </div>
    </div>

    <div class="column-body">
      <NodeCard 
        v-for="node in myNodes" 
        :key="node.id" 
        :node="node" 
      />
    </div>

    <div class="column-footer">
      <button class="btn-add" @click="handleAddNode">
        + Adicionar Item
      </button>
    </div>

    <!-- Modal de Edição -->
    <CategoryEditModal 
      v-if="showEditModal" 
      :category="category" 
      @close="showEditModal = false" 
    />
  </div>
</template>

<style scoped>
.category-column {
  background: #f1f5f9;
  border-radius: 8px;
  width: 280px;
  min-width: 280px;
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 100%;
  border: 1px solid #e2e8f0;
}

.column-header {
  padding: 12px;
  background: #fff;
  border-radius: 8px 8px 0 0;
  border-top: 3px solid transparent;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e2e8f0;
}

.column-header h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.count {
  background: #e2e8f0;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 600;
}

.btn-icon {
  background: transparent;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.btn-icon:hover {
  background: #f1f5f9;
  color: #3b82f6;
}

.column-body {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.column-footer {
  padding: 10px;
}

.btn-add {
  width: 100%;
  background: transparent;
  border: 1px dashed #cbd5e1;
  color: #64748b;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
  font-size: 0.9rem;
}

.btn-add:hover {
  background: #e2e8f0;
  color: #334155;
}
</style>