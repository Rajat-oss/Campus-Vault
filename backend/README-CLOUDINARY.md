# Cloudinary PDF Upload Integration

This backend now includes Cloudinary integration for uploading PDF files for notes, PYQs, and timetables.

## Setup

1. **Install Dependencies** (already done):
   ```bash
   npm install cloudinary
   ```

2. **Environment Variables**:
   Create a `.env.local` file in the backend directory with:
   ```
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

3. **Get Cloudinary Credentials**:
   - Sign up at [cloudinary.com](https://cloudinary.com)
   - Go to Dashboard to find your credentials

## API Endpoints

### 1. General Upload Endpoint
- **URL**: `POST /api/upload`
- **Purpose**: Generic file upload with type validation
- **Form Data**:
  - `file`: PDF file
  - `adminToken`: Admin authentication token
  - `type`: 'notes' | 'pyqs' | 'timetables'
  - `metadata`: JSON string with type-specific metadata

### 2. Notes Upload Endpoint
- **URL**: `POST /api/upload/notes`
- **Form Data**:
  - `file`: PDF file
  - `adminToken`: Admin token
  - `title`: Note title
  - `subject`: Subject name
  - `semester`: Semester number
  - `branch`: Branch/Department
  - `noteType`: Type of note (optional)
  - `description`: Note description (optional)

### 3. PYQs Upload Endpoint
- **URL**: `POST /api/upload/pyqs`
- **Form Data**:
  - `file`: PDF file
  - `adminToken`: Admin token
  - `subject`: Subject name
  - `year`: Exam year
  - `semester`: Semester number
  - `branch`: Branch/Department
  - `examType`: Type of exam (optional)

### 4. Timetables Upload Endpoint
- **URL**: `POST /api/upload/timetables`
- **Form Data**:
  - `file`: PDF file
  - `adminToken`: Admin token
  - `title`: Timetable title
  - `branch`: Branch/Department
  - `semester`: Semester number
  - `academicYear`: Academic year (optional)

## File Organization in Cloudinary

Files are organized in folders:
- **Notes**: `campus-vault/notes/{branch}/semester_{semester}/{subject}/`
- **PYQs**: `campus-vault/pyqs/{branch}/{subject}/{year}/`
- **Timetables**: `campus-vault/timetables/{branch}/semester_{semester}/`

## Features

- ✅ PDF-only validation
- ✅ Admin authentication
- ✅ Organized folder structure
- ✅ File metadata storage
- ✅ Error handling
- ✅ Cloudinary integration
- ✅ Database integration (for notes)

## Usage Example

```javascript
const formData = new FormData()
formData.append('file', pdfFile)
formData.append('adminToken', 'admin123')
formData.append('title', 'Data Structures Notes')
formData.append('subject', 'Data Structures')
formData.append('semester', '3')
formData.append('branch', 'Computer Science')

const response = await fetch('/api/upload/notes', {
  method: 'POST',
  body: formData
})

const result = await response.json()
console.log(result.fileUrl) // Cloudinary URL
```

## Response Format

```json
{
  "message": "File uploaded successfully",
  "fileUrl": "https://res.cloudinary.com/...",
  "fileName": "notes.pdf",
  "fileSize": 1024000
}
```