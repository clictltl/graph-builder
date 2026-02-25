<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { Category } from '@/shared/types';
import { useProjectStore, CATEGORY_COLORS } from '@/shared/stores/projectStore';

// Prop agora é opcional. Se undefined = Modo Criação
const props = defineProps<{
  category?: Category;
}>();

const emit = defineEmits(['close']);
const store = useProjectStore();

// Modo Edição ou Criação?
const isEditing = computed(() => !!props.category);

// Lógica de Cor Inteligente (Sugere uma não usada)
const getSuggestedColor = () => {
  if (isEditing.value && props.category) return props.category.color;

  const used = store.usedColors;
  const freeColor = CATEGORY_COLORS.find(c => !used.has(c));
  return freeColor || CATEGORY_COLORS[0];
};

// Estado do Formulário
const formName = ref(props.category?.name || '');
const formColor = ref(getSuggestedColor());

// Foco automático no input ao abrir
const nameInput = ref<HTMLInputElement | null>(null);
onMounted(() => setTimeout(() => nameInput.value?.focus(), 100));

const handleSave = () => {
  if (!formName.value.trim()) return;
  
  if (isEditing.value && props.category) {
    store.updateCategory(props.category.id, formName.value, formColor.value);
  } else {
    store.addCategory(formName.value, formColor.value);
  }
  emit('close');
};

const handleDelete = () => {
  if (isEditing.value && props.category) {
    if (confirm(`Excluir a categoria "${props.category.name}" e TODOS os seus itens?`)) {
      store.deleteCategory(props.category.id);
      emit('close');
    }
  }
};
</script>

<template>
  <div class="modal-backdrop" @click.self="emit('close')">
    <div class="modal-card">
      <h3>{{ isEditing ? 'Editar Categoria' : 'Nova Categoria' }}</h3>

      <div class="form-group">
        <label>Nome</label>
        <input 
          ref="nameInput"
          v-model="formName" 
          type="text" 
          placeholder="Ex: Introdução, Exemplos..." 
          @keyup.enter="handleSave"
        />
      </div>

      <div class="form-group">
        <label>Cor</label>
        <div class="color-picker-wrapper">
          <input type="color" v-model="formColor" class="native-color" />
          
          <div class="swatches">
            <div 
              v-for="color in CATEGORY_COLORS" 
              :key="color"
              class="swatch"
              :style="{ backgroundColor: color }"
              :class="{ active: formColor === color, used: !isEditing && store.usedColors.has(color) && formColor !== color }"
              @click="formColor = color"
              :title="(!isEditing && store.usedColors.has(color)) ? 'Já utilizada' : ''"
            ></div>
          </div>
        </div>
      </div>

      <div class="actions">
        <!-- Botão excluir só aparece na edição -->
        <button v-if="isEditing" class="btn-delete" @click="handleDelete">Excluir</button>
        <div v-else></div> <!-- Spacer -->

        <div class="right-actions">
          <button class="btn-cancel" @click="emit('close')">Cancelar</button>
          <button class="btn-save" @click="handleSave">
            {{ isEditing ? 'Salvar' : 'Criar' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex; align-items: center; justify-content: center;
  z-index: 2000;
}

.modal-card {
  background: white; width: 340px;
  padding: 24px; border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
}

h3 { margin: 0 0 20px 0; color: #1e293b; font-size: 1.2rem; }

.form-group { margin-bottom: 20px; }
.form-group label { display: block; font-size: 0.85rem; font-weight: 600; color: #64748b; margin-bottom: 8px; }
.form-group input[type="text"] {
  width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 1rem;
}
.form-group input[type="text"]:focus { outline: none; border-color: #3b82f6; }

.color-picker-wrapper { display: flex; gap: 12px; align-items: flex-start; }
.native-color { width: 42px; height: 42px; border: none; padding: 0; background: none; cursor: pointer; border-radius: 4px; overflow: hidden; }

.swatches { display: flex; flex-wrap: wrap; gap: 8px; flex: 1; }

.swatch {
  width: 24px; height: 24px; border-radius: 50%; cursor: pointer;
  border: 2px solid transparent; transition: all 0.2s;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}
.swatch:hover { transform: scale(1.1); }
.swatch.active { border-color: #1e293b; transform: scale(1.15); box-shadow: 0 2px 4px rgba(0,0,0,0.2); }

/* Diminui opacidade das cores já usadas para dar dica visual */
.swatch.used { opacity: 0.3; transform: scale(0.9); }
.swatch.used:hover { opacity: 1; transform: scale(1.1); }

.actions { display: flex; justify-content: space-between; margin-top: 24px; align-items: center; }
.right-actions { display: flex; gap: 10px; }

button { padding: 8px 16px; border-radius: 6px; border: none; cursor: pointer; font-weight: 500; font-size: 0.9rem; transition: background 0.2s; }
.btn-save { background: #2563eb; color: white; }
.btn-save:hover { background: #1d4ed8; }
.btn-cancel { background: #e2e8f0; color: #475569; }
.btn-cancel:hover { background: #cbd5e1; }
.btn-delete { background: transparent; color: #ef4444; padding-left: 0; }
.btn-delete:hover { text-decoration: underline; background: transparent; }
</style>