import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage, isFirebaseConfigured } from './firebase';

export const storageService = {
  /**
   * Upload an image file for a repair inspection or product
   * Returns the accessible download URL (Firebase Storage URL or optimized Data URL)
   */
  async uploadRepairImage(file: File, repairId: string): Promise<string> {
    // 1. Live Firebase Storage
    if (isFirebaseConfigured && storage) {
      try {
        const cleanName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
        const storagePath = `repairs/${repairId}/${Date.now()}_${cleanName}`;
        const fileRef = ref(storage, storagePath);

        console.log(`[ToolCare Storage] Uploading image to Firebase Storage: ${storagePath}...`);
        const snapshot = await uploadBytes(fileRef, file, {
          contentType: file.type
        });

        const downloadUrl = await getDownloadURL(snapshot.ref);
        console.log(`[ToolCare Storage] Upload successful: ${downloadUrl}`);
        return downloadUrl;
      } catch (err) {
        console.warn('[ToolCare Storage] Firebase Storage upload failed, falling back to local image data:', err);
      }
    }

    // 2. Local Fallback: Convert to optimized Base64 data URL
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        resolve(result);
      };
      reader.onerror = () => reject(new Error('Failed to read image file'));
      reader.readAsDataURL(file);
    });
  }
};
