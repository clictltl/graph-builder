<script setup lang="ts">
import { computed } from 'vue';
import type { Category } from '@/shared/types';
import { useProjectStore } from '@/shared/stores/projectStore';
import NodeCard from './NodeCard.vue';

const props = defineProps<{
  category: Category;
}>();

const store = useProjectStore();

const myNodes = computed(() => store.nodesByCategory(props.category.id));

const handleAddNode = () => {
  store.addNode(props.category.id);
};

// Renomear ao clicar duas vezes
const handleRename = () => {
  const newName = prompt('Novo nome da categoria:', props.category.name);
  if (newName && newName.trim() !== '') {
    store.updateCategory(props.category.id, newName);
  }
};

// Excluir categoria
const handleDelete = () => {
  if (confirm(`Tem certeza que deseja excluir "${props.category.name}" e todos os seus itens?`)) {
    store.deleteCategory(props.category.id);
  }
};
</script>

<template>
  <div class="category-column">
    <div class="column-header" :style="{ borderTopColor: category.color }">
      <!-- Título clicável -->
      <h3 @dblclick="handleRename" title="Duplo clique para renomear">
        {{ category.name }}
      </h3>
      
      <div class="actions">
        <span class="count">{{ myNodes.length }}</span>
        <button class="btn-delete-cat" @click="handleDelete" title="Excluir Categoria">
          &times;
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
  cursor: text;
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
  font-size: 0.8rem;
  color: #64748b;
}

.btn-delete-cat {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 1.2rem;
  cursor: pointer;
  line-height: 1;
  padding: 0 4px;
}

.btn-delete-cat:hover {
  color: #ef4444;
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
}

.btn-add:hover {
  background: #e2e8f0;
  color: #334155;
}
</style>