/**
 * Project type classification
 */
export enum ProjectType {
  WEB_APP = 'web-app',
  LIBRARY = 'library',
  CLI_TOOL = 'cli-tool',
  API_SERVER = 'api-server',
  VSCODE_EXTENSION = 'vscode-extension'
}

/**
 * Location of a document in the repository
 */
export interface DocumentLocation {
  path: string;
  category: string;
  subcategory?: string;
}

/**
 * Parsed document with frontmatter and body separated
 */
export interface ParsedDocument {
  frontmatter: Record<string, any>;
  body: string;
  hasValidFrontmatter: boolean;
}

/**
 * Recommendation metadata to be added to documents
 */
export interface RecommendationMetadata {
  requiredDependencies?: string[];
  applicableTo?: ProjectType[];
  filePatterns?: string[];
  enhancedTags?: string[];
}

/**
 * Context for analyzing a document to determine metadata
 */
export interface AnalysisContext {
  documentPath: string;
  category: string;
  subcategory?: string;
  existingFrontmatter: Record<string, any>;
  bodyContent: string;
}

/**
 * Error codes for enhancement operations
 */
export enum EnhancementErrorCode {
  INVALID_YAML = 'INVALID_YAML',
  MISSING_FRONTMATTER = 'MISSING_FRONTMATTER',
  FILE_ACCESS_ERROR = 'FILE_ACCESS_ERROR',
  AMBIGUOUS_CATEGORY = 'AMBIGUOUS_CATEGORY',
  CONFLICTING_METADATA = 'CONFLICTING_METADATA'
}

/**
 * Custom error class for enhancement errors
 */
export class EnhancementError extends Error {
  constructor(
    public code: EnhancementErrorCode,
    public documentPath: string,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'EnhancementError';
  }
}

/**
 * Result of a write operation
 */
export interface WriteResult {
  success: boolean;
  path: string;
  error?: string;
}

/**
 * Metadata rule for determining document metadata
 */
export interface MetadataRule {
  condition: (context: AnalysisContext) => boolean;
  metadata: RecommendationMetadata | ((context: AnalysisContext) => RecommendationMetadata);
}

/**
 * Options for merging frontmatter
 */
export interface MergeOptions {
  preserveExisting: boolean;
  overwriteTags: boolean;
}
