import * as yaml from 'js-yaml';
import { ParsedDocument } from '../types';

/**
 * Service for parsing and manipulating YAML frontmatter in markdown documents
 */
export class FrontmatterParser {
  private readonly FRONTMATTER_DELIMITER = '---';

  /**
   * Parse a markdown document to extract YAML frontmatter and body
   * @param content The full markdown document content
   * @returns ParsedDocument with frontmatter object, body string, and validity flag
   */
  parse(content: string): ParsedDocument {
    const lines = content.split('\n');

    // Check if document starts with frontmatter delimiter
    if (lines.length === 0 || lines[0].trim() !== this.FRONTMATTER_DELIMITER) {
      return {
        frontmatter: {},
        body: content,
        hasValidFrontmatter: false
      };
    }

    // Find the closing delimiter
    let closingDelimiterIndex = -1;
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim() === this.FRONTMATTER_DELIMITER) {
        closingDelimiterIndex = i;
        break;
      }
    }

    // If no closing delimiter found, treat as no frontmatter
    if (closingDelimiterIndex === -1) {
      return {
        frontmatter: {},
        body: content,
        hasValidFrontmatter: false
      };
    }

    // Extract frontmatter content between delimiters
    const frontmatterContent = lines.slice(1, closingDelimiterIndex).join('\n');
    const body = lines.slice(closingDelimiterIndex + 1).join('\n');

    // Parse YAML frontmatter with error handling
    let frontmatter: Record<string, any> = {};
    let hasValidFrontmatter = false;

    try {
      const parsed = yaml.load(frontmatterContent);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        frontmatter = parsed as Record<string, any>;
        hasValidFrontmatter = true;
      }
    } catch (error) {
      // If YAML parsing fails, return empty frontmatter with error flag
      console.error('Failed to parse frontmatter YAML:', error);
      hasValidFrontmatter = false;
    }

    return {
      frontmatter,
      body,
      hasValidFrontmatter
    };
  }

  /**
   * Combine frontmatter and body into a complete markdown document
   * @param frontmatter The frontmatter object to serialize
   * @param body The markdown body content
   * @returns Complete markdown document with frontmatter
   */
  stringify(frontmatter: Record<string, any>, body: string): string {
    // If frontmatter is empty, return just the body
    if (Object.keys(frontmatter).length === 0) {
      return body;
    }

    // Serialize frontmatter to YAML with proper formatting
    const yamlContent = yaml.dump(frontmatter, {
      indent: 2,           // Use 2-space indentation
      lineWidth: -1,       // Don't wrap lines
      noRefs: true,        // Don't use references
      sortKeys: false      // Preserve key order
    });

    // Ensure proper spacing between frontmatter and body
    const trimmedBody = body.startsWith('\n') ? body : '\n' + body;

    // Combine with delimiters
    return `${this.FRONTMATTER_DELIMITER}\n${yamlContent}${this.FRONTMATTER_DELIMITER}${trimmedBody}`;
  }
}
