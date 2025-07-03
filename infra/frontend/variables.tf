# List of CloudFront alias domains (e.g., ["sub.example.com", "www.sub.example.com"])
variable "cloudfront_alias_domains" {
  description = "List of domain names (aliases) for the CloudFront distribution."
  type        = list(string)
}

# ACM certificate domain name (primary)
variable "certificate_domain_name" {
  description = "Primary domain name for the ACM certificate (e.g., *.example.com)"
  type        = string
}

# ACM certificate SANs (Subject Alternative Names)
variable "certificate_sans" {
  description = "List of SANs for the ACM certificate (e.g., [\"sub.example.com\", \"www.sub.example.com\"])"
  type        = list(string)
}

variable "bucket_name" {
  description = "Name of the S3 bucket for frontend deployment"
  type        = string
}

variable "hosted_zone_id" {
  description = "Route53 Hosted Zone ID for the domain"
  type        = string
}

variable "aws_region" {
  description = "AWS region for resources (except ACM for CloudFront)"
  type        = string
}
