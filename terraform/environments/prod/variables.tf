variable "vpc_cidr" {
    description = "vpc cidr"
    type = string
    default = "10.0.0.0/16"
}

variable "public_subnet_1_cidr" {
  description = "pub net 1 cidr"
  type        = string
  default     = "10.0.1.0/24"
}

variable "public_subnet_2_cidr" {
  description = "pub net 2 cidr"
  type        = string
  default     = "10.0.2.0/24"
}

variable "env" {
    description = "environment"
    type = string
    default = "PROD"
}