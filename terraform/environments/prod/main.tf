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

module "vpc" {

    source = "../../modules/vpc"
    env = var.env
    vpc_cidr = var.vpc_cidr
    public_subnet_1_cidr = var.public_subnet_1_cidr
    public_subnet_2_cidr = var.public_subnet_2_cidr

}
