import * as fs from 'fs/promises';
import * as path from 'path';
import { DocumentScanner } from '../services/DocumentScanner';
import { FrontmatterParser } from '../services/FrontmatterParser';

/**
 * Validation result for a single document
 */
interface ValidationResult {
  path: string;
  valid: boolean;
  issues: string[];
}

/**
 * Validation script for checking frontmatter completeness
 */
class ValidationScript {
  private scanner: DocumentScanner;
  private parser: FrontmatterParser;

  private validCount = 0;
  private invalidCount = 0;
  private results: ValidationResult[] = [];

  constructor() {
    this.scanner = new DocumentScanner();
    this.parser = new FrontmatterParser();
  }

  /**
   * Main execution function
   * @param repoRoot - Root directory of the repository
   */
  async run(repoRoot: string): Promise<void> {
    console.log('Starting frontmatter validation...');
    console.log(`Repository: ${repoRoot}`);
    console.log('');

    try {
      // Scan repository for documents
      console.log('Scanning repository for steering documents...');
      const documents = await this.scanner.scanRepository(repoRoot);
      console.log(`Found ${documents.length} documents to validate`);
      console.log('');

      // Validate each document
      for (let i = 0; i < documents.length; i++) {
        const doc = documents[i];
        const progress = `[${i + 1}/${documents.length}]`;

        const result = await this.validateDocument(doc.path);
        this.results.push(result);

        if (result.valid) {
          this.validCount++;
          console.log(`${progress} ✓ ${this.getRelativePath(repoRoot, doc.path)}`);
        } else {
          this.invalidCount++;
          console.log(`${progress} ✗ ${this.getRelativePath(repoRoot, doc.path)}`);
          for (const issue of result.issues) {
            console.log(`       - ${issue}`);
          }
        }
      }

      // Print summary
      this.printSummary();

      // Exit with error code if validation failed
      if (this.invalidCount > 0) {
        process.exit(1);
      }

    } catch (error) {
      console.error('Fatal error during validation:', error);
      process.exit(1);
    }
  }

  /**
   * Validate a single document
   * @param filePath - Path to the document
   * @returns Validation result
   */
  private async validateDocument(filePath: string): Promise<ValidationResult> {
    const result: ValidationResult = {
      path: filePath,
      valid: true,
      issues: []
    };

    try {
      // Read document content
      const content = await fs.readFile(filePath, 'utf-8');

      // Parse frontmatter
      const parsed = this.parser.parse(content);

      // Check for valid YAML
      if (!parsed.hasValidFrontmatter && Object.keys(parsed.frontmatter).length === 0) {
        result.valid = false;
        result.issues.push('Missing frontmatter');
        return result;
      }

      if (!parsed.hasValidFrontmatter) {
        result.valid = false;
        result.issues.push('Invalid YAML in frontmatter');
        return result;
      }

      const fm = parsed.frontmatter;

      // Requirement 7.1: Check for title field
      if (!fm.title || typeof fm.title !== 'string' || fm.title.trim() === '') {
        result.valid = false;
        result.issues.push('Missing or empty title field');
      }

      // Requirement 7.2: Check for description field
      if (!fm.description || typeof fm.description !== 'string' || fm.description.trim() === '') {
        result.valid = false;
        result.issues.push('Missing or empty description field');
      }

      // Requirement 7.3: Check for at least two tags
      if (!Array.isArray(fm.tags)) {
        result.valid = false;
        result.issues.push('Missing tags field (should be an array)');
      } else if (fm.tags.length < 2) {
        result.valid = false;
        result.issues.push(`Insufficient tags (has ${fm.tags.length}, needs at least 2)`);
      }

      // Requirement 7.4: Check framework documents have requiredDependencies
      // Note: Python frameworks (Django, FastAPI) are exempt as they don't use npm
      if (this.isFrameworkDocument(filePath, fm) && !this.isPythonFramework(fm)) {
        if (!fm.requiredDependencies || !Array.isArray(fm.requiredDependencies) || fm.requiredDependencies.length === 0) {
          result.valid = false;
          result.issues.push('Framework document missing requiredDependencies');
        }
      }

    } catch (error) {
      result.valid = false;
      result.issues.push(`Error reading file: ${error instanceof Error ? error.message : String(error)}`);
    }

    return result;
  }

  /**
   * Check if a document is framework-specific
   * @param filePath - Path to the document
   * @param frontmatter - Document frontmatter
   * @returns True if document is framework-specific
   */
  private isFrameworkDocument(filePath: string, frontmatter: Record<string, any>): boolean {
    const path = filePath.toLowerCase();
    const tags = Array.isArray(frontmatter.tags) ? frontmatter.tags : [];

    const frameworkIndicators = [
      'react',
      'vue',
      'angular',
      'express',
      'fastapi',
      'django',
      'flask',
      'nextjs',
      'nuxt',
      'svelte'
    ];

    // Check if path or tags contain framework indicators
    for (const indicator of frameworkIndicators) {
      if (path.includes(indicator)) {
        return true;
      }
      for (const tag of tags) {
        if (typeof tag === 'string' && tag.toLowerCase().includes(indicator)) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Check if a document is for a Python framework
   * @param frontmatter - Document frontmatter
   * @returns True if document is for a Python framework
   */
  private isPythonFramework(frontmatter: Record<string, any>): boolean {
    const tags = Array.isArray(frontmatter.tags) ? frontmatter.tags : [];

    const pythonFrameworks = ['django', 'fastapi', 'flask'];

    for (const tag of tags) {
      if (typeof tag === 'string') {
        const lowerTag = tag.toLowerCase();
        if (pythonFrameworks.includes(lowerTag) || lowerTag === 'python') {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Get relative path from repo root for cleaner logging
   */
  private getRelativePath(repoRoot: string, filePath: string): string {
    return path.relative(repoRoot, filePath);
  }

  /**
   * Print summary of validation results
   */
  private printSummary(): void {
    console.log('');
    console.log('═══════════════════════════════════════');
    console.log('Validation Summary');
    console.log('═══════════════════════════════════════');
    console.log(`Valid: ${this.validCount}`);
    console.log(`Invalid: ${this.invalidCount}`);
    console.log(`Total: ${this.validCount + this.invalidCount}`);

    if (this.invalidCount > 0) {
      console.log('');
      console.log('Documents with issues:');
      for (const result of this.results) {
        if (!result.valid) {
          console.log(`\n  ${result.path}`);
          for (const issue of result.issues) {
            console.log(`    - ${issue}`);
          }
        }
      }
    }

    console.log('═══════════════════════════════════════');

    if (this.invalidCount === 0) {
      console.log('✓ All documents have valid frontmatter!');
    } else {
      console.log(`✗ ${this.invalidCount} document(s) need attention`);
    }
  }
}

/**
 * Parse command-line arguments
 */
function parseArgs(): { repoRoot: string; help: boolean } {
  const args = process.argv.slice(2);

  let repoRoot = process.cwd();
  let help = false;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--help' || arg === '-h') {
      help = true;
    } else if (arg === '--path') {
      repoRoot = args[++i];
    }
  }

  return { repoRoot, help };
}

/**
 * Print usage information
 */
function printHelp(): void {
  console.log('Usage: npm run validate-frontmatter [options]');
  console.log('');
  console.log('Options:');
  console.log('  --path <path>     Specify custom repository path (default: current directory)');
  console.log('  --help, -h        Show this help message');
  console.log('');
  console.log('Examples:');
  console.log('  npm run validate-frontmatter');
  console.log('  npm run validate-frontmatter --path /path/to/repo');
}

/**
 * Main entry point
 */
async function main(): Promise<void> {
  const { repoRoot, help } = parseArgs();

  if (help) {
    printHelp();
    process.exit(0);
  }

  const script = new ValidationScript();
  await script.run(repoRoot);
}

// Run the script
main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
