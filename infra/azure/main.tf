resource "azurerm_app_service_plan" "plan" {
  name                = var.plan_name
  resource_group_name = var.resource_group
  location            = var.location
  sku {
    tier = "PremiumV3"
    size = "P1v3"
  }
  worker_count = 2
  zone_redundant = true
}

resource "azurerm_linux_web_app" "app" {
  name                = var.app_name
  resource_group_name = var.resource_group
  location            = var.location
  service_plan_id     = azurerm_app_service_plan.plan.id

  site_config {
    health_check_path = "/health"
  }
}

resource "azurerm_search_service" "search" {
  name                = var.search_name
  resource_group_name = var.resource_group
  location            = var.location
  replica_count       = 2
}

resource "azurerm_nat_gateway" "nat" {
  name                = var.nat_name
  resource_group_name = var.resource_group
  location            = var.location
  public_ip_address_ids = [azurerm_public_ip.ip.id]
}

resource "azurerm_subnet_nat_gateway_association" "nat_assoc" {
  subnet_id      = azurerm_subnet.subnet.id
  nat_gateway_id = azurerm_nat_gateway.nat.id
}
