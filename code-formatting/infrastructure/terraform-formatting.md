---
title: Terraform Code Style Guidelines
description: Guides Kiro to write consistent, maintainable Terraform following HashiCorp's official style conventions
category: code-quality
tags:
  - terraform
  - infrastructure
  - iac
  - formatting
  - hashicorp
inclusion: always
---

## Core Principle

**Kiro writes Terraform code following HashiCorp's official style guide for consistent, maintainable infrastructure-as-code.** When generating or editing .tf files, Kiro automatically applies these conventions for formatting, structure, and organization.

## RULES

You MUST follow these rules when creating or editing Terraform files:

1. You MUST use 2-space indentation for each nesting level

2. You MUST align equals signs for consecutive single-line arguments

3. You MUST organize files into main.tf, variables.tf, outputs.tf structure

4. You MUST use snake_case for resource names without type prefixes

5. You MUST place meta-arguments (count, for_each) before resource parameters

6. You MUST place lifecycle blocks last, separated by blank lines

7. You MUST use ~> for provider version constraints (pessimistic)

8. You MUST set sensitive = true for sensitive variables and outputs

9. You MUST run terraform fmt before committing

10. You MUST NOT commit terraform.tfstate or .terraform/ directory

**Note:** These rules apply to all Terraform providers (AWS, Azure, GCP, Kubernetes, etc.).

## How Kiro Will Write Terraform

### File Structure

**Standard module layout**: Consistent file organization for all modules

```text
# Kiro will create:
module/
├── README.md           # Module documentation
├── main.tf            # Primary resources
├── variables.tf       # Input variables (alphabetical)
├── outputs.tf         # Output values (alphabetical)
├── providers.tf       # Provider configurations
├── terraform.tf       # Version requirements
├── locals.tf          # Local values (optional)
└── modules/           # Nested modules
    └── nested/
        ├── README.md
        ├── main.tf
        ├── variables.tf
        └── outputs.tf

# Not scattered or inconsistent naming

```

### Code Formatting

**Consistent indentation and alignment**: Clean, readable code structure

```hcl
# Kiro will write:
resource "aws_instance" "web_server" {
  count = var.enable_web ? 1 : 0
  
  ami           = var.ami_id
  instance_type = var.instance_type
  subnet_id     = aws_subnet.public.id
  
  vpc_security_group_ids = [
    aws_security_group.web_server_sg.id
  ]
  
  tags = {
    Name        = "${var.environment}-web-server"
    Environment = var.environment
    ManagedBy   = "terraform"
  }
  
  lifecycle {
    create_before_destroy = true
  }
}

# Not:
resource "aws_instance" "webserver_instance" {
ami = var.ami_id
instance_type = var.instance_type
count = var.enable_web ? 1 : 0
tags = {
Name = "server"
}
}

```

### Resource Naming

**Descriptive nouns with underscores**: Clear, consistent naming without type prefixes

```hcl
# Kiro will write:
resource "aws_instance" "web_server" {}
resource "aws_security_group" "allow_https" {}
resource "aws_s3_bucket" "application_logs" {}

variable "instance_type" {}
variable "enable_monitoring" {}

# Not:
resource "aws_instance" "webserver_instance" {}  # Type in name
resource "aws_security_group" "sg_https" {}      # Abbreviation
variable "instanceType" {}                       # camelCase

```

### Variable Definitions

**Well-documented with validation**: Include type, description, defaults, and validation

```hcl
# Kiro will write:
variable "environment" {
  type        = string
  description = "Deployment environment (dev, staging, prod)"
  
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be dev, staging, or prod."
  }
}

variable "database_password" {
  type        = string
  description = "Database administrator password"
  sensitive   = true
}

variable "instance_type" {
  type        = string
  description = "EC2 instance type for web servers"
  default     = "t3.micro"
}

# Not:
variable "env" {
  type = string
}

variable "db_pass" {
  default = "password123"  # No sensitive flag!
}

```

### Output Definitions

**Descriptive outputs with sensitivity flags**: Clear output documentation

```hcl
# Kiro will write:
output "instance_id" {
  description = "ID of the EC2 instance"
  value       = aws_instance.web_server.id
}

output "database_endpoint" {
  description = "Database connection endpoint"
  value       = aws_db_instance.main.endpoint
  sensitive   = true
}

# Not:
output "id" {
  value = aws_instance.web_server.id
}

```

### Dynamic Resources

**count for on/off, for_each for distinct values**: Appropriate meta-argument usage

```hcl
# Kiro will write:

# count for conditional resources or identical copies
resource "aws_nat_gateway" "main" {
  count = var.enable_nat ? 1 : 0
  
  allocation_id = aws_eip.nat[count.index].id
  subnet_id     = aws_subnet.public[count.index].id
}

# for_each for distinct values
resource "aws_subnet" "private" {
  for_each = toset(var.availability_zones)
  
  vpc_id            = aws_vpc.main.id
  availability_zone = each.value
  cidr_block        = cidrsubnet(var.vpc_cidr, 8, index(var.availability_zones, each.value))
}

# Not mixing or using wrong meta-argument

```

### Version Management

**Explicit version constraints**: Pin versions with pessimistic constraints

```hcl
# Kiro will write:
terraform {
  required_version = ">= 1.0"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"  # Allows 5.x updates, not 6.0
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.5"
    }
  }
}

# Not:
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.0"  # Too open-ended
    }
  }
}

```

### Security Practices

**Never hardcode secrets**: Use external secret management

```hcl
# Kiro will write:

# Retrieve secrets from external sources
data "aws_secretsmanager_secret_version" "db_password" {
  secret_id = "prod/database/password"
}

resource "aws_db_instance" "main" {
  password = data.aws_secretsmanager_secret_version.db_password.secret_string
}

# Mark sensitive variables
variable "api_key" {
  type      = string
  sensitive = true
}

# Not:
resource "aws_db_instance" "main" {
  password = "hardcoded_password_123"  # Never do this!
}

```

### Local Values

**Computed values and common expressions**: Use locals for DRY principle

```hcl
# Kiro will write:
locals {
  common_tags = {
    Environment = var.environment
    ManagedBy   = "terraform"
    Project     = var.project_name
  }
  
  name_prefix = "${var.environment}-${var.project_name}"
}

resource "aws_instance" "web_server" {
  tags = merge(
    local.common_tags,
    {
      Name = "${local.name_prefix}-web-server"
    }
  )
}

# Not repeating values everywhere

```

### Module Usage

**Pin module versions**: Use version constraints for external modules

```hcl
# Kiro will write:
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.1"
  
  name = "${var.environment}-vpc"
  cidr = var.vpc_cidr
  
  azs             = var.availability_zones
  private_subnets = var.private_subnet_cidrs
  public_subnets  = var.public_subnet_cidrs
  
  enable_nat_gateway = true
  single_nat_gateway = var.environment != "prod"
  
  tags = local.common_tags
}

# Not:
module "vpc" {
  source = "terraform-aws-modules/vpc/aws"  # No version!
  name   = "my-vpc"
  cidr   = "10.0.0.0/16"
}

```

## What This Prevents

- **Inconsistent formatting** across team members and CI/CD

- **Module confusion** from non-standard file organization

- **Version conflicts** from open-ended provider constraints

- **Security leaks** from committed state files or hardcoded secrets

- **Merge conflicts** from inconsistent argument ordering

- **Resource naming confusion** from type prefixes in names

- **State corruption** from improper state management

- **Undocumented variables** that are hard to use

- **Missing validation** that allows invalid inputs

## Customization

This is a starting point based on HashiCorp's official style guide. You can modify these rules by editing this steering document:

- Adjust naming conventions for your organization

- Change variable validation rules

- Modify tagging strategies

- Add cloud provider-specific patterns

- Customize module structure requirements

## Optional: Validation with External Tools

Want to validate that generated Terraform follows these standards? Add these tools:

### Quick Setup (Optional)

```bash
# Install terraform and tflint
brew install terraform tflint  # macOS
# or
apt-get install terraform      # Linux
# or
choco install terraform tflint # Windows

```

### Usage

```bash
# Format Terraform files (automatic)
terraform fmt -recursive

# Validate configuration
terraform validate

# Lint with tflint
tflint

# Check for security issues
tfsec .

```

**Note**: These tools validate the Terraform after Kiro writes it, but aren't required for the steering document to work.
