<script setup lang="ts">
import { ref, computed } from 'vue';
import { useProjectStore } from '@/shared/stores/projectStore';
import Sidebar from '../components/Navigation.vue';
import GraphView from '../components/GraphCanvas.vue';

const store = useProjectStore();
const graphMode = ref<'local' | 'global'>('local'); // Estado local do componente

const activeNode = computed(() => {
  if (store.selectedNodeId) {
    return store.project.nodes.find(n => n.id === store.selectedNodeId);
  }
  return store.project.nodes[0] || null;
});

const isEmpty = computed(() => store.project.nodes.length === 0);
</script>

<template>
  <div class="preview-layout">
    <Sidebar />

    <main class="content-area">
      <div v-if="isEmpty" class="empty-msg">
        O projeto está vazio.
      </div>

      <div v-else-if="activeNode" class="document-container">
        
        <!-- Container do Grafo com Controles -->
        <div class="graph-section">
          <div class="graph-controls">
            <span>Visualização:</span>
            <button 
              :class="{ active: graphMode === 'local' }" 
              @click="graphMode = 'local'"
            >
              Foco (Local)
            </button>
            <button 
              :class="{ active: graphMode === 'global' }" 
              @click="graphMode = 'global'"
            >
              Todos (Global)
            </button>
          </div>

          <div class="graph-box">
            <!-- Passamos o ID e o MODO -->
            <GraphView 
              :active-node-id="activeNode.id"
              :mode="graphMode" 
            />
          </div>
        </div>

        <article class="markdown-body">
          <h1 class="node-title">{{ activeNode.title }}</h1>
          <div class="node-content">
            <p v-if="!activeNode.content" class="no-content">
              Sem conteúdo.
            </p>
            <div v-else style="white-space: pre-wrap;">{{ activeNode.content }}</div>
          </div>
        </article>

      </div>
    </main>
  </div>
</template>

<style scoped>
.preview-layout {
  display: flex;
  height: 100%;
  width: 100%;
  background: #fff;
}
.content-area {
  flex: 1;
  overflow-y: auto;
  display: flex;
  justify-content: center;
  background: #fff;
}
.document-container {
  width: 100%;
  max-width: 800px;
  padding: 40px;
  display: flex;
  flex-direction: column;
  gap: 30px;
}
.empty-msg {
  margin-top: 50px;
  color: #64748b;
  font-size: 1.2rem;
}

.graph-section {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  background: #f8fafc;
}

.graph-controls {
  padding: 8px 16px;
  border-bottom: 1px solid #e2e8f0;
  background: #fff;
  display: flex;
  gap: 10px;
  align-items: center;
  font-size: 0.9rem;
  color: #64748b;
}

.graph-controls button {
  background: transparent;
  border: 1px solid transparent;
  padding: 4px 12px;
  border-radius: 15px;
  cursor: pointer;
  font-size: 0.85rem;
  color: #64748b;
  transition: all 0.2s;
}

.graph-controls button:hover {
  background: #f1f5f9;
}

.graph-controls button.active {
  background: #e0f2fe;
  color: #0284c7;
  border-color: #bae6fd;
  font-weight: 600;
}

.graph-box {
  height: 350px; /* Altura fixa */
  width: 100%;
}

.node-title {
  font-size: 2.5rem;
  color: #1e293b;
  border-bottom: 2px solid #f1f5f9;
  padding-bottom: 16px;
  margin-bottom: 24px;
}
.node-content {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #334155;
}
.no-content {
  font-style: italic;
  color: #94a3b8;
}
</style>