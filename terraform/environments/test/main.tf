terraform {
    required_providers {
      aws = {
        source = "hashicorp/aws"
        version = "~> 5.0"
      }
    }

    backend "s3" {
        bucket         = "tfstate-backend-aym-2025"
        key            = "env:/test/terraform.tfstate"
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

module "ecs" {
    source = "../../modules/ecs"
    env = var.env
    vpc_id = module.vpc.vpc_id
    public_subnet_ids = module.vpc.public_subnet_ids
    security_group_id = module.vpc.security_group_id
    }

output "alb_dns" {
  value = module.ecs.alb_dns
}