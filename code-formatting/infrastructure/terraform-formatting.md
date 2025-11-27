---
title: Terraform Configuration Standards
description: Guides Kiro to write well-organized Terraform configurations with proper resource naming
category: code-quality
tags:
  - terraform
  - iac
  - infrastructure
  - devops
inclusion: always
---

## Core Principle

**Kiro writes clean, maintainable Terraform configurations with consistent naming, proper organization, and clear resource definitions.**

## How Kiro Will Write Terraform

### Resource Naming

**Descriptive resource names**: Use clear, consistent naming conventions

```hcl
# Kiro will write:
resource "aws_instance" "web_server" {
  ami           = var.ami_id
  instance_type = var.instance_type
  
  tags = {
    Name        = "${var.environment}-web-server"
    Environment = var.environment
    ManagedBy   = "terraform"
  }
}

resource "aws_security_group" "web_server_sg" {
  name        = "${var.environment}-web-server-sg"
  description = "Security group for web server"
  vpc_id      = aws_vpc.main.id
  
  tags = {
    Name        = "${var.environment}-web-server-sg"
    Environment = var.environment
  }
}

# Not:
resource "aws_instance" "server1" {
  ami = "ami-12345"
  instance_type = "t2.micro"
  tags = {
    Name = "server"
  }
}
```

### Variable Definitions

**Well-documented variables**: Include descriptions and validation

```hcl
# Kiro will write:
variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be dev, staging, or prod."
  }
}

variable "instance_type" {
  description = "EC2 instance type for web servers"
  type        = string
  default     = "t3.micro"
}

variable "tags" {
  description = "Common tags to apply to all resources"
  type        = map(string)
  default     = {}
}

# Not:
variable "env" {
  type = string
}

variable "instance_type" {
  default = "t2.micro"
}
```

### Module Structure

**Clear module organization**: Logical file structure and outputs

```hcl
# Kiro will write:
# modules/vpc/main.tf
resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true
  
  tags = merge(
    var.tags,
    {
      Name = "${var.environment}-vpc"
    }
  )
}

# modules/vpc/variables.tf
variable "environment" {
  description = "Environment name"
  type        = string
}

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
}

# modules/vpc/outputs.tf
output "vpc_id" {
  description = "ID of the VPC"
  value       = aws_vpc.main.id
}

output "vpc_cidr" {
  description = "CIDR block of the VPC"
  value       = aws_vpc.main.cidr_block
}

# Not:
# Everything in one file with no organization
resource "aws_vpc" "vpc" {
  cidr_block = "10.0.0.0/16"
}
```

### Resource Dependencies

**Explicit dependencies**: Use proper references and depends_on when needed

```hcl
# Kiro will write:
resource "aws_instance" "web_server" {
  ami           = var.ami_id
  instance_type = var.instance_type
  subnet_id     = aws_subnet.public.id
  
  vpc_security_group_ids = [
    aws_security_group.web_server_sg.id
  ]
  
  depends_on = [
    aws_internet_gateway.main
  ]
}

# Not:
resource "aws_instance" "web_server" {
  ami           = var.ami_id
  instance_type = var.instance_type
  subnet_id     = "subnet-12345"
  vpc_security_group_ids = ["sg-12345"]
}
```

## What This Prevents

- Unclear resource purposes from poor naming
- Undocumented variables that are hard to use
- Disorganized configurations that are hard to maintain
- Hardcoded values that reduce reusability
- Missing resource dependencies causing deployment issues

## Customization

This is a starting point! You can modify these rules by editing this steering document:

- Adjust naming conventions
- Change variable validation rules
- Modify tagging strategies
- Add cloud provider-specific patterns

## Optional: Validation with External Tools

Want to validate that generated Terraform follows these standards? Add these tools:

### Quick Setup (Optional)

```bash
# Install terraform and tflint
brew install terraform tflint  # macOS
# or
apt-get install terraform      # Linux
```

### Usage

```bash
# Format Terraform files
terraform fmt -recursive

# Validate configuration
terraform validate

# Lint with tflint
tflint
```

**Note**: These tools validate the Terraform after Kiro writes it, but aren't required for the steering document to work.
