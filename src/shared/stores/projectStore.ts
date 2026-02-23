import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';
import type { GraphProject, Category, Node, Edge } from '../types';

// Função auxiliar para gerar datas ISO
const now = () => new Date().toISOString();

// Estado inicial padrão
const createEmptyProject = (): GraphProject => ({
  meta: {
    id: uuidv4(),
    name: 'Novo Projeto',
    version: '1.0.0',
    createdAt: now(),
    updatedAt: now(),
  },
  categories: [],
  nodes: [],
  edges: [],
  assets: {},
});

export const useProjectStore = defineStore('project', {
  state: () => ({
    project: createEmptyProject() as GraphProject,
    selectedNodeId: null as string | null, 
  }),

  getters: {
    nodesByCategory: (state) => {
      return (categoryId: string) => 
        state.project.nodes.filter((n) => n.categoryId === categoryId);
    },
    
    activeNode: (state) => {
      if (!state.selectedNodeId) return null;
      return state.project.nodes.find(n => n.id === state.selectedNodeId);
    }
  },

  actions: {
    createNew() {
      this.project = createEmptyProject();
      this.selectedNodeId = null;
    },

    loadProject(json: GraphProject) {
      this.project = json;
      this.selectedNodeId = null;
    },

    addCategory(name: string) {
      const newCategory: Category = {
        id: uuidv4(),
        name,
        color: '#64748b', 
        order: this.project.categories.length,
      };
      this.project.categories.push(newCategory);
    },

    addNode(categoryId: string) {
      const newNode: Node = {
        id: uuidv4(),
        categoryId,
        title: 'Novo Item',
        content: '',
      };
      this.project.nodes.push(newNode);
      this.selectedNodeId = newNode.id;
      this.project.meta.updatedAt = now();
    },

    updateNode(id: string, updates: Partial<Node>) {
      const node = this.project.nodes.find(n => n.id === id);
      if (node) {
        // Correção: Object.assign mescla as atualizações no objeto existente
        // sem risco de sobrescrever campos obrigatórios com undefined
        Object.assign(node, updates);
        this.project.meta.updatedAt = now();
      }
    },

    deleteNode(id: string) {
      this.project.nodes = this.project.nodes.filter(n => n.id !== id);
      this.project.edges = this.project.edges.filter(e => e.source !== id && e.target !== id);
      
      if (this.selectedNodeId === id) {
        this.selectedNodeId = null;
      }
      this.project.meta.updatedAt = now();
    },

    addEdge(sourceId: string, targetId: string) {
      if (sourceId === targetId) return;

      const exists = this.project.edges.some(
        e => e.source === sourceId && e.target === targetId
      );

      if (!exists) {
        // Correção: Tipamos explicitamente o objeto como Edge
        const newEdge: Edge = {
          id: uuidv4(),
          source: sourceId,
          target: targetId
        };
        this.project.edges.push(newEdge);
        this.project.meta.updatedAt = now();
      }
    },

    updateCategory(id: string, name: string) {
      const category = this.project.categories.find(c => c.id === id);
      if (category) {
        category.name = name;
        this.project.meta.updatedAt = now();
      }
    },

    deleteCategory(id: string) {
      // 1. Remove a categoria
      this.project.categories = this.project.categories.filter(c => c.id !== id);
      
      // 2. Remove todos os nós que estavam dentro dela (Cascata)
      const nodesToDelete = this.project.nodes.filter(n => n.categoryId === id);
      const nodeIds = nodesToDelete.map(n => n.id);
      
      this.project.nodes = this.project.nodes.filter(n => n.categoryId !== id);

      // 3. Limpa conexões que envolviam esses nós excluídos
      this.project.edges = this.project.edges.filter(e => 
        !nodeIds.includes(e.source) && !nodeIds.includes(e.target)
      );

      this.project.meta.updatedAt = now();
    },
  }
});