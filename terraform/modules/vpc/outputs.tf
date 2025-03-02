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

