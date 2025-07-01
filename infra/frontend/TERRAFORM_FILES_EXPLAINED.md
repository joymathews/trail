
# Terraform Files Explained

This document explains the purpose of each Terraform file and the step-by-step flow of infrastructure creation for your static frontend hosting on AWS.

## File Overview

- **main.tf**: Defines all the main AWS resources (S3, CloudFront, ACM, Route 53) and how they connect.
- **variables.tf**: Lets you customize the deployment by setting variables like domain name, bucket name, and region.
- **outputs.tf**: Shows important information after deployment (e.g., CloudFront domain, S3 bucket name).
- **provider.tf**: Tells Terraform which AWS account/region to use.
- **versions.tf**: Ensures you use compatible Terraform and AWS provider versions.

## Infrastructure Creation Flow

1. **S3 Bucket Creation**
   - A private S3 bucket is created to store your frontend static files (HTML, JS, CSS, etc.).

2. **CloudFront Origin Access Identity (OAI)**
   - An OAI is created so CloudFront can securely access your private S3 bucket. This prevents direct public access to your files.

3. **S3 Bucket Policy**
   - A policy is attached to the S3 bucket, allowing only the CloudFront OAI to read files. This ensures your content is only accessible through CloudFront.

4. **ACM Certificate Request**
   - An SSL certificate is requested from AWS Certificate Manager (ACM) for your custom domain (e.g., `www.trail.joymathews.com`). This is required for HTTPS with CloudFront. The certificate is validated automatically using DNS records in Route 53.

5. **CloudFront Distribution**
   - CloudFront is configured to serve your static site globally, using the S3 bucket as the origin and the ACM certificate for HTTPS. Your custom domain (`www.trail.joymathews.com`) is set as an alias, so users access your site securely via HTTPS.

6. **Route 53 DNS Records**
   - DNS records are created in Route 53 to:
     - Validate the ACM certificate for `www.trail.joymathews.com` (so HTTPS works).
     - Point `www.trail.joymathews.com` to the CloudFront distribution (so users reach your site securely).

## How It All Connects

- You upload your frontend build to the S3 bucket.
- CloudFront fetches files from S3 (using the OAI) and serves them to users worldwide, enforcing HTTPS.
- Route 53 ensures your custom domain (`www.trail.joymathews.com`) points to CloudFront.
- The ACM certificate provides secure HTTPS for your subdomain.

## Typical Workflow

1. Edit variables in `variables.tf` or pass them via environment/CI.
2. Run `terraform init` to set up the project.
3. Run `terraform apply` to provision all resources.
4. Upload your frontend build to the S3 bucket (e.g., using AWS CLI or CI/CD pipeline).
5. Your site is now securely available at your custom domain (`https://www.trail.joymathews.com`) via CloudFront!

---
For more details, see comments in each `.tf` file or ask for specific resource explanations.
