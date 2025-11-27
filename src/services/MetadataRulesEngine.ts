import { AnalysisContext, RecommendationMetadata, MetadataRule, ProjectType } from '../types';

/**
 * Engine for applying metadata rules to documents based on their characteristics
 */
export class MetadataRulesEngine {
  private rules: MetadataRule[];

  constructor() {
    this.rules = this.initializeRules();
  }

  /**
   * Applies all rules to the given context and returns merged metadata
   * @param context - Analysis context with document information
   * @returns Merged recommendation metadata from all matching rules
   */
  applyRules(context: AnalysisContext): RecommendationMetadata {
    const matchingMetadata: RecommendationMetadata[] = [];

    for (const rule of this.rules) {
      if (rule.condition(context)) {
        const metadata = typeof rule.metadata === 'function' 
          ? rule.metadata(context) 
          : rule.metadata;
        matchingMetadata.push(metadata);
      }
    }

    return this.mergeMetadata(matchingMetadata);
  }

  /**
   * Initializes all metadata rules
   * @returns Array of metadata rules
   */
  private initializeRules(): MetadataRule[] {
    const rules: MetadataRule[] = [];

    // Language rules will be added here
    rules.push(...this.createLanguageRules());

    // Framework rules will be added here
    rules.push(...this.createFrameworkRules());

    // Practice rules will be added here
    rules.push(...this.createPracticeRules());

    return rules;
  }

  /**
   * Creates rules for language documents
   * @returns Array of language-specific metadata rules
   */
  private createLanguageRules(): MetadataRule[] {
    const rules: MetadataRule[] = [];

    // JavaScript rule
    rules.push({
      condition: (context) => {
        const path = context.documentPath.toLowerCase();
        return path.includes('javascript') || path.includes('js-');
      },
      metadata: {
        requiredDependencies: [],
        applicableTo: [ProjectType.WEB_APP, ProjectType.LIBRARY, ProjectType.CLI_TOOL, ProjectType.API_SERVER],
        filePatterns: ['**/*.js', '**/*.mjs', '**/*.cjs'],
        enhancedTags: ['javascript', 'formatting', 'code-generation']
      }
    });

    // TypeScript rule
    rules.push({
      condition: (context) => {
        const path = context.documentPath.toLowerCase();
        return path.includes('typescript') || path.includes('ts-');
      },
      metadata: {
        requiredDependencies: ['typescript'],
        applicableTo: [ProjectType.WEB_APP, ProjectType.LIBRARY, ProjectType.CLI_TOOL, ProjectType.API_SERVER, ProjectType.VSCODE_EXTENSION],
        filePatterns: ['**/*.ts', '**/*.tsx'],
        enhancedTags: ['typescript', 'formatting', 'code-generation']
      }
    });

    // Python rule
    rules.push({
      condition: (context) => {
        const path = context.documentPath.toLowerCase();
        return path.includes('python') || path.includes('py-');
      },
      metadata: {
        requiredDependencies: [],
        applicableTo: [ProjectType.WEB_APP, ProjectType.LIBRARY, ProjectType.CLI_TOOL, ProjectType.API_SERVER],
        filePatterns: ['**/*.py'],
        enhancedTags: ['python', 'formatting', 'code-generation']
      }
    });

    // Bash rule
    rules.push({
      condition: (context) => {
        const path = context.documentPath.toLowerCase();
        return path.includes('bash') || path.includes('shell');
      },
      metadata: {
        requiredDependencies: [],
        applicableTo: [ProjectType.CLI_TOOL],
        filePatterns: ['**/*.sh', '**/*.bash'],
        enhancedTags: ['bash', 'shell', 'scripting']
      }
    });

    // CSS rule
    rules.push({
      condition: (context) => {
        const path = context.documentPath.toLowerCase();
        return path.includes('css') || path.includes('scss') || path.includes('sass');
      },
      metadata: {
        requiredDependencies: [],
        applicableTo: [ProjectType.WEB_APP],
        filePatterns: ['**/*.css', '**/*.scss', '**/*.sass'],
        enhancedTags: ['css', 'styling', 'formatting']
      }
    });

    // JSON rule
    rules.push({
      condition: (context) => {
        const path = context.documentPath.toLowerCase();
        return path.includes('json');
      },
      metadata: {
        requiredDependencies: [],
        applicableTo: [ProjectType.WEB_APP, ProjectType.LIBRARY, ProjectType.CLI_TOOL, ProjectType.API_SERVER, ProjectType.VSCODE_EXTENSION],
        filePatterns: ['**/*.json'],
        enhancedTags: ['json', 'data-format', 'formatting']
      }
    });

    return rules;
  }

  /**
   * Creates rules for framework documents
   * @returns Array of framework-specific metadata rules
   */
  private createFrameworkRules(): MetadataRule[] {
    const rules: MetadataRule[] = [];

    // React rule
    rules.push({
      condition: (context) => {
        const path = context.documentPath.toLowerCase();
        const body = context.bodyContent.toLowerCase();
        return path.includes('react') || body.includes('react');
      },
      metadata: {
        requiredDependencies: ['react'],
        applicableTo: [ProjectType.WEB_APP, ProjectType.LIBRARY],
        filePatterns: ['components/**/*.jsx', 'components/**/*.tsx', 'src/components/**/*'],
        enhancedTags: ['react', 'components', 'best-practices']
      }
    });

    // Vue rule
    rules.push({
      condition: (context) => {
        const path = context.documentPath.toLowerCase();
        const body = context.bodyContent.toLowerCase();
        return path.includes('vue') || body.includes('vue');
      },
      metadata: {
        requiredDependencies: ['vue'],
        applicableTo: [ProjectType.WEB_APP],
        filePatterns: ['components/**/*.vue', 'src/components/**/*.vue'],
        enhancedTags: ['vue', 'components', 'best-practices']
      }
    });

    // Express rule
    rules.push({
      condition: (context) => {
        const path = context.documentPath.toLowerCase();
        const body = context.bodyContent.toLowerCase();
        return path.includes('express') || body.includes('express');
      },
      metadata: {
        requiredDependencies: ['express'],
        applicableTo: [ProjectType.API_SERVER],
        filePatterns: ['routes/**/*.js', 'routes/**/*.ts', 'api/**/*'],
        enhancedTags: ['express', 'nodejs', 'api', 'best-practices']
      }
    });

    // FastAPI rule
    rules.push({
      condition: (context) => {
        const path = context.documentPath.toLowerCase();
        const body = context.bodyContent.toLowerCase();
        return path.includes('fastapi') || body.includes('fastapi');
      },
      metadata: {
        requiredDependencies: [],
        applicableTo: [ProjectType.API_SERVER],
        filePatterns: ['routes/**/*.py', 'api/**/*.py'],
        enhancedTags: ['fastapi', 'python', 'api', 'best-practices']
      }
    });

    // Django rule
    rules.push({
      condition: (context) => {
        const path = context.documentPath.toLowerCase();
        const body = context.bodyContent.toLowerCase();
        return path.includes('django') || body.includes('django');
      },
      metadata: {
        requiredDependencies: [],
        applicableTo: [ProjectType.WEB_APP, ProjectType.API_SERVER],
        filePatterns: ['views/**/*.py', 'models/**/*.py', 'urls.py'],
        enhancedTags: ['django', 'python', 'web', 'best-practices']
      }
    });

    return rules;
  }

  /**
   * Creates rules for practice documents
   * @returns Array of practice-specific metadata rules
   */
  private createPracticeRules(): MetadataRule[] {
    const rules: MetadataRule[] = [];

    // Testing rule
    rules.push({
      condition: (context) => {
        const path = context.documentPath.toLowerCase();
        const subcategory = context.subcategory?.toLowerCase() || '';
        return path.includes('testing') || path.includes('test') || subcategory.includes('testing');
      },
      metadata: {
        requiredDependencies: [],
        applicableTo: [ProjectType.WEB_APP, ProjectType.LIBRARY, ProjectType.CLI_TOOL, ProjectType.API_SERVER, ProjectType.VSCODE_EXTENSION],
        filePatterns: ['**/*.test.ts', '**/*.test.js', '**/*.spec.ts', '**/*.spec.js', 'tests/**/*'],
        enhancedTags: ['testing', 'best-practices', 'quality']
      }
    });

    // Security rule
    rules.push({
      condition: (context) => {
        const path = context.documentPath.toLowerCase();
        const subcategory = context.subcategory?.toLowerCase() || '';
        return path.includes('security') || subcategory.includes('security');
      },
      metadata: {
        requiredDependencies: [],
        applicableTo: [ProjectType.WEB_APP, ProjectType.LIBRARY, ProjectType.CLI_TOOL, ProjectType.API_SERVER],
        filePatterns: [],
        enhancedTags: ['security', 'best-practices']
      }
    });

    // Code quality rule
    rules.push({
      condition: (context) => {
        const path = context.documentPath.toLowerCase();
        const subcategory = context.subcategory?.toLowerCase() || '';
        return path.includes('code-quality') || path.includes('quality') || subcategory.includes('code-quality');
      },
      metadata: {
        requiredDependencies: [],
        applicableTo: [ProjectType.WEB_APP, ProjectType.LIBRARY, ProjectType.CLI_TOOL, ProjectType.API_SERVER, ProjectType.VSCODE_EXTENSION],
        filePatterns: [],
        enhancedTags: ['code-quality', 'best-practices']
      }
    });

    // Workflow rule
    rules.push({
      condition: (context) => {
        const path = context.documentPath.toLowerCase();
        const subcategory = context.subcategory?.toLowerCase() || '';
        return path.includes('workflow') || path.includes('git') || subcategory.includes('workflow');
      },
      metadata: {
        requiredDependencies: [],
        applicableTo: [ProjectType.WEB_APP, ProjectType.LIBRARY, ProjectType.CLI_TOOL, ProjectType.API_SERVER, ProjectType.VSCODE_EXTENSION],
        filePatterns: [],
        enhancedTags: ['git', 'workflow', 'best-practices']
      }
    });

    return rules;
  }

  /**
   * Merges multiple metadata objects into a single metadata object
   * @param metadataList - Array of metadata objects to merge
   * @returns Merged metadata with all unique values preserved
   */
  private mergeMetadata(metadataList: RecommendationMetadata[]): RecommendationMetadata {
    const merged: RecommendationMetadata = {};

    // Merge requiredDependencies
    const allDependencies = new Set<string>();
    for (const metadata of metadataList) {
      if (metadata.requiredDependencies) {
        metadata.requiredDependencies.forEach(dep => allDependencies.add(dep));
      }
    }
    if (allDependencies.size > 0) {
      merged.requiredDependencies = Array.from(allDependencies);
    }

    // Merge applicableTo
    const allProjectTypes = new Set<ProjectType>();
    for (const metadata of metadataList) {
      if (metadata.applicableTo) {
        metadata.applicableTo.forEach(type => allProjectTypes.add(type));
      }
    }
    if (allProjectTypes.size > 0) {
      merged.applicableTo = Array.from(allProjectTypes);
    }

    // Merge filePatterns
    const allPatterns = new Set<string>();
    for (const metadata of metadataList) {
      if (metadata.filePatterns) {
        metadata.filePatterns.forEach(pattern => allPatterns.add(pattern));
      }
    }
    if (allPatterns.size > 0) {
      merged.filePatterns = Array.from(allPatterns);
    }

    // Merge enhancedTags
    const allTags = new Set<string>();
    for (const metadata of metadataList) {
      if (metadata.enhancedTags) {
        metadata.enhancedTags.forEach(tag => allTags.add(tag));
      }
    }
    if (allTags.size > 0) {
      merged.enhancedTags = Array.from(allTags);
    }

    return merged;
  }
}

