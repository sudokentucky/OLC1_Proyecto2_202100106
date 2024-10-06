export class DotGenerator {
    private nodes: string[] = [];
    private edges: string[] = [];
    private nodeCount: number = 0;
    
    /**
     * Método para agregar un nodo y retornar su identificador.
     * @param label - Etiqueta del nodo.
     */
    public addNode(label: string): string {
        const nodeId = `node${this.nodeCount++}`;
        this.nodes.push(`${nodeId} [label="${label}"];`);
        return nodeId;
    }

    /**
     * Método para agregar una arista entre dos nodos.
     * @param from - Nodo origen.
     * @param to - Nodo destino.
     */
    public addEdge(from: string, to: string): void {
        this.edges.push(`${from} -> ${to};`);
    }

    /**
     * Reinicia el estado del generador de nodos.
     * Limpia la lista de nodos, aristas y reinicia el contador.
     */
    public reset(): void {
        this.nodes = [];      // Vaciar los nodos
        this.edges = [];      // Vaciar las aristas
        this.nodeCount = 0;   // Reiniciar el contador de nodos
    }

    /**
     * Genera y retorna el código DOT con saltos de línea reales.
     */
    public generateDot(): string {
        return `digraph AST {\n${this.nodes.join('\n')}\n${this.edges.join('\n')}\n}`;
    }
}
