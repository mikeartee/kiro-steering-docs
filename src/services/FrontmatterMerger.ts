import { RecommendationMetadata, MergeOptions } from '../types';

/**
 * Service for merging new metadata with existing frontmatter
 */
export class FrontmatterMerger {
  private readonly DEFAULT_OPTIONS: MergeOptions = {
    preserveExisting: true,
    overwriteTags: false
  };

  private readonly FIELD_ORDER = [
    'title',
    'description',
    'category',
    'tags',
    'inclusion',
    'applicableTo',
    'requiredDependencies',
    'filePatterns'
  ];

  /**
   * Merges new metadata with existing frontmatter
   * @param existing - Existing frontmatter object
   * @param newMetadata - New metadata to merge in
   * @param options - Options controlling merge behavior
   * @returns Merged frontmatter object
   */
  merge(
    existing: Record<string, any>,
    newMetadata: RecommendationMetadata,
    options?: Partial<MergeOptions>
  ): Record<string, any> {
    const opts = { ...this.DEFAULT_OPTIONS, ...options };
    const merged: Record<string, any> = { ...existing };

    // Merge tags
    if (newMetadata.enhancedTags) {
      if (opts.overwriteTags) {
        merged.tags = newMetadata.enhancedTags;
      } else {
        merged.tags = this.mergeTags(
          Array.isArray(existing.tags) ? existing.tags : [],
          newMetadata.enhancedTags
        );
      }
    }

    // Merge applicableTo
    if (newMetadata.applicableTo) {
      if (opts.preserveExisting && existing.applicableTo) {
        merged.applicableTo = this.mergeArrayField(
          Array.isArray(existing.applicableTo) ? existing.applicableTo : [],
          newMetadata.applicableTo
        );
      } else {
        merged.applicableTo = newMetadata.applicableTo;
      }
    }

    // Merge requiredDependencies
    if (newMetadata.requiredDependencies && newMetadata.requiredDependencies.length > 0) {
      if (opts.preserveExisting && existing.requiredDependencies) {
        merged.requiredDependencies = this.mergeArrayField(
          Array.isArray(existing.requiredDependencies) ? existing.requiredDependencies : [],
          newMetadata.requiredDependencies
        );
      } else {
        merged.requiredDependencies = newMetadata.requiredDependencies;
      }
    }

    // Merge filePatterns
    if (newMetadata.filePatterns && newMetadata.filePatterns.length > 0) {
      if (opts.preserveExisting && existing.filePatterns) {
        merged.filePatterns = this.mergeArrayField(
          Array.isArray(existing.filePatterns) ? existing.filePatterns : [],
          newMetadata.filePatterns
        );
      } else {
        merged.filePatterns = newMetadata.filePatterns;
      }
    }

    // Sort fields in consistent order
    return this.sortFields(merged);
  }

  /**
   * Merges tags, preserving existing tags and adding new ones
   * @param existing - Existing tags
   * @param additional - Additional tags to add
   * @returns Combined array with duplicates removed, existing tags first
   */
  private mergeTags(existing: string[], additional: string[]): string[] {
    const tagSet = new Set<string>();
    const result: string[] = [];

    // Add existing tags first (preserving order)
    for (const tag of existing) {
      if (typeof tag === 'string' && tag.trim() && !tagSet.has(tag.trim())) {
        const trimmed = tag.trim();
        tagSet.add(trimmed);
        result.push(trimmed);
      }
    }

    // Add additional tags
    for (const tag of additional) {
      if (typeof tag === 'string' && tag.trim() && !tagSet.has(tag.trim())) {
        const trimmed = tag.trim();
        tagSet.add(trimmed);
        result.push(trimmed);
      }
    }

    return result;
  }

  /**
   * Merges array fields, removing duplicates and preserving existing values
   * @param existing - Existing array values
   * @param additional - Additional values to add
   * @returns Combined array with duplicates removed
   */
  private mergeArrayField(existing: any[], additional: any[]): any[] {
    const valueSet = new Set<string>();
    const result: any[] = [];

    // Add existing values first
    for (const value of existing) {
      const key = JSON.stringify(value);
      if (!valueSet.has(key)) {
        valueSet.add(key);
        result.push(value);
      }
    }

    // Add additional values
    for (const value of additional) {
      const key = JSON.stringify(value);
      if (!valueSet.has(key)) {
        valueSet.add(key);
        result.push(value);
      }
    }

    return result;
  }

  /**
   * Sorts frontmatter fields in consistent order
   * @param frontmatter - Frontmatter object to sort
   * @returns Sorted frontmatter object
   */
  private sortFields(frontmatter: Record<string, any>): Record<string, any> {
    const sorted: Record<string, any> = {};

    // Add fields in specified order
    for (const field of this.FIELD_ORDER) {
      if (field in frontmatter) {
        sorted[field] = frontmatter[field];
      }
    }

    // Add any remaining custom fields at the end
    for (const field in frontmatter) {
      if (!(field in sorted)) {
        sorted[field] = frontmatter[field];
      }
    }

    return sorted;
  }
}
