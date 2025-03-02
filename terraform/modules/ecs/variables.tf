variable "env" {
  description = "env for cluster"
  type        = string
}

variable "vpc_id" {
  description = "vpc's id"
  type        = string
}

variable "public_subnet_ids" {
  description = "ids of subnets to be passed"
  type        = list(string)
}

variable "security_group_id" {
  description = "security group id"
  type        = string
}