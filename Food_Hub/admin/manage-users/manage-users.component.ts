import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css']
})
export class ManageUsersComponent implements OnInit {
  users: any[] = [];
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}
  ngOnInit(): void { this.load(); }
  load(): void { this.http.get<any[]>(`${this.apiUrl}/users`).subscribe(data => this.users = data); }
  toggle(id: string): void { this.http.put(`${this.apiUrl}/users/${id}/toggle`, {}).subscribe(() => this.load()); }
  delete(id: string): void {
    if (confirm('Delete this user?')) this.http.delete(`${this.apiUrl}/users/${id}`).subscribe(() => this.load());
  }
}