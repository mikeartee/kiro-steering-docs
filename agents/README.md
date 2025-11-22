# Agents

Specialized Kiro agent personas and workflows for specific development tasks.

## What Are Agent Steering Documents?

Agent steering documents define specialized personas that Kiro can adopt for specific workflows. Unlike general steering documents that apply to all code generation, agent documents create focused contexts for complex, multi-step processes.

## Available Agents

### BMAD Spec Converter

**Context Key**: `@bmad-spec-converter`

Transforms BMAD planning documents (PRDs, Architecture) into formal Kiro specifications with EARS requirements, correctness properties, and property-based testing strategies.

**Use When**:
- Converting BMAD documents to Kiro specs
- Creating formal requirements from user stories
- Extracting correctness properties for testing
- Building implementation plans with traceability

**Key Features**:
- Three-phase workflow (requirements → design → tasks)
- EARS-formatted requirements
- Property-based testing integration
- Full traceability from BMAD to implementation

[View Full Documentation](bmad-spec-converter-agent.md)

## How to Use Agent Documents

1. **Activate**: Reference the agent using its context key in chat (e.g., `@bmad-spec-converter`)
2. **Command**: Use agent-specific commands (e.g., `*analyze`, `*convert`)
3. **Follow**: The agent guides you through its specialized workflow
4. **Customize**: Modify the agent document to match your team's process

## Creating Your Own Agents

Agent documents are perfect for:
- Multi-step workflows with specific phases
- Domain-specific development processes
- Team-specific methodologies
- Complex transformations or conversions

See the [template](../templates/steering-document-template.md) and [BMAD Spec Converter](bmad-spec-converter-agent.md) as examples.

## Contributing

Have a specialized workflow that would benefit the community? Contribute your agent document! See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.
