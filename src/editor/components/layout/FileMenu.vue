<template>
  <div class="filemenu-container" ref="fileMenuContainer">

    <!-- Grupo: Botão + Nome do Projeto -->
    <div class="trigger-group">
      
      <!-- Botão Gatilho -->
      <button class="menu-trigger" :class="{ 'active': open }" @click="toggleMenu">
        <span class="label">Arquivo</span>
        <svg class="chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      <!-- Nome do Projeto -->
      <div class="project-info">
        <div class="separator-vertical"></div>
        <span class="icon">📄</span>
        <span class="name" :title="store.project.meta.name">
          {{ store.project.meta.name || 'Sem Título' }}
        </span>
      </div>

    </div>

    <!-- Dropdown Menu -->
    <transition name="fade-slide">
      <!-- se não é WP, alinha à direita -->
      <div v-if="open" class="dropdown-menu" :class="{ 'align-right': !isWordPress }">
        
        <!-- Grupo: Novo -->
        <div class="menu-group">
          <div class="menu-item" @click="handleMenuClick(store.createNew)">
            <span class="icon">✨</span> Novo projeto
          </div>
        </div>
        
        <div class="divider"></div>

        <!-- Grupo: Local (PC) -->
        <div class="menu-group">
          <div class="menu-label">Local (PC)</div>
          
          <div class="menu-item" @click="handleMenuClick(triggerFileInput)">
            <span class="icon">📥</span> Importar JSON
          </div>
          <!-- Input invisível para upload -->
          <input 
            type="file" 
            ref="fileInput" 
            accept=".json" 
            style="display: none" 
            @change="handleImport"
          />

          <div class="menu-item" @click="handleMenuClick(handleExport)">
            <span class="icon">📤</span> Exportar JSON
          </div>
        </div>

      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useProjectStore } from '@/shared/stores/projectStore';
import { useToast } from '@/shared/composables/useToast';
import { exportToJSON, parseJSONFile } from '@/editor/utils/localProjectIO';

const store = useProjectStore();
const toast = useToast();

const open = ref(false);
const fileMenuContainer = ref<HTMLElement | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

// No MVP Standalone, assumimos false para forçar o menu à direita (align-right)
const isWordPress = false;

// --- Lógica de UI ---

function toggleMenu() {
  open.value = !open.value;
}

function handleMenuClick(action: Function) {
  open.value = false;
  action();
}

const handleClickOutside = (event: MouseEvent) => {
  if (open.value && fileMenuContainer.value && !fileMenuContainer.value.contains(event.target as Node)) {
    open.value = false;
  }
};

onMounted(() => document.addEventListener('click', handleClickOutside));
onUnmounted(() => document.removeEventListener('click', handleClickOutside));

// --- Ações de Projeto ---

function handleExport() {
  try {
    const name = store.project.meta.name || 'projeto';
    exportToJSON(store.project, name);
    toast.success('Projeto exportado com sucesso!');
  } catch (error) {
    console.error(error);
    toast.error('Erro ao exportar.');
  }
}

function triggerFileInput() {
  if (fileInput.value) fileInput.value.value = ''; // Reseta para permitir re-seleção
  fileInput.value?.click();
}

async function handleImport(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  try {
    const loadedProject = await parseJSONFile(file);
    store.loadProject(loadedProject);
    toast.success('Projeto carregado!');
  } catch (err: any) {
    console.error(err);
    toast.error('Erro ao ler arquivo.');
  }
}
</script>

<style scoped>
.filemenu-container {
  position: relative;
  display: inline-block;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.trigger-group { display: flex; align-items: center; gap: 8px; }

.menu-trigger {
  display: flex; align-items: center; gap: 6px;
  background: transparent; border: 1px solid transparent;
  padding: 6px 12px; border-radius: 6px; cursor: pointer;
  color: #374151; font-weight: 500; font-size: 14px;
  transition: all 0.2s ease;
}
.menu-trigger:hover, .menu-trigger.active { background-color: #f3f4f6; color: #111827; }
.menu-trigger.active .chevron { transform: rotate(180deg); }
.chevron { transition: transform 0.2s ease; opacity: 0.6; }

.project-info {
  display: flex; align-items: center; gap: 8px;
  font-size: 13px; color: #6b7280; white-space: nowrap;
}
.separator-vertical { width: 1px; height: 16px; background-color: #e5e7eb; }
.project-info .name { font-weight: 500; max-width: 150px; overflow: hidden; text-overflow: ellipsis; display: inline-block; }

.dropdown-menu {
  position: absolute; top: calc(100% + 6px); left: 0; right: auto;
  transform-origin: top left; min-width: 240px;
  background: white; border: 1px solid #e5e7eb; border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  padding: 6px; z-index: 9999;
}

.dropdown-menu.align-right { left: auto; right: 0; transform-origin: top right; }

.menu-group { display: flex; flex-direction: column; }
.menu-label { font-size: 11px; text-transform: uppercase; color: #9ca3af; font-weight: 600; padding: 8px 10px 4px; letter-spacing: 0.05em; }
.menu-item { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: 6px; cursor: pointer; font-size: 14px; color: #4b5563; transition: background-color 0.15s; }
.menu-item:hover { background-color: #f3f4f6; color: #1f2937; }
.menu-item.danger { color: #dc2626; }
.menu-item.danger:hover { background-color: #fef2f2; }
.menu-item.highlight { color: #2563eb; font-weight: 500; }
.menu-item.highlight:hover { background-color: #eff6ff; }
.divider { height: 1px; background-color: #e5e7eb; margin: 6px 0; }
.menu-item .icon { font-size: 16px; min-width: 20px; text-align: center; }

/* Transitions */
.fade-slide-enter-active, .fade-slide-leave-active { transition: opacity 0.2s, transform 0.2s; }
.fade-slide-enter-from, .fade-slide-leave-to { opacity: 0; transform: translateY(-8px); }
</style>