// src/app/components/notification-sender/notification-sender.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NotificationService } from '../../service/notification.service';
import { AuthService } from '../../service/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notification-sender',
  templateUrl: './notification-sender.html',
  styleUrls: ['./notification-sender.scss'],
  imports: [CommonModule, ReactiveFormsModule] 

})
export class NotificationSenderComponent implements OnInit {
  private fb = inject(FormBuilder);
  private notificationService = inject(NotificationService);
  private authService = inject(AuthService);

  notificationForm: FormGroup;
  sending = false;
  message = '';
  currentUser: any;

  roles = ['Admin', 'Moderator', 'User', 'Pharmacist']; // Adjust based on your roles

  constructor() {
    this.notificationForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      message: ['', [Validators.required, Validators.minLength(5)]],
      targetType: ['role', Validators.required],
      targetValue: ['', Validators.required],
      customData: this.fb.group({
        type: [''],
        id: [''],
        url: ['']
      })
    });

    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnInit(): void {
    // Set default role based on current user's role
    if (this.currentUser) {
      this.notificationForm.patchValue({
        targetValue: this.currentUser.profile.role.roleType
      });
    }
  }

  sendNotification(): void {
    if (this.notificationForm.valid) {
      this.sending = true;
      this.message = '';

      const formValue = this.notificationForm.value;
      let request: any;

      const notificationData = {
        title: formValue.title,
        message: formValue.message,
        data: formValue.customData
      };

      switch (formValue.targetType) {
        case 'role':
          request = this.notificationService.sendToRole(
            formValue.targetValue,
            formValue.title,
            formValue.message,
            formValue.customData
          );
          break;

        case 'roles':
          const roles = formValue.targetValue.split(',').map((r: string) => r.trim());
          request = this.notificationService.sendToRoles(
            roles,
            formValue.title,
            formValue.message,
            formValue.customData
          );
          break;

        case 'admin':
          request = this.notificationService.sendToAdmin(
            parseInt(formValue.targetValue),
            formValue.title,
            formValue.message,
            formValue.customData
          );
          break;
      }

      request.subscribe({
        next: (response: any) => {
          this.message = 'Notification sent successfully!';
          this.sending = false;
          this.notificationForm.reset({
            targetType: 'role',
            targetValue: this.currentUser?.profile?.role?.roleType || ''
          });
        },
        error: (error: any) => {
          this.message = 'Error sending notification: ' + error.message;
          this.sending = false;
        }
      });
    }
  }

  get targetPlaceholder(): string {
    const targetType = this.notificationForm.get('targetType')?.value;
    switch (targetType) {
      case 'role': return 'Enter role name (e.g., Admin)';
      case 'roles': return 'Enter roles separated by commas (e.g., Admin, Moderator)';
      case 'admin': return 'Enter Admin ID';
      default: return '';
    }
  }
}