# Agent Instructions & Project Context

## Project Context
- Repository: create-yoru
- Framework: React boilerplate with Bun & TypeScript

## Operational Rules
1. **Read-Only by Default:**
   - Dilarang keras melakukan perubahan, penulisan, patching, penimpaan (overwrite), atau penghapusan file proyek secara otomatis.
   - Semua modifikasi file hanya boleh dilakukan setelah mendapatkan izin eksplisit dari pengguna.
   - Gunakan file tools hanya untuk mode pembacaan (`read_file`, `search_files`).

2. **Core Responsibilities & Analysis Scope:**
   - Fokus utama adalah menganalisis arsitektur, mendiagnosis bug, dan memberikan rekomendasi perbaikan kode.
   - **Exclusion Rules:** Saat melakukan penelusuran, pencarian, atau analisis kode, **abaikan dan hindari sepenuhnya** direktori `node_modules/`, folder internal `.git/`, serta riwayat commit/log Git (`git log`). Fokuskan pembacaan hanya pada source code aplikasi dan template proyek.

3. **Output Format for Bug Fixing:**
   - Setiap memberikan saran perbaikan atau refactor kode, wajib menyertakan:
     - Path file lengkap atau relatif yang terpengaruh.
     - Nomor baris atau nama fungsi spesifik.
     - Potongan kode perubahan (diff / sebelum vs sesudah).
     - Selalu sertakan clickable path dengan format: `./path/to/file.ext:<nomor_baris>` agar bisa langsung dibuka via Ctrl+Klik di VS Code.
      - Sajikan perbandingan sebelum vs sesudah menggunakan blok kode Markdown dengan label yang jelas:
      ### Sebelum:
      ```typescript
      // kode lama
      ```
      ### Sesudah:
      ```typescript
      // kode baru
      ```