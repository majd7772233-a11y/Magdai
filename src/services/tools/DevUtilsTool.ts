import {v4 as uuidv4} from 'uuid';

const b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

export class DevUtilsTool {
  static parseJSON(jsonString: string): {success: boolean; parsed?: any; error?: string} {
    try {
      const parsed = JSON.parse(jsonString);
      return {success: true, parsed};
    } catch (err: any) {
      return {success: false, error: err?.message || 'Invalid JSON'};
    }
  }

  static encodeBase64(input: string): string {
    const utf8Str = unescape(encodeURIComponent(input));
    let result = '';
    let i = 0;
    while (i < utf8Str.length) {
      const chr1 = utf8Str.charCodeAt(i++);
      const chr2 = utf8Str.charCodeAt(i++);
      const chr3 = utf8Str.charCodeAt(i++);

      const enc1 = chr1 >> 2;
      const enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      let enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      let enc4 = chr3 & 63;

      if (isNaN(chr2)) {
        enc3 = enc4 = 64;
      } else if (isNaN(chr3)) {
        enc4 = 64;
      }

      result +=
        b64.charAt(enc1) +
        b64.charAt(enc2) +
        b64.charAt(enc3) +
        b64.charAt(enc4);
    }
    return result;
  }

  static decodeBase64(input: string): string {
    let output = '';
    let chr1: number, chr2: number, chr3: number;
    let enc1: number, enc2: number, enc3: number, enc4: number;
    let i = 0;

    const cleaned = input.replace(/[^A-Za-z0-9+/=]/g, '');

    while (i < cleaned.length) {
      enc1 = b64.indexOf(cleaned.charAt(i++));
      enc2 = b64.indexOf(cleaned.charAt(i++));
      enc3 = b64.indexOf(cleaned.charAt(i++));
      enc4 = b64.indexOf(cleaned.charAt(i++));

      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;

      output += String.fromCharCode(chr1);

      if (enc3 !== 64) {
        output += String.fromCharCode(chr2);
      }
      if (enc4 !== 64) {
        output += String.fromCharCode(chr3);
      }
    }

    try {
      return decodeURIComponent(escape(output));
    } catch {
      return output;
    }
  }

  static generateUUID(): string {
    return uuidv4();
  }

  static testRegex(pattern: string, flags: string, text: string) {
    try {
      const regex = new RegExp(pattern, flags);
      const matches = text.match(regex);
      return {success: true, isMatch: regex.test(text), matches: matches ? Array.from(matches) : []};
    } catch (err: any) {
      return {success: false, error: err?.message || 'Invalid Regex'};
    }
  }
}
