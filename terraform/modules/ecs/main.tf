resource "aws_ecs_cluster" "cluster" {
    name = "${var.env}-ecs-cluster"
    setting {
      name  = "containerInsights"
      value = "enabled"
    }
    tags = {
      environment = var.env
    }
}

resource "aws_ecs_task_definition" "ecstask" {
    family = "${var.env}-ecs-task"
    network_mode = "awsvpc"
    requires_compatibilities = ["FARGATE"]
    cpu = 256
    memory = 512
    execution_role_arn = aws_iam_role.ecs_task_execution_role.arn

    container_definitions = jsonencode([
        {
            name = "${var.env}-ecs-webapp"
            image = "266735805454.dkr.ecr.us-east-1.amazonaws.com/dvwa:latest"
            cpu = 256
            memory = 512
            essential = true
            portMappings = [
                {
                    containerPort = 3000    
                    protocol = "tcp"
                }
            ]
            tags = {
                environment = var.env
            }
            }
    ])
}

resource "aws_lb" "ecs_alb" {
  name               = "ecs-alb"
  internal           = false # Public-facing ALB
  load_balancer_type = "application"
  security_groups    = [var.security_group_id]
  subnets            = var.public_subnet_ids # Changed to use list of subnet IDs
}

resource "aws_lb_target_group" "ecs_tg" {
  name        = "ecs-tg"
  port        =  3000 # Matches container port
  protocol    = "HTTP"
  target_type = "ip" # Fargate uses IP-based routing
  vpc_id      = var.vpc_id
}

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.ecs_alb.arn
  port              = 3000
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.ecs_tg.arn
  }
}

resource "aws_ecs_service" "ecsservice" {
    name = "${var.env}-ecs-webapp"
    cluster = aws_ecs_cluster.cluster.id
    task_definition = aws_ecs_task_definition.ecstask.arn
    desired_count = 1
    launch_type = "FARGATE"

    network_configuration {
        subnets = var.public_subnet_ids # Changed to use list of subnet IDs
        security_groups = [var.security_group_id]
        assign_public_ip = true
    }

  load_balancer {
    target_group_arn = aws_lb_target_group.ecs_tg.arn
    container_name   = "${var.env}-ecs-webapp" # Name in task definition
    container_port   = "3000" # Port exposed by container
  }

  depends_on = [aws_lb_listener.http]
  
    tags = {
        environment = var.env
    }
}

#IAM

resource "aws_iam_role" "ecs_task_execution_role" {
  # The name of the IAM role.
  name = "ecs_task_execution_role"

  # The trust policy that allows the ECS tasks service to assume this role.
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })
}

# Attach the AmazonECSTaskExecutionRolePolicy to the ECS task execution role.
resource "aws_iam_role_policy_attachment" "ecs_task_execution_role_policy" {
  # The name of the IAM role to attach the policy to.
  role       = aws_iam_role.ecs_task_execution_role.name

  # The ARN of the policy to attach. This policy allows ECS to pull images and publish logs.
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}