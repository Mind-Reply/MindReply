output "name" {
  value = aws_eks_cluster.mindreply.name
}

output "endpoint" {
  value = aws_eks_cluster.mindreply.endpoint
}

output "region" {
  value = var.aws_region
}