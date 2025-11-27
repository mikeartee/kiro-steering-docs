import * as fs from 'fs/promises';
import * as path from 'path';
import { DocumentScanner } from '../services/DocumentScanner';
import { FrontmatterParser } from '../services/FrontmatterParser';
import { MetadataAnalyzer } from '../services/MetadataAnalyzer';
import { FrontmatterMerger } from '../services/FrontmatterMerger';
import { DocumentWriter } from '../services/DocumentWriter';
import { AnalysisContext, EnhancementError, EnhancementErrorCode } from '../types';

/**
 * Main enhancement script for adding recommendation metadata to steering documents
 */
class EnhancementScript {
  private scanner: DocumentScanner;
  private parser: FrontmatterParser;
  private analyzer: MetadataAnalyzer;
  private merger: FrontmatterMerger;
  private writer: DocumentWriter;

  private successCount = 0;
  private errorCount = 0;
  private errors: Array<{ path: string; error: string }> = [];

  constructor() {
    this.scanner = new DocumentScanner();
    this.parser = new FrontmatterParser();
    this.analyzer = new MetadataAnalyzer();
    this.merger = new FrontmatterMerger();
    this.writer = new DocumentWriter();
  }

  /**
   * Main execution function
   * @param repoRoot - Root directory of the repository
   * @param dryRun - If true, preview changes without writing
   */
  async run(repoRoot: string, dryRun: boolean = false): Promise<void> {
    console.log('Starting frontmatter enhancement...');
    console.log(`Repository: ${repoRoot}`);
    console.log(`Mode: ${dryRun ? 'DRY RUN (preview only)' : 'LIVE (writing changes)'}`);
    console.log('');

    try {
      // Scan repository for documents
      console.log('Scanning repository for steering documents...');
      const documents = await this.scanner.scanRepository(repoRoot);
      console.log(`Found ${documents.length} documents to process`);
      console.log('');

      // Process each document
      for (let i = 0; i < documents.length; i++) {
        const doc = documents[i];
        const progress = `[${i + 1}/${documents.length}]`;

        try {
          await this.processDocument(doc.path, doc.category, doc.subcategory, dryRun);
          this.successCount++;
          console.log(`${progress} ✓ ${this.getRelativePath(repoRoot, doc.path)}`);
        } catch (error) {
          this.errorCount++;
          const errorMessage = error instanceof Error ? error.message : String(error);
          this.errors.push({ path: doc.path, error: errorMessage });
          console.error(`${progress} ✗ ${this.getRelativePath(repoRoot, doc.path)}: ${errorMessage}`);
        }
      }

      // Print summary
      this.printSummary(dryRun);

    } catch (error) {
      console.error('Fatal error during enhancement:', error);
      process.exit(1);
    }
  }

  /**
   * Process a single document
   * @param filePath - Path to the document
   * @param category - Document category
   * @param subcategory - Document subcategory
   * @param dryRun - If true, preview changes without writing
   */
  private async processDocument(
    filePath: string,
    category: string,
    subcategory: string | undefined,
    dryRun: boolean
  ): Promise<void> {
    // Read document content
    const content = await fs.readFile(filePath, 'utf-8');

    // Parse frontmatter
    const parsed = this.parser.parse(content);

    if (!parsed.hasValidFrontmatter && Object.keys(parsed.frontmatter).length > 0) {
      throw new EnhancementError(
        EnhancementErrorCode.INVALID_YAML,
        filePath,
        'Document has invalid YAML frontmatter'
      );
    }

    // Create analysis context
    const context: AnalysisContext = {
      documentPath: filePath,
      category,
      subcategory,
      existingFrontmatter: parsed.frontmatter,
      bodyContent: parsed.body
    };

    // Analyze document to determine metadata
    const metadata = this.analyzer.analyze(context);

    // Merge with existing frontmatter
    const mergedFrontmatter = this.merger.merge(parsed.frontmatter, metadata);

    // Preview or write changes
    if (dryRun) {
      // Just log what would be changed (could expand this for more detail)
      // For now, we just verify it processes successfully
    } else {
      // Write updated document
      const result = await this.writer.write(filePath, mergedFrontmatter, parsed.body);
      if (!result.success) {
        throw new Error(result.error || 'Unknown write error');
      }
    }
  }

  /**
   * Get relative path from repo root for cleaner logging
   */
  private getRelativePath(repoRoot: string, filePath: string): string {
    return path.relative(repoRoot, filePath);
  }

  /**
   * Print summary of enhancement results
   */
  private printSummary(dryRun: boolean): void {
    console.log('');
    console.log('═══════════════════════════════════════');
    console.log('Enhancement Summary');
    console.log('═══════════════════════════════════════');
    console.log(`Mode: ${dryRun ? 'DRY RUN' : 'LIVE'}`);
    console.log(`Successful: ${this.successCount}`);
    console.log(`Failed: ${this.errorCount}`);

    if (this.errors.length > 0) {
      console.log('');
      console.log('Errors:');
      for (const error of this.errors) {
        console.log(`  - ${error.path}`);
        console.log(`    ${error.error}`);
      }
    }

    console.log('═══════════════════════════════════════');
  }
}

/**
 * Parse command-line arguments
 */
function parseArgs(): { repoRoot: string; dryRun: boolean; help: boolean } {
  const args = process.argv.slice(2);

  let repoRoot = process.cwd();
  let dryRun = false;
  let help = false;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--help' || arg === '-h') {
      help = true;
    } else if (arg === '--dry-run') {
      dryRun = true;
    } else if (arg === '--path') {
      repoRoot = args[++i];
    }
  }

  return { repoRoot, dryRun, help };
}

/**
 * Print usage information
 */
function printHelp(): void {
  console.log('Usage: npm run enhance-frontmatter [options]');
  console.log('');
  console.log('Options:');
  console.log('  --dry-run         Preview changes without writing to files');
  console.log('  --path <path>     Specify custom repository path (default: current directory)');
  console.log('  --help, -h        Show this help message');
  console.log('');
  console.log('Examples:');
  console.log('  npm run enhance-frontmatter --dry-run');
  console.log('  npm run enhance-frontmatter --path /path/to/repo');
}

/**
 * Main entry point
 */
async function main(): Promise<void> {
  const { repoRoot, dryRun, help } = parseArgs();

  if (help) {
    printHelp();
    process.exit(0);
  }

  const script = new EnhancementScript();
  await script.run(repoRoot, dryRun);
}

// Run the script
main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
