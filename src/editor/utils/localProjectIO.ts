import type { GraphProject } from '@/shared/types';

/**
 * Salva o objeto do projeto como um arquivo JSON no computador do usuário.
 */
export function exportToJSON(project: GraphProject, fileName: string = 'projeto') {
  const dataStr = JSON.stringify(project, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `${fileName}.json`;
  document.body.appendChild(a);
  a.click();
  
  // Limpeza
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Lê um arquivo File (input) e retorna uma Promise com o objeto do projeto.
 */
export function parseJSONFile(file: File): Promise<GraphProject> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        
        // Validação mínima para garantir que é um projeto válido
        if (!json.categories || !json.nodes) {
          throw new Error("O arquivo não parece ser um projeto Graph Builder válido.");
        }
        
        resolve(json as GraphProject);
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = () => reject(new Error("Erro ao ler o arquivo."));
    
    reader.readAsText(file);
  });
}