<!-- src/modules/Preview/GraphView.vue -->
<script setup lang="ts">
import { onMounted, ref, onUnmounted, watch } from 'vue';
import cytoscape from 'cytoscape';
import { useProjectStore } from '@/shared/stores/projectStore';

const props = defineProps<{
  activeNodeId?: string; // Opcional, pois no modo global pode não ter foco
  mode?: 'local' | 'global';
}>();

const store = useProjectStore();
const cyContainer = ref<HTMLElement | null>(null);
let cyInstance: cytoscape.Core | null = null;

// --- Lógica de Filtro de Dados ---

const getFilteredElements = () => {
  const allNodes = store.project.nodes;
  const allEdges = store.project.edges;

  // 1. Se for GLOBAL ou sem ID ativo, retorna tudo
  if (props.mode === 'global' || !props.activeNodeId) {
    return [
      ...allNodes.map(n => mapNodeToCy(n)),
      ...allEdges.map(e => mapEdgeToCy(e))
    ];
  }

  // 2. Se for LOCAL, filtra vizinhos (Profundidade 1)
  const centerId = props.activeNodeId;
  
  // Acha arestas conectadas ao centro
  const connectedEdges = allEdges.filter(e => 
    e.source === centerId || e.target === centerId
  );

  // Acha IDs dos nós vizinhos + o próprio centro
  const neighborIds = new Set<string>();
  neighborIds.add(centerId);
  connectedEdges.forEach(e => {
    neighborIds.add(e.source);
    neighborIds.add(e.target);
  });

  // Filtra os nós finais
  const filteredNodes = allNodes.filter(n => neighborIds.has(n.id));

  return [
    ...filteredNodes.map(n => mapNodeToCy(n)),
    ...connectedEdges.map(e => mapEdgeToCy(e))
  ];
};

// --- Helpers de Mapeamento ---

const mapNodeToCy = (n: any) => {
  const category = store.project.categories.find(c => c.id === n.categoryId);
  return {
    data: { 
      id: n.id, 
      label: n.title,
      color: category ? category.color : '#888' 
    },
    // Trava a posição do nó central no layout local para não "pular" muito
    // (Opcional, mas ajuda na UX)
    classes: n.id === props.activeNodeId ? 'center-node' : ''
  };
};

const mapEdgeToCy = (e: any) => ({
  data: { id: e.id, source: e.source, target: e.target }
});

// --- Ciclo de Vida do Cytoscape ---

const renderGraph = () => {
  if (!cyContainer.value) return;

  const elements = getFilteredElements();

  // Se já existe instância, apenas atualizamos os dados e rodamos o layout
  if (cyInstance) {
    cyInstance.elements().remove();
    cyInstance.add(elements);
    
    // Layout diferente dependendo do modo
    const layoutName = props.mode === 'local' ? 'concentric' : 'cose';
    
    cyInstance.layout({
      name: layoutName,
      animate: true,
      animationDuration: 500,
      padding: 30,
      // Configs específicas para centralizar o nó ativo
      ...(layoutName === 'concentric' ? {
        minNodeSpacing: 50,
        concentric: (node: any) => {
          return node.id() === props.activeNodeId ? 2 : 1;
        },
        levelWidth: () => 1
      } : {
        nodeRepulsion: 450000 // Força de repulsão no modo global
      })
    }).run();
    
    return;
  }

  // Primeira Inicialização
  cyInstance = cytoscape({
    container: cyContainer.value,
    elements: elements,
    style: [
      {
        selector: 'node',
        style: {
          'background-color': 'data(color)',
          'label': 'data(label)',
          'color': '#334155', // Texto escuro para fundo claro
          'font-weight': 'bold',
          'text-valign': 'bottom',
          'text-margin-y': 6,
          'width': '40px',
          'height': '40px',
          'font-size': '12px'
        }
      },
      {
        selector: '.center-node', // Estilo destaque para o nó atual
        style: {
          'width': '60px',
          'height': '60px',
          'border-width': 4,
          'border-color': '#3b82f6'
        }
      },
      {
        selector: 'edge',
        style: {
          'width': 2,
          'line-color': '#cbd5e1',
          'target-arrow-color': '#cbd5e1',
          'target-arrow-shape': 'triangle',
          'curve-style': 'bezier'
        }
      }
    ]
  });
  
  // Rodar layout inicial
  cyInstance.layout({ name: props.mode === 'local' ? 'concentric' : 'cose' }).run();

  // Clique no nó navega (se não for o ativo)
  cyInstance.on('tap', 'node', (evt) => {
    const nodeId = evt.target.id();
    if (nodeId !== props.activeNodeId) {
      // Aqui precisamos emitir um evento para o pai mudar a seleção
      // Mas como estamos usando Store, podemos mudar direto ou emitir
      store.selectedNodeId = nodeId;
    }
  });
};

onMounted(() => {
  renderGraph();
});

// Observa mudanças nas props para redesenhar
watch(() => [props.activeNodeId, props.mode], () => {
  renderGraph();
});

onUnmounted(() => {
  if (cyInstance) cyInstance.destroy();
});
</script>

<template>
  <div class="graph-wrapper">
    <div ref="cyContainer" class="cy-container"></div>
  </div>
</template>

<style scoped>
.graph-wrapper {
  width: 100%;
  height: 100%;
  /* Fundo claro agora para combinar com o modo "Documento" */
  background-color: #f8fafc; 
  position: relative;
}

.cy-container {
  width: 100%;
  height: 100%;
  display: block;
}
</style>