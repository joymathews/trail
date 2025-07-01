variable "bucket_name" {
  description = "Name of the S3 bucket for frontend deployment"
  type        = string
}

variable "cloudfront_alias_domain" {
  description = "The domain name (subdomain) users will visit for your frontend (e.g. sub.example.com). Used for CloudFront alias and Route53 DNS, not for certificate creation. Should match a subdomain covered by your ACM certificate."
  type        = string
}

variable "certificate_domain_name" {
  description = "The domain name for the ACM certificate (e.g. *.example.com for wildcard, or a specific domain like www.example.com)"
  type        = string
}

variable "certificate_san" {
  description = "A list of Subject Alternative Names (SANs) for the ACM certificate (e.g. [\"example.com\"])"
  type        = list(string)
}

variable "hosted_zone_id" {
  description = "Route53 Hosted Zone ID for the domain"
  type        = string
}


variable "aws_region" {
  description = "AWS region for resources (except ACM for CloudFront)"
  type        = string
  default     = "ap-south-1"
}
