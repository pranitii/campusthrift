import QRCode from 'qrcode';

export const generateQRCode = async (url: string): Promise<string> => {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(url);
    return qrCodeDataURL;
  } catch (error) {
    throw new Error('Failed to generate QR code');
  }
};