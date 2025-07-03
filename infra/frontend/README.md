# Frontend Infrastructure (Terraform)

This module provisions AWS resources for static frontend hosting:
- Private S3 bucket
- CloudFront distribution (with OAI)
- Route53 DNS record
- ACM certificate (must be created in us-east-1)

## Usage

See variables in `variables.tf`. Trigger this via CI/CD (e.g., GitHub Actions).
