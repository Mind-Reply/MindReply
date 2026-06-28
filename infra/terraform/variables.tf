variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "cluster_name" {
  type    = string
  default = "mindreply-prod"
}

variable "node_instance_type" {
  type    = string
  default = "t3.medium"
}

variable "desired_capacity" {
  type    = number
  default = 2
}

variable "max_capacity" {
  type    = number
  default = 4
}

variable "min_capacity" {
  type    = number
  default = 1
}