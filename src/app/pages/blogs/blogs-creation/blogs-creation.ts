import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { NgxEditorComponent, NgxEditorMenuComponent, Editor, Toolbar, schema } from 'ngx-editor';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-blogs-creation',
  standalone: true, // Assuming standalone based on your imports
  imports: [NgxEditorComponent, NgxEditorMenuComponent, FormsModule, MatButtonModule, CommonModule],
  templateUrl: './blogs-creation.html',
  styleUrl: './blogs-creation.scss',
})
export class BlogsCreation implements OnInit, OnDestroy {
  editor!: Editor;

  toolbar: Toolbar = [
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3'] }],
    ['link', 'image'], // The built-in image logic
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  blogTitle = '';
  blogDescription = '';
  featuredImage: string | null = null;
  html = '';
  selectedFile: File | null = null;
  
  ngOnInit(): void {
    this.editor = new Editor({
      schema, // Ensure the default schema is loaded to support images
      history: true,
      keyboardShortcuts: true,
    });
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }



  /**
   * IN-CONTENT IMAGE HANDLER (From System)
   */
  onEditorImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file && this.editor) {
      this.convertToBase64(file, (base64) => {
        // This inserts the image directly at the current cursor position
        this.editor.commands.insertHTML(`<img src="${base64}" style="max-width: 100%; height: auto;" />`).exec();
      });
      // Reset input so the same image can be picked again if deleted
      (event.target as HTMLInputElement).value = '';
    }
  }


  // Helper to keep code DRY
  private convertToBase64(file: File, callback: (base64: string) => void) {
    const reader = new FileReader();
    reader.onload = () => callback(reader.result as string);
    reader.readAsDataURL(file);
  }

  saveBlog() {
    const payload = {
      title: this.blogTitle,
      meta: this.blogDescription,
      content: this.html,
      featuredImage: this.featuredImage
    };
    console.log('Saving Blog...', payload);
  }

  resetForm() {
    this.blogTitle = '';
    this.blogDescription = '';
    this.featuredImage = null;
    this.html = '';
  }

  // Inside your BlogsCreation class...

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      const reader = new FileReader();
      reader.onload = (e) => {
        this.featuredImage = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeFeaturedImage() {
    this.featuredImage = null;
    this.selectedFile = null;
    // Note: If you have a ViewChild for the input, you'd reset it here
  }

  insertImageToEditor() {
    if (this.featuredImage && this.editor) {
      // We wrap it in a div for better spacing within the rich text editor
      const imgHtml = `
            <div class="blog-image-wrapper" style="text-align: center; margin: 20px 0;">
                <img src="${this.featuredImage}" alt="Blog Image" style="max-width: 100%; border-radius: 8px;">
            </div><p></p>`;
      this.editor.commands.insertHTML(imgHtml).exec();
    }
  }
}