import { Component, ViewEncapsulation } from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-starter',
  templateUrl: './starter.component.html',
  standalone: true,
  imports: [MaterialModule],
  styleUrls: ['./starter.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class StarterComponent {
  loggedUser:any;
  
  constructor(){
    const encryptionKey = environment.key;
    this.loggedUser = {
      userId: "845eb227-5356-4169-9799-95a97ec5ce33",
      name: "miguel",
      customerId: "845eb227-5356-4169-9799-95a97ec5ce33",
      userName: "mtovar",
      customerName: "Logan IT Solutions"
    };

    const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(this.loggedUser), encryptionKey).toString();
    sessionStorage.setItem('ref', encryptedData);

  }

  

}
