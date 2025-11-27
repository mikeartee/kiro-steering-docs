import { AnalysisContext, RecommendationMetadata } from '../types';
import { MetadataRulesEngine } from './MetadataRulesEngine';

/**
 * Service for analyzing documents to determine appropriate recommendation metadata
 */
export class MetadataAnalyzer {
  private rulesEngine: MetadataRulesEngine;

  constructor() {
    this.rulesEngine = new MetadataRulesEngine();
  }

  /**
   * Analyzes a document to determine appropriate metadata
   * @param context - Analysis context with document information
   * @returns Recommendation metadata for the document
   */
  analyze(context: AnalysisContext): RecommendationMetadata {
    // Use the rules engine to apply all matching rules
    const metadata = this.rulesEngine.applyRules(context);

    // Enhance tags by merging existing tags with new ones
    const existingTags = Array.isArray(context.existingFrontmatter.tags)
      ? context.existingFrontmatter.tags
      : [];

    metadata.enhancedTags = this.enhanceTags(existingTags, metadata.enhancedTags || []);

    return metadata;
  }

  /**
   * Enhances tags by combining existing and new tags
   * @param existing - Existing tags from frontmatter
   * @param additional - Additional tags from metadata analysis
   * @returns Combined array of unique tags
   */
  private enhanceTags(existing: string[], additional: string[]): string[] {
    const tagSet = new Set<string>();

    // Add existing tags first to preserve order
    existing.forEach(tag => {
      if (typeof tag === 'string' && tag.trim()) {
        tagSet.add(tag.trim());
      }
    });

    // Add additional tags
    additional.forEach(tag => {
      if (typeof tag === 'string' && tag.trim()) {
        tagSet.add(tag.trim());
      }
    });

    return Array.from(tagSet);
  }
}
