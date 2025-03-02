variable "vpc_cidr" {
  description = "vpc cidr"
  type        = string
}

variable "env" {
  description = "vpc env"
  type        = string
}

variable "public_subnet_1_cidr" {
  description = "cidr pub subnet 1"
  type        = string
  default     = "10.0.1.0/24"
}

variable "public_subnet_2_cidr" {
  description = "cidr pub subnet 2"
  type        = string
  default     = "10.0.2.0/24"
}

