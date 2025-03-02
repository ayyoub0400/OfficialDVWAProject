#VPC Outputs

output "vpc_id" {
    description = "vpc id"
    value = aws_vpc.vpc.id
}

output "public_subnet_ids" {
    description = "subnet ids"
    value = [aws_subnet.public_1.id, aws_subnet.public_2.id]
}

output "security_group_id" {
    description = "security group id"
    value = aws_security_group.ecs_ec2.id
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
