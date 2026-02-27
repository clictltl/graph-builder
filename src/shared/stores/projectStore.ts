import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';
import type { GraphProject, Category, Node, Edge } from '../types';

export const CATEGORY_COLORS = [
  '#ef4444', // Red
  '#f97316', // Orange
  '#f59e0b', // Amber
  '#84cc16', // Lime
  '#10b981', // Emerald
  '#06b6d4', // Cyan
  '#3b82f6', // Blue
  '#8b5cf6', // Violet
  '#d946ef', // Fuchsia
  '#f43f5e', // Rose
];

const DEFAULT_COLOR = '#64748b';

const now = () => new Date().toISOString();

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
    nodesByCategory: (state) => (categoryId: string) => 
      state.project.nodes.filter((n) => n.categoryId === categoryId),
    
    activeNode: (state) => 
      state.selectedNodeId ? state.project.nodes.find(n => n.id === state.selectedNodeId) : null,
      
    // Helper para saber quais cores já estão em uso
    usedColors: (state) => new Set(state.project.categories.map(c => c.color))
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

    addCategory(name: string, color?: string) {
      let finalColor = color;
      if (!finalColor) {
        const colorIndex = this.project.categories.length % CATEGORY_COLORS.length;
        finalColor = CATEGORY_COLORS[colorIndex] || DEFAULT_COLOR;
      }

      const newCategory: Category = {
        id: uuidv4(),
        name,
        color: finalColor,
        order: 0,
      };
      this.project.categories.unshift(newCategory);
      this.project.categories.forEach((cat, index) => {
        cat.order = index;
      });
      this.project.meta.updatedAt = now();
    },

    updateCategory(id: string, name: string, color?: string) {
      const category = this.project.categories.find(c => c.id === id);
      if (category) {
        category.name = name;
        if (color) category.color = color;
        this.project.meta.updatedAt = now();
      }
    },

    deleteCategory(id: string) {
      this.project.categories = this.project.categories.filter(c => c.id !== id);
      const nodesToDelete = this.project.nodes.filter(n => n.categoryId === id);
      const nodeIds = nodesToDelete.map(n => n.id);
      this.project.nodes = this.project.nodes.filter(n => n.categoryId !== id);
      this.project.edges = this.project.edges.filter(e => 
        !nodeIds.includes(e.source) && !nodeIds.includes(e.target)
      );
      this.project.categories.forEach((cat, index) => {
        cat.order = index;
      });
      this.project.meta.updatedAt = now();
    },

    reorderCategories(newCategories: Category[]) {
      this.project.categories = newCategories;
      this.project.categories.forEach((cat, index) => {
        cat.order = index;
      });

      this.project.meta.updatedAt = now();
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
        Object.assign(node, updates);
        this.project.meta.updatedAt = now();
      }
    },

    deleteNode(id: string) {
      this.project.nodes = this.project.nodes.filter(n => n.id !== id);
      this.project.edges = this.project.edges.filter(e => e.source !== id && e.target !== id);
      if (this.selectedNodeId === id) this.selectedNodeId = null;
      this.project.meta.updatedAt = now();
    },

    addEdge(sourceId: string, targetId: string) {
      if (sourceId === targetId) return;

      const exists = this.project.edges.some(
        e => e.source === sourceId && e.target === targetId
      );

      if (!exists) {
        const newEdge: Edge = {
          id: uuidv4(),
          source: sourceId,
          target: targetId
        };
        
        this.project.edges.push(newEdge);
        this.project.meta.updatedAt = now();
      }
    }
  }
});