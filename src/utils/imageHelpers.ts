import { launchImageLibrary, launchCamera, ImagePickerResponse, Asset } from 'react-native-image-picker';

export type PickedMediaType = 'image' | 'video';

export interface PickedMedia {
  uri: string;
  type: string;
  fileName: string;
  width: number;
  height: number;
  mediaType: PickedMediaType;
  duration?: number; // video duration in seconds
}

function extractMedia(response: ImagePickerResponse): PickedMedia | null {
  if (response.didCancel || response.errorCode || !response.assets?.length) {
    return null;
  }
  const asset: Asset = response.assets[0];
  const isVideo = (asset.type ?? '').startsWith('video/');
  return {
    uri: asset.uri ?? '',
    type: asset.type ?? 'image/jpeg',
    fileName: asset.fileName ?? (isVideo ? 'video.mp4' : 'photo.jpg'),
    width: asset.width ?? 0,
    height: asset.height ?? 0,
    mediaType: isVideo ? 'video' : 'image',
    duration: asset.duration,
  };
}

/** Pick photo only from gallery */
export async function pickImageFromGallery(): Promise<PickedMedia | null> {
  const response = await launchImageLibrary({
    mediaType: 'photo',
    quality: 0.9,
    maxWidth: 1080,
    maxHeight: 1080,
  });
  return extractMedia(response);
}

/** Pick photo only from camera */
export async function pickImageFromCamera(): Promise<PickedMedia | null> {
  const response = await launchCamera({
    mediaType: 'photo',
    quality: 0.9,
    maxWidth: 1080,
    maxHeight: 1080,
  });
  return extractMedia(response);
}

/** Pick photo or video from gallery */
export async function pickMediaFromGallery(): Promise<PickedMedia | null> {
  const response = await launchImageLibrary({
    mediaType: 'mixed',
    quality: 0.9,
    maxWidth: 1080,
    maxHeight: 1080,
    videoQuality: 'high',
    durationLimit: 60,
  });
  return extractMedia(response);
}

/** Record photo or video from camera */
export async function pickMediaFromCamera(): Promise<PickedMedia | null> {
  const response = await launchCamera({
    mediaType: 'mixed',
    quality: 0.9,
    maxWidth: 1080,
    maxHeight: 1080,
    videoQuality: 'high',
    durationLimit: 60,
  });
  return extractMedia(response);
}
