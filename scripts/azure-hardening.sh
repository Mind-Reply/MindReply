#!/bin/bash
set -euo pipefail

: "${AZURE_RESOURCE_GROUP:?AZURE_RESOURCE_GROUP is required}"
: "${AZURE_APP_SERVICE_PLAN:?AZURE_APP_SERVICE_PLAN is required}"
: "${AZURE_WEBAPP_NAME:?AZURE_WEBAPP_NAME is required}"
: "${AZURE_SUBSCRIPTION_ID:?AZURE_SUBSCRIPTION_ID is required}"

echo "Updating App Service Plan worker count..."
az appservice plan update \
  --name "$AZURE_APP_SERVICE_PLAN" \
  --resource-group "$AZURE_RESOURCE_GROUP" \
  --number-of-workers "${AZURE_WORKER_COUNT:-2}"

echo "Setting App Service Plan SKU..."
az appservice plan update \
  --name "$AZURE_APP_SERVICE_PLAN" \
  --resource-group "$AZURE_RESOURCE_GROUP" \
  --sku "${AZURE_APP_SERVICE_SKU:-P1v3}"

echo "Enabling health check path..."
az webapp update \
  --name "$AZURE_WEBAPP_NAME" \
  --resource-group "$AZURE_RESOURCE_GROUP" \
  --set healthCheckPath="/api/health"

echo "Creating or updating Azure Service Health alert..."
az monitor activity-log alert create \
  --name "${AZURE_SERVICE_HEALTH_ALERT_NAME:-MindReplyServiceHealth}" \
  --resource-group "$AZURE_RESOURCE_GROUP" \
  --scopes "/subscriptions/$AZURE_SUBSCRIPTION_ID" \
  --condition "category=ServiceHealth" \
  --description "MindReply Azure service health alert"

if [[ -n "${AZURE_OPENAI_RESOURCE:-}" && -n "${AZURE_OPENAI_DEPLOYMENT:-}" ]]; then
  echo "Updating Azure OpenAI deployment model version..."
  az cognitiveservices account deployment update \
    --name "$AZURE_OPENAI_RESOURCE" \
    --resource-group "$AZURE_RESOURCE_GROUP" \
    --deployment-name "$AZURE_OPENAI_DEPLOYMENT" \
    --model-version "${AZURE_OPENAI_MODEL_VERSION:-latest}"
fi

if [[ -n "${AZURE_SEARCH_SERVICE:-}" ]]; then
  echo "Updating Azure AI Search replica count..."
  az search service update \
    --name "$AZURE_SEARCH_SERVICE" \
    --resource-group "$AZURE_RESOURCE_GROUP" \
    --replica-count "${AZURE_SEARCH_REPLICA_COUNT:-2}"
fi

if [[ -n "${AZURE_VNET_NAME:-}" && -n "${AZURE_SUBNET_NAME:-}" && -n "${AZURE_NAT_GATEWAY:-}" && -n "${AZURE_PUBLIC_IP_NAME:-}" ]]; then
  echo "Creating NAT Gateway and attaching it to the subnet..."
  az network nat gateway create \
    --resource-group "$AZURE_RESOURCE_GROUP" \
    --name "$AZURE_NAT_GATEWAY" \
    --public-ip-addresses "$AZURE_PUBLIC_IP_NAME"

  az network vnet subnet update \
    --resource-group "$AZURE_RESOURCE_GROUP" \
    --vnet-name "$AZURE_VNET_NAME" \
    --name "$AZURE_SUBNET_NAME" \
    --nat-gateway "$AZURE_NAT_GATEWAY"
fi

echo "Azure reliability hardening completed."
