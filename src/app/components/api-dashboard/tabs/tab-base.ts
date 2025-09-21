// Base Tab Component Interface
export interface TabComponentBase {
  category: string;
  endpoints: any[];
  openEndpointTester(endpoint: string, method: string): void;
  copyCurlCommand(endpoint: any): void;
  viewEndpointSchema(endpoint: any): void;
  getAccordionHeader(endpoint: any): string;
}

// Common Tab Styles (can be extended by each component)
export const commonTabStyles = `
  .category-header {
    margin-bottom: 1.5rem;

    h3 {
      color: var(--primary-color);
      margin-bottom: 0.5rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    p {
      color: var(--text-color-secondary);
      margin: 0;
    }
  }

  .nested-tabs {
    .p-tabview-nav-link {
      padding: 0.75rem 1rem;
      font-weight: 500;
    }
  }

  .ui-description {
    background: var(--surface-100);
    padding: 1rem;
    border-radius: 6px;
    margin-bottom: 1.5rem;
    border-left: 4px solid var(--primary-color);

    p {
      margin: 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;

      .pi-info-circle {
        color: var(--primary-color);
      }
    }
  }

  .feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;

    .feature-card {
      background: var(--surface-50);
      padding: 1.5rem;
      border-radius: 8px;
      border: 1px solid var(--surface-200);
      transition: all 0.3s ease;
      text-align: center;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        border-color: var(--primary-color);
      }

      i {
        font-size: 2rem;
        color: var(--primary-color);
        margin-bottom: 1rem;
        display: block;
      }

      h5 {
        margin: 0 0 0.5rem 0;
        color: var(--text-color);
        font-weight: 600;
      }

      p {
        margin: 0 0 1rem 0;
        color: var(--text-color-secondary);
        font-size: 0.9rem;
        line-height: 1.4;
      }

      .p-button {
        width: 100%;
      }
    }
  }

  .quick-actions {
    .actions-row {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;

      .p-button {
        flex: 1;
        min-width: 150px;
      }
    }
  }

  .endpoint-details {
    .endpoint-meta {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 0.5rem;
      flex-wrap: wrap;

      .endpoint-path {
        font-family: 'Courier New', monospace;
        background: var(--surface-100);
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.9rem;
      }
    }

    .endpoint-actions {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;

      .p-button {
        flex: 1;
        min-width: 120px;
      }
    }
  }

  // Method-specific styling
  .method-get { background: var(--green-100) !important; color: var(--green-900) !important; }
  .method-post { background: var(--blue-100) !important; color: var(--blue-900) !important; }
  .method-put { background: var(--orange-100) !important; color: var(--orange-900) !important; }
  .method-delete { background: var(--red-100) !important; color: var(--red-900) !important; }

  // Responsive design
  @media (max-width: 768px) {
    .feature-grid {
      grid-template-columns: 1fr;
    }

    .quick-actions .actions-row {
      flex-direction: column;

      .p-button {
        width: 100%;
      }
    }
  }
`;

// Base Tab Component Template
export const baseTabTemplate = (category: string, categoryIcon: string, categoryDescription: string) => `
<div class="${category.toLowerCase().replace(/\s+/g, '-')}-container">
  <div class="category-header">
    <h3>${category}</h3>
    <p>${categoryDescription}</p>
  </div>

  <p-tabView class="nested-tabs">
    <!-- UI Interface Tab -->
    <p-tabPanel header="UI Interface" leftIcon="pi pi-desktop">
      <div class="${category.toLowerCase().replace(/\s+/g, '-')}-ui-interface">
        <p-card header="${category} Interface">
          <div class="ui-description">
            <p><i class="pi pi-info-circle"></i> Comprehensive interface for ${category.toLowerCase()} operations.</p>
          </div>
          
          <!-- Feature grid and quick actions would go here -->
          <!-- Specific to each component -->
          
        </p-card>
      </div>
    </p-tabPanel>

    <!-- API Endpoints Tab -->
    <p-tabPanel header="API Endpoints" leftIcon="pi pi-code">
      <div class="api-endpoints-interface">
        <p-card header="${category} API Endpoints">
          <div class="api-description">
            <p><i class="pi pi-info-circle"></i> Complete list of API endpoints for ${category.toLowerCase()} operations.</p>
          </div>

          <p-accordion>
            <p-accordionTab 
              *ngFor="let endpoint of ${category.toLowerCase().replace(/\s+/g, '')}Endpoints"
              [header]="getAccordionHeader(endpoint)"
            >
              <div class="endpoint-details">
                <div class="endpoint-info">
                  <div class="endpoint-meta">
                    <p-chip 
                      [label]="endpoint.method" 
                      [class]="'method-' + endpoint.method.toLowerCase()"
                    ></p-chip>
                    <span class="endpoint-path">{{ endpoint.endpoint }}</span>
                    <p-badge 
                      *ngIf="endpoint.requiresAuth" 
                      value="AUTH" 
                      severity="warning"
                    ></p-badge>
                  </div>
                  <p class="endpoint-summary">{{ endpoint.summary }}</p>
                  
                  <div class="endpoint-parameters" *ngIf="endpoint.parameters && endpoint.parameters.length > 0">
                    <h5>Parameters:</h5>
                    <div class="parameters-list">
                      <p-chip 
                        *ngFor="let param of endpoint.parameters" 
                        [label]="param"
                        class="parameter-chip"
                      ></p-chip>
                    </div>
                  </div>

                  <div class="endpoint-actions">
                    <p-button 
                      label="Test Endpoint" 
                      icon="pi pi-play" 
                      size="small"
                      (onClick)="openEndpointTester(endpoint.endpoint, endpoint.method)"
                    ></p-button>
                    <p-button 
                      label="Copy cURL" 
                      icon="pi pi-copy" 
                      size="small"
                      class="p-button-outlined"
                      (onClick)="copyCurlCommand(endpoint)"
                    ></p-button>
                    <p-button 
                      label="View Schema" 
                      icon="pi pi-eye" 
                      size="small"
                      class="p-button-info"
                      (onClick)="viewEndpointSchema(endpoint)"
                    ></p-button>
                  </div>
                </div>
              </div>
            </p-accordionTab>
          </p-accordion>
        </p-card>
      </div>
    </p-tabPanel>
  </p-tabView>
</div>
`;