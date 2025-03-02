variable "vpc_cidr" {
    description = "VPC CIDR"
    type = string
    default = "10.0.0.0/16"
}

variable "public_subnet_1_cidr" {
  description = "pub subnet 1 CIDR"
  type        = string
  default     = "10.0.1.0/24"
}

variable "public_subnet_2_cidr" {
  description = "pub subnet 2 CIDR"
  type        = string
  default     = "10.0.2.0/24"
}

variable "env" {
    description = "environment"
    type = string
    default = "TEST"
}