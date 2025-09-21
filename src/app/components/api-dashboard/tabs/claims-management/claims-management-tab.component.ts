import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// PrimeNG Components
import { TabViewModule } from 'primeng/tabview';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { MessageModule } from 'primeng/message';
import { ChipModule } from 'primeng/chip';
import { BadgeModule } from 'primeng/badge';
import { AccordionModule } from 'primeng/accordion';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';

// Services
import { ApiService } from '../../../../services/api.service';
import { DashboardService } from '../../../../services/dashboard.service';

// Interfaces
interface ClaimRequest {
  type: string;
  value: string;
  userId?: string;
  issuer?: string;
}

interface ClaimUpdateRequest {
  id: string;
  type: string;
  value: string;
  issuer?: string;
}

interface UserClaimsRequest {
  userId: string;
  pageNumber?: number;
  pageSize?: number;
}

interface ClaimSearchRequest {
  searchTerm?: string;
  type?: string;
  pageNumber?: number;
  pageSize?: number;
}

interface Claim {
  id: string;
  type: string;
  value: string;
  issuer?: string;
  userId?: string;
  dateCreated?: Date;
  dateModified?: Date;
}

interface ApiEndpoint {
  endpoint: string;
  method: string;
  summary: string;
  requiresAuth: boolean;
  parameters?: string[];
}

@Component({
  selector: 'app-claims-management-tab',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TabViewModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    CheckboxModule,
    DialogModule,
    MessageModule,
    ChipModule,
    BadgeModule,
    AccordionModule,
    DividerModule,
    DropdownModule,
    CalendarModule
  ],
  templateUrl: './claims-management-tab.component.html',
  styleUrl: './claims-management-tab.component.scss'
})
export class ClaimsManagementTabComponent implements OnInit {
  private apiService = inject(ApiService);
  private dashboardService = inject(DashboardService);
  private fb = inject(FormBuilder);

  // Forms
  createClaimForm: FormGroup;
  editClaimForm: FormGroup;
  searchClaimsForm: FormGroup;
  userClaimsForm: FormGroup;

  // Dialog States
  showCreateClaimDialog = false;
  showEditClaimDialog = false;
  showSearchClaimsDialog = false;
  showUserClaimsDialog = false;

  // Loading States
  createClaimLoading = false;
  editClaimLoading = false;
  searchClaimsLoading = false;
  userClaimsLoading = false;

  // Messages
  createClaimMessage = '';
  editClaimMessage = '';
  searchClaimsMessage = '';
  userClaimsMessage = '';

  // Data
  searchResults: Claim[] = [];
  userClaims: Claim[] = [];
  selectedClaim: Claim | null = null;

  // Claim Types
  claimTypes = [
    { label: 'Role', value: 'role' },
    { label: 'Permission', value: 'permission' },
    { label: 'Name', value: 'name' },
    { label: 'Email', value: 'email' },
    { label: 'Given Name', value: 'given_name' },
    { label: 'Family Name', value: 'family_name' },
    { label: 'Locale', value: 'locale' },
    { label: 'Custom', value: 'custom' }
  ];

  // API Endpoints for Claims Management
  claimsManagementEndpoints: ApiEndpoint[] = [
    {
      endpoint: '/api/Claims',
      method: 'GET',
      summary: 'Get all claims with optional filtering',
      requiresAuth: true,
      parameters: ['searchTerm', 'type', 'pageNumber', 'pageSize']
    },
    {
      endpoint: '/api/Claims',
      method: 'POST',
      summary: 'Create a new claim',
      requiresAuth: true,
      parameters: ['type', 'value', 'userId', 'issuer']
    },
    {
      endpoint: '/api/Claims/{id}',
      method: 'GET',
      summary: 'Get a specific claim by ID',
      requiresAuth: true,
      parameters: ['id']
    },
    {
      endpoint: '/api/Claims/{id}',
      method: 'PUT',
      summary: 'Update an existing claim',
      requiresAuth: true,
      parameters: ['id', 'type', 'value', 'issuer']
    },
    {
      endpoint: '/api/Claims/{id}',
      method: 'DELETE',
      summary: 'Delete a claim by ID',
      requiresAuth: true,
      parameters: ['id']
    },
    {
      endpoint: '/api/Claims/user/{userId}',
      method: 'GET',
      summary: 'Get all claims for a specific user',
      requiresAuth: true,
      parameters: ['userId', 'pageNumber', 'pageSize']
    },
    {
      endpoint: '/api/Claims/user/{userId}',
      method: 'DELETE',
      summary: 'Remove all claims from a specific user',
      requiresAuth: true,
      parameters: ['userId']
    },
    {
      endpoint: '/api/Claims/type/{type}',
      method: 'GET',
      summary: 'Get all claims of a specific type',
      requiresAuth: true,
      parameters: ['type', 'pageNumber', 'pageSize']
    }
  ];

  ngOnInit(): void {
    this.initializeForms();
  }

  private initializeForms(): void {
    // Create Claim Form
    this.createClaimForm = this.fb.group({
      type: ['', [Validators.required]],
      value: ['', [Validators.required]],
      userId: [''],
      issuer: ['']
    });

    // Edit Claim Form
    this.editClaimForm = this.fb.group({
      id: ['', [Validators.required]],
      type: ['', [Validators.required]],
      value: ['', [Validators.required]],
      issuer: ['']
    });

    // Search Claims Form
    this.searchClaimsForm = this.fb.group({
      searchTerm: [''],
      type: [''],
      pageNumber: [1, [Validators.min(1)]],
      pageSize: [10, [Validators.min(1), Validators.max(100)]]
    });

    // User Claims Form
    this.userClaimsForm = this.fb.group({
      userId: ['', [Validators.required]],
      pageNumber: [1, [Validators.min(1)]],
      pageSize: [10, [Validators.min(1), Validators.max(100)]]
    });
  }

  // UI Management Methods
  openClaimsManagementUI(action: string): void {
    switch (action) {
      case 'create':
        this.showCreateClaimDialog = true;
        break;
      case 'edit':
        this.showEditClaimDialog = true;
        break;
      case 'search':
        this.showSearchClaimsDialog = true;
        break;
      case 'user-claims':
        this.showUserClaimsDialog = true;
        break;
      case 'list':
        this.openEndpointTester('/api/Claims', 'GET');
        break;
    }
  }

  openEndpointTester(endpoint: string, method: string): void {
    this.dashboardService.openEndpointTester(endpoint, method);
  }

  // Form Handlers
  async handleCreateClaim(): Promise<void> {
    if (this.createClaimForm.invalid) {
      this.createClaimForm.markAllAsTouched();
      return;
    }

    this.createClaimLoading = true;
    this.createClaimMessage = '';

    try {
      const claimData: ClaimRequest = this.createClaimForm.value;
      const response = await this.apiService.createClaim(claimData);
      
      this.createClaimMessage = `Claim created successfully! ID: ${response.id}`;
      this.createClaimForm.reset();
      
      setTimeout(() => {
        this.showCreateClaimDialog = false;
        this.createClaimMessage = '';
      }, 2000);
    } catch (error: any) {
      this.createClaimMessage = `Error creating claim: ${error.message}`;
    } finally {
      this.createClaimLoading = false;
    }
  }

  async handleEditClaim(): Promise<void> {
    if (this.editClaimForm.invalid) {
      this.editClaimForm.markAllAsTouched();
      return;
    }

    this.editClaimLoading = true;
    this.editClaimMessage = '';

    try {
      const claimData: ClaimUpdateRequest = this.editClaimForm.value;
      await this.apiService.updateClaim(claimData.id, claimData);
      
      this.editClaimMessage = 'Claim updated successfully!';
      
      setTimeout(() => {
        this.showEditClaimDialog = false;
        this.editClaimMessage = '';
        this.editClaimForm.reset();
      }, 2000);
    } catch (error: any) {
      this.editClaimMessage = `Error updating claim: ${error.message}`;
    } finally {
      this.editClaimLoading = false;
    }
  }

  async handleSearchClaims(): Promise<void> {
    this.searchClaimsLoading = true;
    this.searchClaimsMessage = '';

    try {
      const searchParams: ClaimSearchRequest = this.searchClaimsForm.value;
      const response = await this.apiService.searchClaims(searchParams);
      
      this.searchResults = response.claims || [];
      this.searchClaimsMessage = `Found ${this.searchResults.length} claim(s)`;
      
      if (this.searchResults.length === 0) {
        this.searchClaimsMessage = 'No claims found matching the search criteria';
      }
    } catch (error: any) {
      this.searchClaimsMessage = `Error searching claims: ${error.message}`;
      this.searchResults = [];
    } finally {
      this.searchClaimsLoading = false;
    }
  }

  async handleGetUserClaims(): Promise<void> {
    if (this.userClaimsForm.invalid) {
      this.userClaimsForm.markAllAsTouched();
      return;
    }

    this.userClaimsLoading = true;
    this.userClaimsMessage = '';

    try {
      const params: UserClaimsRequest = this.userClaimsForm.value;
      const response = await this.apiService.getUserClaims(params.userId, params.pageNumber, params.pageSize);
      
      this.userClaims = response.claims || [];
      this.userClaimsMessage = `Found ${this.userClaims.length} claim(s) for user`;
      
      if (this.userClaims.length === 0) {
        this.userClaimsMessage = 'No claims found for this user';
      }
    } catch (error: any) {
      this.userClaimsMessage = `Error getting user claims: ${error.message}`;
      this.userClaims = [];
    } finally {
      this.userClaimsLoading = false;
    }
  }

  // Selection Methods
  selectClaim(claim: Claim): void {
    this.selectedClaim = claim;
    // Auto-populate edit form if editing
    if (this.showEditClaimDialog) {
      this.editClaimForm.patchValue({
        id: claim.id,
        type: claim.type,
        value: claim.value,
        issuer: claim.issuer
      });
    }
  }

  // Utility Methods
  getAccordionHeader(endpoint: ApiEndpoint): string {
    return `${endpoint.method} ${endpoint.endpoint}`;
  }

  copyCurlCommand(endpoint: ApiEndpoint): void {
    const curlCommand = this.apiService.generateCurlCommand(endpoint.endpoint, endpoint.method, {});
    navigator.clipboard.writeText(curlCommand);
    // You could show a toast message here
  }

  viewEndpointSchema(endpoint: ApiEndpoint): void {
    // Open endpoint documentation or schema
    this.dashboardService.openEndpointTester(endpoint.endpoint, endpoint.method);
  }

  // Form Reset Methods
  resetCreateForm(): void {
    this.createClaimForm.reset();
    this.createClaimMessage = '';
  }

  resetEditForm(): void {
    this.editClaimForm.reset();
    this.editClaimMessage = '';
    this.selectedClaim = null;
  }

  resetSearchForm(): void {
    this.searchClaimsForm.reset();
    this.searchResults = [];
    this.searchClaimsMessage = '';
    this.selectedClaim = null;
  }

  resetUserClaimsForm(): void {
    this.userClaimsForm.reset();
    this.userClaims = [];
    this.userClaimsMessage = '';
  }

  // Dialog Management
  onCreateDialogHide(): void {
    this.resetCreateForm();
  }

  onEditDialogHide(): void {
    this.resetEditForm();
  }

  onSearchDialogHide(): void {
    // Don't reset search results when dialog is closed
    this.searchClaimsMessage = '';
  }

  onUserClaimsDialogHide(): void {
    // Don't reset user claims when dialog is closed
    this.userClaimsMessage = '';
  }
}