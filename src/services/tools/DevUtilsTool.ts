import {v4 as uuidv4} from 'uuid';

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
    try {
      if (typeof global.btoa === 'function') {
        return global.btoa(encodeURIComponent(input).replace(/%([0-9A-F]{2})/g, (_, p1) =>
          String.fromCharCode(parseInt(p1, 16))
        ));
      }
      return encodeURIComponent(input);
    } catch {
      return input;
    }
  }

  static decodeBase64(input: string): string {
    try {
      if (typeof global.atob === 'function') {
        const decoded = global.atob(input.trim());
        return decodeURIComponent(
          Array.from(decoded)
            .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
      }
      return decodeURIComponent(input);
    } catch {
      return input;
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
