<!-- src/modules/Preview/GraphView.vue -->
<script setup lang="ts">
import { onMounted, ref, onUnmounted } from 'vue';
import cytoscape from 'cytoscape';
import { useProjectStore } from '../../shared/stores/projectStore';

const store = useProjectStore();
const cyContainer = ref<HTMLElement | null>(null);
let cyInstance: cytoscape.Core | null = null;

// Função que converte nossos dados para o formato do Cytoscape
const getElements = () => {
  const nodes = store.project.nodes.map(n => {
    // Busca a cor da categoria deste nó
    const category = store.project.categories.find(c => c.id === n.categoryId);
    const color = category ? category.color : '#888';
    
    return {
      data: { 
        id: n.id, 
        label: n.title,
        color: color 
      }
    };
  });

  const edges = store.project.edges.map(e => ({
    data: { 
      id: e.id, 
      source: e.source, 
      target: e.target 
    }
  }));

  return [...nodes, ...edges];
};

onMounted(() => {
  if (!cyContainer.value) return;

  // Inicializa o Cytoscape
  cyInstance = cytoscape({
    container: cyContainer.value,
    
    elements: getElements(),

    // Estilo Visual (CSS do Grafo)
    style: [
      {
        selector: 'node',
        style: {
          'background-color': 'data(color)',
          'label': 'data(label)',
          'color': '#fff',              // Cor do texto
          'text-valign': 'center',
          'text-halign': 'center',
          'width': '60px',              // Tamanho da bolinha
          'height': '60px',
          'font-size': '12px',
          'text-outline-width': 2,      // Contorno preto no texto para leitura
          'text-outline-color': '#000',
          'overlay-padding': '6px',
          'z-index': 10
        }
      },
      {
        selector: 'edge',
        style: {
          'width': 3,
          'line-color': '#555',         // Linha cinza escura
          'target-arrow-color': '#555',
          'target-arrow-shape': 'triangle',
          'curve-style': 'bezier',      // Curva suave
          'arrow-scale': 1.5
        }
      },
      {
        selector: ':selected',          // Quando clica no nó
        style: {
          'border-width': 4,
          'border-color': '#fff',
          'line-color': '#fff',
          'target-arrow-color': '#fff',
          'source-arrow-color': '#fff'
        }
      }
    ],

    // Algoritmo de Layout (Física)
    layout: {
      name: 'cose',           // Compound Spring Embedder (Layout de força)
      animate: true,
      animationDuration: 500,
      padding: 50,
      nodeRepulsion: () => 450000, // Força de repulsão (separam os nós)
      idealEdgeLength: () => 100,  // Comprimento ideal da linha
    }
  });

  // Evento de clique no nó (preparando para abrir conteúdo depois)
  cyInstance.on('tap', 'node', (evt) => {
    const node = evt.target;
    console.log('Clicou no nó:', node.data('label'));
    // Futuro: store.selectedNodeId = node.id;
  });
});

// Limpeza de memória
onUnmounted(() => {
  if (cyInstance) {
    cyInstance.destroy();
  }
});
</script>

<template>
  <div class="graph-wrapper">
    <!-- Container onde o Cytoscape desenha o canvas -->
    <div ref="cyContainer" class="cy-container"></div>
    
    <div class="overlay-info">
      <p>Modo Visualização (Zoom: Scroll | Mover: Arrastar)</p>
    </div>
  </div>
</template>

<style scoped>
.graph-wrapper {
  width: 100%;
  height: 100%;
  background-color: #1a1a1a; /* Fundo escuro estilo Obsidian */
  position: relative;
  overflow: hidden;
}

.cy-container {
  width: 100%;
  height: 100%;
  display: block;
}

.overlay-info {
  position: absolute;
  bottom: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 0.8rem;
  pointer-events: none; /* Deixa clicar através */
}
</style>