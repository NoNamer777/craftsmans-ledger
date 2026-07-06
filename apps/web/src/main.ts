import { appConfig } from '@/core/config/app.config';
import { Root } from '@/core/root/root';
import { bootstrapApplication } from '@angular/platform-browser';

bootstrapApplication(Root, appConfig).catch((err) => console.error(err));
