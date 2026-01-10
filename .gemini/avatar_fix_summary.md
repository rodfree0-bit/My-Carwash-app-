# Avatar Size Error Fix

## Problem
The application was experiencing a Firebase error: **"The value of property 'avatar' is longer than 1048487 bytes."**

This error occurred because profile images were being stored as **base64-encoded data URLs** directly in Firestore documents, which have a maximum size limit of approximately 1MB per document.

## Root Cause
In `components/Client.tsx`, the `handleProfileImageChange` function was:
1. Reading image files as base64 data URLs
2. Storing the entire base64 string directly in the Firestore user document
3. Large images (even after base64 encoding) were exceeding Firestore's document size limit

## Solution
Modified the `handleProfileImageChange` function to:
1. **Upload images to Firebase Storage** instead of Firestore
2. **Store only the download URL** in the Firestore user document
3. Increased the file size limit from 1MB to 5MB (since Storage can handle larger files)

## Changes Made

### File: `components/Client.tsx` (lines 837-882)

**Before:**
```typescript
const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files[0]) {
    const file = e.target.files[0];
    
    // Check file size (limit to roughly 1MB to be safe for Firestore)
    if (file.size > 1024 * 1024) {
      showToast('Image is too large. Please ensure it is under 1MB.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setProfileImage(result);  // Storing base64 directly
      setProfileData({ ...profileData, photo: result });  // Storing base64 in Firestore
    };
    reader.readAsDataURL(file);
  }
};
```

**After:**
```typescript
const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files[0]) {
    const file = e.target.files[0];

    // Check file size (limit to 5MB for storage)
    if (file.size > 5 * 1024 * 1024) {
      showToast('Image is too large. Please ensure it is under 5MB.', 'error');
      return;
    }

    try {
      showToast('Uploading image...', 'info');

      // Read file as base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const base64Image = reader.result as string;
          
          // Upload to Firebase Storage
          const storageRef = ref(storage, `avatars/${user.id}/profile.jpg`);
          await uploadString(storageRef, base64Image, 'data_url');
          
          // Get download URL
          const downloadURL = await getDownloadURL(storageRef);
          
          // Update local state with URL (not base64)
          setProfileImage(downloadURL);
          setProfileData({ ...profileData, photo: downloadURL });
          
          showToast('Image uploaded successfully!', 'success');
        } catch (uploadError) {
          console.error('Error uploading image:', uploadError);
          showToast('Failed to upload image. Please try again.', 'error');
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error processing image:', error);
      showToast('Error processing image', 'error');
    }
  }
};
```

## Benefits
1. ✅ **Eliminates the 1MB document size error**
2. ✅ **Allows larger profile images** (up to 5MB)
3. ✅ **Better performance** - URLs are much smaller than base64 strings
4. ✅ **Proper architecture** - Images belong in Storage, not Firestore documents
5. ✅ **Better user experience** - Clear upload progress feedback

## Testing
After this fix:
- Users can upload profile images without encountering the size error
- Images are properly stored in Firebase Storage under `avatars/{userId}/profile.jpg`
- Only the download URL is stored in the Firestore user document
- The UI displays the uploaded image correctly

## Note
The same pattern is already used for vehicle images in the `handleAddSavedVehicle` function (lines 227-319), which was working correctly.
