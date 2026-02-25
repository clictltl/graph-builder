<script setup lang="ts">
import { ref, computed } from 'vue';
import { useProjectStore } from '@/shared/stores/projectStore';

const store = useProjectStore();

// Agrupa nós por categoria
const categoriesWithNodes = computed(() => {
  return store.project.categories.map(cat => ({
    ...cat,
    nodes: store.project.nodes.filter(n => n.categoryId === cat.id)
  }));
});

// Estado das categorias abertas (Inicia vazio = todas fechadas)
const expandedCategories = ref<Set<string>>(new Set());

const toggleCategory = (catId: string) => {
  const newSet = new Set(expandedCategories.value);
  if (newSet.has(catId)) {
    newSet.delete(catId);
  } else {
    newSet.add(catId);
  }
  expandedCategories.value = newSet;
};

const handleSelect = (nodeId: string) => {
  store.selectedNodeId = nodeId;
};
</script>

<template>
  <aside class="preview-sidebar">
    <div class="sidebar-header">
      <h2>Índice</h2>
      <!-- Botão para voltar ao início (Visão Global) -->
      <button 
        v-if="store.selectedNodeId" 
        class="btn-home" 
        @click="store.selectedNodeId = null"
      >
        🏠 Ver Grafo Global
      </button>
    </div>
    
    <nav class="sidebar-nav">
      <div 
        v-for="cat in categoriesWithNodes" 
        :key="cat.id" 
        class="nav-group"
      >
        <!-- Cabeçalho Clicável -->
        <h3 
          @click="toggleCategory(cat.id)"
          :style="{ borderLeftColor: cat.color }"
        >
          <span class="cat-name" :style="{ color: cat.color }">{{ cat.name }}</span>
          <span class="chevron" :class="{ open: expandedCategories.has(cat.id) }">▼</span>
        </h3>

        <!-- Lista (Só aparece se estiver expandida) -->
        <ul v-show="expandedCategories.has(cat.id)">
          <li 
            v-for="node in cat.nodes" 
            :key="node.id"
            :class="{ active: store.selectedNodeId === node.id }"
            @click="handleSelect(node.id)"
          >
            {{ node.title }}
          </li>
          <li v-if="cat.nodes.length === 0" class="empty-cat">
            (Vazio)
          </li>
        </ul>
      </div>
    </nav>
  </aside>
</template>

<style scoped>
.preview-sidebar {
  width: 280px;
  min-width: 280px;
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
  background: white;
}

.sidebar-header h2 {
  font-size: 1.1rem;
  margin: 0 0 8px 0;
  color: #334155;
}

.btn-home {
  width: 100%;
  padding: 6px;
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  color: #475569;
  transition: all 0.2s;
}

.btn-home:hover {
  background: #e2e8f0;
  color: #1e293b;
}

.sidebar-nav {
  padding: 10px;
}

.nav-group {
  margin-bottom: 12px;
}

.nav-group h3 {
  font-size: 0.9rem;
  margin: 0 0 4px 0;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  background: white;
  border-radius: 4px;
  border: 1px solid transparent;
  border-left-width: 4px; /* A cor vem do inline style */
  transition: background 0.2s;
}

.nav-group h3:hover {
  background: #fff;
  border-color: #e2e8f0;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

.chevron {
  font-size: 0.7rem;
  color: #94a3b8;
  transition: transform 0.2s;
}

.chevron.open {
  transform: rotate(180deg);
}

ul {
  list-style: none;
  padding: 4px 0 4px 10px;
  margin: 0;
  border-left: 1px solid #e2e8f0;
  margin-left: 12px;
}

li {
  padding: 6px 8px;
  cursor: pointer;
  border-radius: 4px;
  color: #475569;
  font-size: 0.9rem;
  transition: all 0.2s;
  margin-bottom: 2px;
}

li:hover {
  background: #e2e8f0;
  color: #1e293b;
}

li.active {
  background: #dbeafe;
  color: #2563eb;
  font-weight: 600;
}

.empty-cat {
  font-style: italic;
  color: #94a3b8;
  font-size: 0.8rem;
  cursor: default;
}

.empty-cat:hover {
  background: transparent;
}
</style>