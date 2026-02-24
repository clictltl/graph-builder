<script setup lang="ts">
import { computed } from 'vue';
import { useProjectStore } from '@/shared/stores/projectStore';

const store = useProjectStore();

// Agrupa nós por categoria para facilitar a renderização
const categoriesWithNodes = computed(() => {
  return store.project.categories.map(cat => ({
    ...cat,
    nodes: store.project.nodes.filter(n => n.categoryId === cat.id)
  }));
});

const handleSelect = (nodeId: string) => {
  store.selectedNodeId = nodeId; // Usamos o mesmo estado do editor por enquanto
};
</script>

<template>
  <aside class="preview-sidebar">
    <div class="sidebar-header">
      <h2>Índice</h2>
    </div>
    
    <nav class="sidebar-nav">
      <div 
        v-for="cat in categoriesWithNodes" 
        :key="cat.id" 
        class="nav-group"
      >
        <h3 :style="{ color: cat.color }">{{ cat.name }}</h3>
        <ul>
          <li 
            v-for="node in cat.nodes" 
            :key="node.id"
            :class="{ active: store.selectedNodeId === node.id }"
            @click="handleSelect(node.id)"
          >
            {{ node.title }}
          </li>
        </ul>
      </div>
    </nav>
  </aside>
</template>

<style scoped>
.preview-sidebar {
  width: 250px;
  min-width: 250px;
  background: #f8fafc;
  border-right: 1px solid #e2e8f0;
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.sidebar-header h2 {
  font-size: 1.1rem;
  margin: 0;
  color: #334155;
}

.sidebar-nav {
  padding: 16px;
}

.nav-group {
  margin-bottom: 20px;
}

.nav-group h3 {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 8px 0;
  font-weight: 700;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  padding: 6px 8px;
  cursor: pointer;
  border-radius: 4px;
  color: #475569;
  font-size: 0.95rem;
  transition: all 0.2s;
}

li:hover {
  background: #e2e8f0;
  color: #1e293b;
}

li.active {
  background: #dbeafe; /* Azul claro */
  color: #2563eb;
  font-weight: 600;
}
</style>