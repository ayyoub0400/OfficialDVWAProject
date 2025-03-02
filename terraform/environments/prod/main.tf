terraform {
    required_providers {
      aws = {
        source = "hashicorp/aws"
        version = "~> 5.0"
      }
    }
    backend "s3" {
        bucket         = "tfstate-backend-aym-2025"
        key            = "env:/prod/terraform.tfstate"
        region         = "us-east-1"
        use_lockfile =  true
        encrypt        = true
}
}

provider "aws" {
    region = "us-east-1"
}
