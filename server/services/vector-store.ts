import { Asset } from "@shared/schema";

// Simple TF-IDF based vector store using JSON
export interface VectorDocument {
  id: string;
  content: string;
  metadata: any;
  vector?: number[];
}

export class LightweightVectorStore {
  private documents: VectorDocument[] = [];
  private vocabulary: Set<string> = new Set();
  private idf: Map<string, number> = new Map();

  // Add documents to the vector store
  addDocuments(assets: Asset[]) {
    this.documents = assets.map(asset => ({
      id: asset.id,
      content: `${asset.title} ${asset.description || ''} ${asset.content} ${asset.tags?.join(' ') || ''}`,
      metadata: asset
    }));

    this.buildVocabulary();
    this.calculateIDF();
    this.vectorizeDocuments();
  }

  // Simple text preprocessing
  private preprocessText(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2 && !this.isStopWord(word));
  }

  // Basic stop words (simplified)
  private isStopWord(word: string): boolean {
    const stopWords = new Set([
      'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 
      'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before', 'after',
      'above', 'below', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have',
      'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may',
      'might', 'must', 'can', 'this', 'that', 'these', 'those', 'a', 'an'
    ]);
    return stopWords.has(word);
  }

  // Build vocabulary from all documents
  private buildVocabulary() {
    this.vocabulary.clear();
    this.documents.forEach(doc => {
      const words = this.preprocessText(doc.content);
      words.forEach(word => this.vocabulary.add(word));
    });
  }

  // Calculate Inverse Document Frequency
  private calculateIDF() {
    this.idf.clear();
    const totalDocs = this.documents.length;
    
    this.vocabulary.forEach(term => {
      const docsWithTerm = this.documents.filter(doc => 
        this.preprocessText(doc.content).includes(term)
      ).length;
      
      this.idf.set(term, Math.log(totalDocs / (docsWithTerm + 1)));
    });
  }

  // Calculate TF-IDF vector for a document
  private calculateTFIDF(text: string): number[] {
    const words = this.preprocessText(text);
    const termFreq = new Map<string, number>();
    
    // Calculate term frequency
    words.forEach(word => {
      termFreq.set(word, (termFreq.get(word) || 0) + 1);
    });

    // Create TF-IDF vector
    const vector: number[] = [];
    Array.from(this.vocabulary).forEach(term => {
      const tf = (termFreq.get(term) || 0) / words.length;
      const idf = this.idf.get(term) || 0;
      vector.push(tf * idf);
    });

    return vector;
  }

  // Vectorize all documents
  private vectorizeDocuments() {
    this.documents.forEach(doc => {
      doc.vector = this.calculateTFIDF(doc.content);
    });
  }

  // Calculate cosine similarity between two vectors
  private cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) return 0;
    
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    
    const norm = Math.sqrt(normA) * Math.sqrt(normB);
    return norm === 0 ? 0 : dotProduct / norm;
  }

  // Search for similar documents
  search(query: string, topK: number = 5): Asset[] {
    if (this.documents.length === 0) return [];

    const queryVector = this.calculateTFIDF(query);
    const similarities: { doc: VectorDocument; score: number }[] = [];

    this.documents.forEach(doc => {
      if (doc.vector) {
        const similarity = this.cosineSimilarity(queryVector, doc.vector);
        similarities.push({ doc, score: similarity });
      }
    });

    // Sort by similarity score and return top results
    return similarities
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)
      .filter(item => item.score > 0.1) // Minimum similarity threshold
      .map(item => item.doc.metadata as Asset);
  }

  // Get document by ID
  getDocument(id: string): VectorDocument | undefined {
    return this.documents.find(doc => doc.id === id);
  }

  // Get all documents
  getAllDocuments(): Asset[] {
    return this.documents.map(doc => doc.metadata as Asset);
  }
}

export const vectorStore = new LightweightVectorStore();