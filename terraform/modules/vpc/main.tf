#VPC Modules

resource "aws_vpc" "vpc" {
    cidr_block = var.vpc_cidr
    tags = {
        Name = "${var.env}-vpc"
    }
}

resource "aws_subnet" "public_1" {
    vpc_id = aws_vpc.vpc.id
    cidr_block = var.public_subnet_1_cidr
    availability_zone = "${data.aws_region.current.name}a"
    tags = {
        Name = "${var.env}-public-subnet-1"
    }
    map_public_ip_on_launch = true
}

resource "aws_subnet" "public_2" {
    vpc_id = aws_vpc.vpc.id
    cidr_block = var.public_subnet_2_cidr
    availability_zone = "${data.aws_region.current.name}b"
    tags = {
        Name = "${var.env}-public-subnet-2"
    }
    map_public_ip_on_launch = true
}

data "aws_region" "current" {}

resource "aws_internet_gateway" "igw" {
    vpc_id = aws_vpc.vpc.id
    tags = {
        Name = "${var.env}-igw"
    }
}

resource "aws_route_table" "public" {
    vpc_id = aws_vpc.vpc.id
    tags = {
        Name = "${var.env}-public-route-table"
    }
}

resource "aws_route" "public" {
    route_table_id = aws_route_table.public.id
    destination_cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
}

resource "aws_route_table_association" "public_1" {
    subnet_id = aws_subnet.public_1.id
    route_table_id = aws_route_table.public.id
}

resource "aws_route_table_association" "public_2" {
    subnet_id = aws_subnet.public_2.id
    route_table_id = aws_route_table.public.id
}

resource "aws_security_group" "ecs_ec2" {
    name = "${var.env}-ecs-ec2-sg"
    vpc_id = aws_vpc.vpc.id
    tags = {
        Name = "${var.env}ecs-ec2-sg"
    }

    ingress {
        from_port = 3000
        to_port = 3000
        protocol = "tcp"
        cidr_blocks = ["92.0.0.0/8"]
    }

    ingress {
        from_port = 22
        to_port = 22
        protocol = "tcp"
        cidr_blocks = ["92.0.0.0/8"]
    }

    ingress {
        from_port = -1
        to_port = -1
        protocol = "icmp"
        cidr_blocks = ["92.0.0.0/8"]
    }
    egress {
        from_port = 0
        to_port = 0
        protocol = "-1"
        cidr_blocks = ["92.0.0.0/8"]
    }
}