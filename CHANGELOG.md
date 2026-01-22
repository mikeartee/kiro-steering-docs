# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Tasks.md Structure Standards - Guidelines for creating well-structured implementation plans with mandatory protocols

- Development Guidelines - Rigorous development practices with gap analysis, error handling, and debugging protocols

- New `agents/` category for Kiro agent steering documents

- BMAD Spec Converter Agent - Transforms BMAD planning documents into formal Kiro specifications
  - Converts BMAD PRDs and Architecture docs to Kiro specs
  - Generates EARS-formatted requirements
  - Extracts correctness properties for property-based testing
  - Creates implementation task plans with traceability
  - Supports three-phase workflow: requirements → design → tasks

- CHANGELOG.md to track project changes

### Changed

- Updated README.md to include Agents category and documentation

- Updated categories.json to include agents category
