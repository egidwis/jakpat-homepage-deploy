# Jakpat for Universities - Deployment Documentation

## Project Overview
Website landing page untuk Jakpat for Universities - platform yang membantu mahasiswa mendapatkan data survei dari responden terpercaya untuk keperluan riset dan skripsi.

## Project Structure
```
jakpat-homepage-deploy/
├── index.html              # Main landing page
├── privacy-policy.html     # Privacy policy page
├── terms-conditions.html   # Terms & conditions page
├── jfu-logo.png           # Jakpat for Universities logo
├── background-heropage.jpg # Hero section background image
└── README.md              # This documentation
```

## Deployment dengan Cloudflare Pages

### Prerequisites
- Node.js dan npm terinstall
- Wrangler CLI terinstall (`npm install -g wrangler`)
- Akses ke Cloudflare account

### Environment Variables
Set environment variable untuk Cloudflare Account ID:
```bash
export CLOUDFLARE_ACCOUNT_ID=67f961331110b81774851ee4f54349b9
```

### Deploy Command
Untuk deploy project ke Cloudflare Pages, jalankan command berikut dari root directory:

```bash
CLOUDFLARE_ACCOUNT_ID=67f961331110b81774851ee4f54349b9 npx wrangler pages deploy . --project-name jakpatforuniv-homepage
```

### Deployment Steps

1. **Prepare project**
   - Pastikan semua file HTML, CSS, dan assets sudah siap
   - Verify bahwa path untuk assets (images, links) sudah benar

2. **Deploy ke Cloudflare Pages**
   ```bash
   CLOUDFLARE_ACCOUNT_ID=67f961331110b81774851ee4f54349b9 npx wrangler pages deploy . --project-name jakpatforuniv-homepage
   ```

3. **Verify deployment**
   - Check URL yang diberikan setelah deployment berhasil
   - Test semua link dan functionality
   - Verify bahwa images dan assets ter-load dengan benar

### Project Configuration
- **Project Name**: `jakpatforuniv-homepage`
- **Cloudflare Account ID**: `67f961331110b81774851ee4f54349b9`
- **Build Output Directory**: `.` (current directory)
- **Framework**: Static HTML/CSS/JS

### File Details
- **index.html**: Main landing page dengan responsive design, berisi hero section, testimonials, comparison table, dan CTA sections
- **privacy-policy.html**: Halaman kebijakan privasi
- **terms-conditions.html**: Halaman syarat dan ketentuan
- **jfu-logo.png**: Logo Jakpat for Universities
- **background-heropage.jpg**: Background image untuk hero section

### Features
- Responsive design (desktop, tablet, mobile)
- Modern CSS dengan gradients dan animations
- Smooth scrolling navigation
- Call-to-action buttons mengarah ke `https://submit.jakpatforuniv.com/`
- Testimonial section dari mahasiswa
- Comparison table antara layanan regular dan Jakpat for Universities

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive
- Progressive enhancement untuk older browsers

### Maintenance
- Update content di HTML files sesuai kebutuhan
- Replace images di folder assets jika diperlukan
- Re-deploy dengan command yang sama setiap kali ada perubahan

### Links & External Dependencies
- Google Fonts: Plus Jakarta Sans & Inter
- External CTA link: `https://submit.jakpatforuniv.com/`
- Footer links mengarah ke halaman internal dan external survey form