#!/bin/bash
set -e

echo "🚀 MindReply Full Autonomous Platform Bootstrap Starting..."

############################
# CONFIG
############################
export AWS_REGION=us-east-1
export CLUSTER_NAME=mindreply-prod
export DOMAIN=mind-reply.com

############################
# 1. TERRAFORM - CREATE EKS
############################
cd infra/terraform

terraform init
terraform apply -auto-approve

############################
# 2. CONNECT KUBECTL TO CLUSTER
############################
aws eks update-kubeconfig \
  --region $AWS_REGION \
  --name $CLUSTER_NAME

############################
# 3. INSTALL INGRESS CONTROLLER
############################
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update

helm install ingress-nginx ingress-nginx/ingress-nginx

############################
# 4. INSTALL ARGOCD
############################
kubectl create namespace argocd || true

kubectl apply -n argocd \
  -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

echo "⏳ Waiting for ArgoCD..."
kubectl rollout status deployment/argocd-server -n argocd

############################
# 5. INSTALL CERT-MANAGER (TLS)
############################
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/latest/download/cert-manager.yaml

############################
# 6. APPLY CLUSTER ISSUER
############################
kubectl apply -f gitops/policies/cluster-issuer.yaml || true

############################
# 7. DEPLOY ARGOCD GITOPS APP
############################
kubectl apply -f gitops/argocd/project.yaml || true
kubectl apply -f gitops/argocd/application.yaml || true

############################
# 8. DEPLOY INGRESS (DOMAIN ROUTING)
############################
kubectl apply -f k8s/ingress.yaml || true

############################
# 9. FINAL STATUS CHECK
############################
echo "📦 Kubernetes resources:"
kubectl get pods -A

echo "🌐 Ingress:"
kubectl get ingress -A

echo "✅ BOOTSTRAP COMPLETE"
echo "👉 Target URL: https://$DOMAIN"
