<script setup lang="ts">
import { computed } from 'vue';
import { useProjectStore } from '../../shared/stores/projectStore';

const store = useProjectStore();

// O nó atualmente selecionado
const activeNode = computed(() => store.activeNode);

// Lista de todos os outros nós (para criar conexões)
const otherNodes = computed(() => {
  if (!activeNode.value) return [];
  
  return store.project.nodes.filter(n => {
    // Regra 1: Não pode conectar consigo mesmo
    const isSelf = n.id === activeNode.value!.id;
    
    // Regra 2: Não pode conectar com nós da MESMA categoria
    const isSameCategory = n.categoryId === activeNode.value!.categoryId;
    
    return !isSelf && !isSameCategory;
  });
});

// Verifica se já existe conexão com um nó específico
const isConnected = (targetId: string) => {
  if (!activeNode.value) return false;
  return store.project.edges.some(e => 
    (e.source === activeNode.value!.id && e.target === targetId) ||
    (e.source === targetId && e.target === activeNode.value!.id) // Considerando bidirecional visualmente
  );
};

// Alterna a conexão (Cria ou Remove)
const toggleConnection = (targetId: string) => {
  if (!activeNode.value) return;
  const sourceId = activeNode.value.id;

  if (isConnected(targetId)) {
    // Remover conexão (precisamos adicionar essa action na store depois se quiser remover, 
    // mas por enquanto vamos focar em adicionar, ou filtrar manualmente)
    store.project.edges = store.project.edges.filter(e => 
      !(e.source === sourceId && e.target === targetId) &&
      !(e.source === targetId && e.target === sourceId)
    );
  } else {
    // Adicionar conexão
    store.addEdge(sourceId, targetId);
  }
};

const handleDelete = () => {
  if (activeNode.value && confirm('Tem certeza que deseja excluir este item?')) {
    store.deleteNode(activeNode.value.id);
  }
};
</script>

<template>
  <div class="properties-panel">
    
    <!-- Estado: Nenhum nó selecionado -->
    <div v-if="!activeNode" class="empty-state">
      <p>Selecione um item para editar</p>
    </div>

    <!-- Estado: Editando nó -->
    <div v-else class="edit-form">
      <div class="header">
        <h2>Editar Item</h2>
        <button class="btn-delete" @click="handleDelete">Excluir</button>
      </div>

      <div class="form-group">
        <label>Título</label>
        <input 
          v-model="activeNode.title" 
          type="text" 
          placeholder="Nome do conceito"
        />
      </div>

      <div class="form-group">
        <label>Conteúdo</label>
        <textarea 
          v-model="activeNode.content" 
          rows="6" 
          placeholder="Escreva aqui o conteúdo..."
        ></textarea>
        <small>Aceita Markdown simples.</small>
      </div>

      <div class="form-group">
        <label>Conexões</label>
        <div class="connections-list">
          <p v-if="otherNodes.length === 0" class="hint">
            Crie outros itens para poder conectar.
          </p>
          
          <div 
            v-for="node in otherNodes" 
            :key="node.id" 
            class="connection-item"
          >
            <label>
              <input 
                type="checkbox" 
                :checked="isConnected(node.id)" 
                @change="toggleConnection(node.id)"
              />
              {{ node.title }}
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.properties-panel {
  width: 300px;
  background: white;
  border-left: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.empty-state {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  padding: 20px;
  text-align: center;
}

.edit-form {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.header {
  padding: 16px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header h2 {
  margin: 0;
  font-size: 1.1rem;
  color: #334155;
}

.btn-delete {
  background: #fee2e2;
  color: #ef4444;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
}

.form-group {
  padding: 16px;
  border-bottom: 1px solid #f1f5f9;
}

.form-group label {
  display: block;
  font-weight: 600;
  font-size: 0.85rem;
  margin-bottom: 8px;
  color: #475569;
}

input[type="text"], textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  font-size: 0.9rem;
  font-family: inherit;
}

input[type="text"]:focus, textarea:focus {
  outline: none;
  border-color: #3b82f6;
}

.connections-list {
  max-height: 200px;
  overflow-y: auto;
  background: #f8fafc;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #e2e8f0;
}

.connection-item {
  margin-bottom: 6px;
  font-size: 0.9rem;
}

.connection-item label {
  font-weight: normal;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}

small, .hint {
  display: block;
  margin-top: 4px;
  color: #94a3b8;
  font-size: 0.8rem;
}
</style>