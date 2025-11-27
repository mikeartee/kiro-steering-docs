import * as fs from 'fs/promises';
import * as path from 'path';
import { DocumentLocation } from '../types';

/**
 * Service for scanning the repository to find all steering documents
 */
export class DocumentScanner {
  private readonly TARGET_DIRECTORIES = ['code-formatting', 'practices', 'agents'];
  private readonly EXCLUDED_DIRECTORIES = ['docs', 'templates', 'node_modules', '.git', 'out'];
  private readonly EXCLUDED_FILES = ['README.md', 'CONTRIBUTING.md', 'LICENSE.md', 'CHANGELOG.md'];

  /**
   * Scans the repository for all steering documents
   * @param repoRoot - Root directory of the repository
   * @returns Array of document locations with path and category information
   */
  async scanRepository(repoRoot: string): Promise<DocumentLocation[]> {
    const documents: DocumentLocation[] = [];

    for (const category of this.TARGET_DIRECTORIES) {
      const categoryPath = path.join(repoRoot, category);

      try {
        await fs.access(categoryPath);
        const categoryDocuments = await this.scanDirectory(categoryPath, category);
        documents.push(...categoryDocuments);
      } catch (error) {
        // Directory doesn't exist, skip it
        console.warn(`Category directory not found: ${categoryPath}`);
      }
    }

    return documents;
  }

  /**
   * Recursively scans a directory for markdown files
   * @param dir - Directory to scan
   * @param category - Category name (code-formatting, practices, agents)
   * @returns Array of document locations in this directory
   */
  private async scanDirectory(dir: string, category: string): Promise<DocumentLocation[]> {
    const documents: DocumentLocation[] = [];

    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
          // Skip excluded directories
          if (this.EXCLUDED_DIRECTORIES.includes(entry.name)) {
            continue;
          }
          // Recursively scan subdirectories
          const subdirDocuments = await this.scanDirectory(fullPath, category);
          documents.push(...subdirDocuments);
        } else if (entry.isFile() && entry.name.endsWith('.md')) {
          // Check if this file should be included
          if (this.shouldInclude(fullPath)) {
            const subcategory = this.determineSubcategory(fullPath);
            documents.push({
              path: fullPath,
              category,
              subcategory
            });
          }
        }
      }
    } catch (error) {
      console.error(`Error scanning directory ${dir}:`, error);
    }

    return documents;
  }

  /**
   * Determines if a file should be included in the enhancement process
   * @param filePath - Full path to the file
   * @returns True if file should be included, false otherwise
   */
  private shouldInclude(filePath: string): boolean {
    const fileName = path.basename(filePath);

    // Exclude specific documentation files
    if (this.EXCLUDED_FILES.includes(fileName)) {
      return false;
    }

    // Exclude files in excluded directories
    const normalizedPath = filePath.split(path.sep);
    for (const excludedDir of this.EXCLUDED_DIRECTORIES) {
      if (normalizedPath.includes(excludedDir)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Determines the subcategory from the file path
   * @param filePath - Full path to the file
   * @returns Subcategory name or undefined
   */
  private determineSubcategory(filePath: string): string | undefined {
    const normalizedPath = filePath.toLowerCase();
    const parts = normalizedPath.split(path.sep);

    // Look for subcategory indicators in the path
    const subcategoryIndicators = [
      'languages',
      'frameworks',
      'testing',
      'security',
      'code-quality',
      'workflow',
      'git'
    ];

    for (const indicator of subcategoryIndicators) {
      if (parts.some(part => part.includes(indicator))) {
        return indicator;
      }
    }

    return undefined;
  }
}
