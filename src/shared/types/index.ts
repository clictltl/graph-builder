/**
 * ASSETS: Gerenciamento de arquivos (Imagens, PDF)
 * Referência por ID.
 */
export type AssetSource = 'local' | 'remote';

export interface Asset {
  id: string;          // UUID
  type: string;        // Mime-type (ex: image/jpeg)
  originalName: string;
  source: AssetSource; // 'local' (blob em memória) ou 'remote' (URL do WP)
  url?: string;        // URL final (se remote)
  blobUrl?: string;    // URL temporária para preview (se local)
  file?: File;         // O arquivo binário (apenas durante edição local)
}

/**
 * CATEGORIA: O agrupador visual (ex: "Introdução", "Conceitos Básicos")
 * No Editor: Uma coluna.
 * No Grafo: Define a cor dos nós.
 */
export interface Category {
  id: string;
  name: string;
  color: string;       // Ex: "#FF5733"
  order: number;       // Posição da coluna no Editor
}

/**
 * NÓ (VALUE): O conteúdo educacional.
 * No Editor: Um cartão dentro da coluna.
 * No Grafo: Uma bolinha conectada.
 */
export interface Node {
  id: string;
  categoryId: string;  // FK: Pertence a uma categoria
  title: string;
  content: string;     // Markdown / HTML
  
  // Posição visual (x, y) é opcional pois só existe no Preview/Grafo.
  // No Editor, a posição é automática baseada na lista.
  position?: { x: number; y: number }; 
}

/**
 * ARESTA (CONNECTION): A relação entre dois conceitos.
 */
export interface Edge {
  id: string;
  source: string;      // ID do Node de origem
  target: string;      // ID do Node de destino
}

/**
 * PROJETO: O arquivo salvo (.json)
 */
export interface GraphProject {
  meta: {
    id: string;
    name: string;
    version: string;
    createdAt: string;
    updatedAt: string;
  };
  categories: Category[];
  nodes: Node[];
  edges: Edge[];
  assets: Record<string, Asset>; // Dicionário { id: Asset }
}