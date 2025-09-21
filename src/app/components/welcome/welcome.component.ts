import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'auth-portal-welcome',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="welcome-container">
      <h1>Welcome to Auth Portal</h1>
      <p>You have successfully logged in!</p>
      <div class="feature-cards">
        <div class="card">
          <h3>User Management</h3>
          <p>Manage users and permissions</p>
        </div>
        <div class="card">
          <h3>Settings</h3>
          <p>Configure your preferences</p>
        </div>
        <div class="card">
          <h3>Reports</h3>
          <p>View system reports and analytics</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .welcome-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    h1 {
      color: #333;
      text-align: center;
      margin-bottom: 1rem;
    }
    
    p {
      text-align: center;
      color: #666;
      margin-bottom: 2rem;
    }
    
    .feature-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
      margin-top: 2rem;
    }
    
    .card {
      background: white;
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      transition: transform 0.2s ease;
    }
    
    .card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    }
    
    .card h3 {
      color: #333;
      margin-bottom: 0.5rem;
    }
    
    .card p {
      color: #666;
      margin: 0;
      text-align: left;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomeComponent {}