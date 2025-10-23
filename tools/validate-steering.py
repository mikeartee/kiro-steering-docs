#!/usr/bin/env python3
"""
Steering Document Validation Tool

Validates steering documents for proper frontmatter, YAML syntax,
and file references according to the Kiro steering documentation standards.
"""

import os
import sys
import yaml
import re
from pathlib import Path
from typing import Dict, List, Optional, Tuple


class ValidationError:
    def __init__(self, file_path: str, error_type: str, message: str, line_number: Optional[int] = None):
        self.file_path = file_path
        self.error_type = error_type
        self.message = message
        self.line_number = line_number

    def __str__(self):
        location = f":{self.line_number}" if self.line_number else ""
        return f"{self.file_path}{location} [{self.error_type}] {self.message}"


class SteeringValidator:
    REQUIRED_FIELDS = {
        'title': str,
        'description': str,
        'category': str,
        'tags': list,
        'inclusion': str
    }
    
    OPTIONAL_FIELDS = {
        'author': str,
        'version': str,
        'kiro_version': str,
        'dependencies': list,
        'file_references': list
    }
    
    VALID_CATEGORIES = {
        'code-quality',
        'testing', 
        'security',
        'frameworks',
        'workflows'
    }
    
    VALID_INCLUSION_VALUES = {
        'always',
        'fileMatch',
        'manual'
    }

    def __init__(self):
        self.errors: List[ValidationError] = []

    def validate_file(self, file_path: str) -> List[ValidationError]:
        """Validate a single steering document file."""
        self.errors = []
        
        if not os.path.exists(file_path):
            self.errors.append(ValidationError(file_path, "FILE_NOT_FOUND", "File does not exist"))
            return self.errors
            
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
        except Exception as e:
            self.errors.append(ValidationError(file_path, "READ_ERROR", f"Cannot read file: {e}"))
            return self.errors
            
        # Extract and validate frontmatter
        frontmatter, body = self._extract_frontmatter(file_path, content)
        if frontmatter is not None:
            self._validate_frontmatter(file_path, frontmatter)
            self._validate_file_references(file_path, frontmatter)
            
        # Validate markdown structure
        self._validate_markdown_structure(file_path, body)
        
        return self.errors

    def _extract_frontmatter(self, file_path: str, content: str) -> Tuple[Optional[Dict], str]:
        """Extract YAML frontmatter from markdown content."""
        if not content.startswith('---'):
            self.errors.append(ValidationError(file_path, "MISSING_FRONTMATTER", "File must start with YAML frontmatter"))
            return None, content
            
        # Find the closing ---
        lines = content.split('\n')
        frontmatter_end = -1
        for i, line in enumerate(lines[1:], 1):
            if line.strip() == '---':
                frontmatter_end = i
                break
                
        if frontmatter_end == -1:
            self.errors.append(ValidationError(file_path, "INVALID_FRONTMATTER", "Frontmatter not properly closed with ---"))
            return None, content
            
        frontmatter_content = '\n'.join(lines[1:frontmatter_end])
        body_content = '\n'.join(lines[frontmatter_end + 1:])
        
        # Parse YAML
        try:
            frontmatter = yaml.safe_load(frontmatter_content)
        except yaml.YAMLError as e:
            self.errors.append(ValidationError(file_path, "YAML_SYNTAX_ERROR", f"Invalid YAML syntax: {e}"))
            return None, body_content
            
        return frontmatter, body_content

    def _validate_frontmatter(self, file_path: str, frontmatter: Dict):
        """Validate frontmatter fields and values."""
        if not isinstance(frontmatter, dict):
            self.errors.append(ValidationError(file_path, "INVALID_FRONTMATTER", "Frontmatter must be a YAML object"))
            return
            
        # Check required fields
        for field, expected_type in self.REQUIRED_FIELDS.items():
            if field not in frontmatter:
                self.errors.append(ValidationError(file_path, "MISSING_REQUIRED_FIELD", f"Required field '{field}' is missing"))
                continue
                
            value = frontmatter[field]
            if not isinstance(value, expected_type):
                self.errors.append(ValidationError(file_path, "INVALID_FIELD_TYPE", 
                    f"Field '{field}' must be of type {expected_type.__name__}, got {type(value).__name__}"))
                    
        # Validate specific field values
        if 'category' in frontmatter:
            if frontmatter['category'] not in self.VALID_CATEGORIES:
                self.errors.append(ValidationError(file_path, "INVALID_CATEGORY", 
                    f"Category '{frontmatter['category']}' is not valid. Must be one of: {', '.join(self.VALID_CATEGORIES)}"))
                    
        if 'inclusion' in frontmatter:
            if frontmatter['inclusion'] not in self.VALID_INCLUSION_VALUES:
                self.errors.append(ValidationError(file_path, "INVALID_INCLUSION", 
                    f"Inclusion '{frontmatter['inclusion']}' is not valid. Must be one of: {', '.join(self.VALID_INCLUSION_VALUES)}"))
                    
        # Validate tags
        if 'tags' in frontmatter:
            tags = frontmatter['tags']
            if not isinstance(tags, list):
                self.errors.append(ValidationError(file_path, "INVALID_TAGS", "Tags must be a list"))
            elif not tags:
                self.errors.append(ValidationError(file_path, "EMPTY_TAGS", "Tags list cannot be empty"))
            else:
                for tag in tags:
                    if not isinstance(tag, str):
                        self.errors.append(ValidationError(file_path, "INVALID_TAG_TYPE", "All tags must be strings"))
                        
        # Check optional fields types
        for field, expected_type in self.OPTIONAL_FIELDS.items():
            if field in frontmatter:
                value = frontmatter[field]
                if not isinstance(value, expected_type):
                    self.errors.append(ValidationError(file_path, "INVALID_FIELD_TYPE", 
                        f"Field '{field}' must be of type {expected_type.__name__}, got {type(value).__name__}"))

    def _validate_file_references(self, file_path: str, frontmatter: Dict):
        """Validate that referenced files exist."""
        if 'file_references' not in frontmatter:
            return
            
        file_references = frontmatter['file_references']
        if not isinstance(file_references, list):
            return  # Already handled in frontmatter validation
            
        base_dir = os.path.dirname(file_path)
        for ref in file_references:
            if not isinstance(ref, str):
                continue  # Already handled in frontmatter validation
                
            # Check if referenced file exists relative to the steering document
            ref_path = os.path.join(base_dir, ref)
            if not os.path.exists(ref_path):
                # Also check relative to repository root
                repo_root = self._find_repo_root(file_path)
                if repo_root:
                    ref_path = os.path.join(repo_root, ref)
                    
                if not os.path.exists(ref_path):
                    self.errors.append(ValidationError(file_path, "MISSING_FILE_REFERENCE", 
                        f"Referenced file '{ref}' does not exist"))

    def _validate_markdown_structure(self, file_path: str, body: str):
        """Validate markdown structure and required sections."""
        if not body.strip():
            self.errors.append(ValidationError(file_path, "EMPTY_BODY", "Document body cannot be empty"))
            return
            
        # Check for required sections based on steering document standards
        required_sections = [
            r'##\s+Core Principle',
            r'##\s+How Kiro Will Write',
            r'##\s+What This Prevents'
        ]
        
        for section_pattern in required_sections:
            if not re.search(section_pattern, body, re.IGNORECASE):
                section_name = section_pattern.replace(r'##\s+', '').replace(r'\s+', ' ')
                self.errors.append(ValidationError(file_path, "MISSING_SECTION", 
                    f"Required section '{section_name}' is missing"))

    def _find_repo_root(self, file_path: str) -> Optional[str]:
        """Find the repository root directory."""
        current_dir = os.path.dirname(os.path.abspath(file_path))
        while current_dir != os.path.dirname(current_dir):  # Not at filesystem root
            if os.path.exists(os.path.join(current_dir, '.git')):
                return current_dir
            current_dir = os.path.dirname(current_dir)
        return None

    def validate_directory(self, directory: str) -> Dict[str, List[ValidationError]]:
        """Validate all .md files in a directory."""
        results = {}
        
        if not os.path.exists(directory):
            return {directory: [ValidationError(directory, "DIRECTORY_NOT_FOUND", "Directory does not exist")]}
            
        for root, dirs, files in os.walk(directory):
            for file in files:
                if file.endswith('.md') and file.upper() != 'README.MD':
                    file_path = os.path.join(root, file)
                    results[file_path] = self.validate_file(file_path)
                    
        return results


def main():
    """Command line interface for the validation tool."""
    if len(sys.argv) < 2:
        print("Usage: python validate-steering.py <file_or_directory>")
        print("       python validate-steering.py --help")
        sys.exit(1)
        
    if sys.argv[1] == '--help':
        print(__doc__)
        print("\nUsage:")
        print("  python validate-steering.py <file.md>           # Validate single file")
        print("  python validate-steering.py <directory>        # Validate all .md files in directory")
        print("  python validate-steering.py --help             # Show this help")
        sys.exit(0)
        
    target = sys.argv[1]
    validator = SteeringValidator()
    
    if os.path.isfile(target):
        errors = validator.validate_file(target)
        if errors:
            print(f"Validation errors in {target}:")
            for error in errors:
                print(f"  {error}")
            sys.exit(1)
        else:
            print(f"✓ {target} is valid")
    elif os.path.isdir(target):
        results = validator.validate_directory(target)
        total_errors = 0
        
        for file_path, errors in results.items():
            if errors:
                print(f"Validation errors in {file_path}:")
                for error in errors:
                    print(f"  {error}")
                total_errors += len(errors)
            else:
                print(f"✓ {file_path} is valid")
                
        if total_errors > 0:
            print(f"\nTotal: {total_errors} validation errors found")
            sys.exit(1)
        else:
            print(f"\n✓ All files are valid")
    else:
        print(f"Error: {target} is not a valid file or directory")
        sys.exit(1)


if __name__ == '__main__':
    main()