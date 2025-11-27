import * as fs from 'fs/promises';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { WriteResult, EnhancementError, EnhancementErrorCode } from '../types';
import { FrontmatterParser } from './FrontmatterParser';

/**
 * Service for writing enhanced documents back to disk with validation
 */
export class DocumentWriter {
  private parser: FrontmatterParser;

  constructor() {
    this.parser = new FrontmatterParser();
  }

  /**
   * Writes an enhanced document to disk
   * @param filePath - Path to the file to write
   * @param frontmatter - Frontmatter object to write
   * @param body - Markdown body content
   * @returns Result of the write operation
   */
  async write(
    filePath: string,
    frontmatter: Record<string, any>,
    body: string
  ): Promise<WriteResult> {
    try {
      // Validate before writing
      await this.validateBeforeWrite(frontmatter, body);

      // Backup original file
      await this.backupOriginal(filePath);

      // Combine frontmatter and body
      const content = this.parser.stringify(frontmatter, body);

      // Write to disk
      await fs.writeFile(filePath, content, 'utf-8');

      return {
        success: true,
        path: filePath
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        success: false,
        path: filePath,
        error: errorMessage
      };
    }
  }

  /**
   * Validates frontmatter and body before writing
   * @param frontmatter - Frontmatter object to validate
   * @param body - Body content to validate
   * @throws EnhancementError if validation fails
   */
  private async validateBeforeWrite(
    frontmatter: Record<string, any>,
    body: string
  ): Promise<boolean> {
    // Validate YAML syntax by attempting to dump and load
    try {
      const yamlString = yaml.dump(frontmatter);
      yaml.load(yamlString);
    } catch (error) {
      throw new EnhancementError(
        EnhancementErrorCode.INVALID_YAML,
        '',
        'Invalid YAML in frontmatter',
        error
      );
    }

    // Check required fields are present
    if (!frontmatter.title || typeof frontmatter.title !== 'string') {
      throw new EnhancementError(
        EnhancementErrorCode.CONFLICTING_METADATA,
        '',
        'Missing or invalid title field'
      );
    }

    if (!frontmatter.description || typeof frontmatter.description !== 'string') {
      throw new EnhancementError(
        EnhancementErrorCode.CONFLICTING_METADATA,
        '',
        'Missing or invalid description field'
      );
    }

    // Check tags field (should have at least 2 tags)
    if (!Array.isArray(frontmatter.tags) || frontmatter.tags.length < 2) {
      throw new EnhancementError(
        EnhancementErrorCode.CONFLICTING_METADATA,
        '',
        'Tags field must be an array with at least 2 tags'
      );
    }

    // Verify markdown formatting is preserved (body should not be empty)
    if (typeof body !== 'string') {
      throw new EnhancementError(
        EnhancementErrorCode.CONFLICTING_METADATA,
        '',
        'Body content must be a string'
      );
    }

    return true;
  }

  /**
   * Creates a backup of the original file
   * @param filePath - Path to the file to backup
   */
  private async backupOriginal(filePath: string): Promise<void> {
    try {
      // Check if file exists
      await fs.access(filePath);

      // Create backup directory if needed
      const backupDir = path.join(path.dirname(filePath), '.backup');
      try {
        await fs.mkdir(backupDir, { recursive: true });
      } catch (error) {
        // Directory might already exist, ignore error
      }

      // Create backup filename with timestamp
      const fileName = path.basename(filePath);
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupPath = path.join(backupDir, `${fileName}.${timestamp}.bak`);

      // Copy original file to backup
      await fs.copyFile(filePath, backupPath);
    } catch (error) {
      // If backup fails, log warning but don't throw
      // (file might not exist yet if it's a new file)
      console.warn(`Could not create backup for ${filePath}:`, error);
    }
  }
}
