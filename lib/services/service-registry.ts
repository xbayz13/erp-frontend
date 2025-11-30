import { ApiClient } from './api-client';
import { AuthService } from './auth-service';
import { FinanceServiceApi } from './finance-service';
import { InventoryServiceApi } from './inventory-service';
import { ProductionServiceApi } from './production-service';
import { PurchasingServiceApi } from './purchasing-service';
import { ReportsService } from './reports-service';
import { SystemService } from './system-service';
import { AnalyticsService } from './analytics-service';
import { ReportBuilderService } from './report-builder-service';
import { WorkflowService } from './workflow-service';
import { DataImportExportService } from './data-import-export-service';
import { I18nService } from './i18n-service';
import { IntegrationHubService } from './integration-hub-service';

const apiClient = new ApiClient();

export const authService = new AuthService(apiClient);
export const inventoryService = new InventoryServiceApi(apiClient);
export const systemService = new SystemService(apiClient);
export const analyticsService = new AnalyticsService(apiClient);
export const reportBuilderService = new ReportBuilderService(apiClient);
export const workflowService = new WorkflowService(apiClient);
export const dataImportExportService = new DataImportExportService(apiClient);
export const i18nService = new I18nService(apiClient);
export const integrationHubService = new IntegrationHubService(apiClient);
export const purchasingService = new PurchasingServiceApi(apiClient);
export const financeService = new FinanceServiceApi(apiClient);
export const productionService = new ProductionServiceApi(apiClient);
export const reportsService = new ReportsService(apiClient);


