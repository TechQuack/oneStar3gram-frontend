import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { MediaFileService } from './media-file.service';

@Injectable({
    providedIn: 'root'
})
export class ImageService extends MediaFileService {
    
    protected override getApiUrl(): string {
        return environment.apiUrl + 'image'
    }

}