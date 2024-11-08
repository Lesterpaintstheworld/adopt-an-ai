const validation = {
  isValidUUID(str) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
  },

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  sanitizeInput(str) {
    return str.trim().replace(/[<>]/g, '');
  },

  validateRequired(obj, fields) {
    const missing = fields.filter(field => !obj[field]);
    if (missing.length > 0) {
      return {
        isValid: false,
        error: `Missing required fields: ${missing.join(', ')}`
      };
    }
    return { isValid: true };
  }
};

module.exports = validation;
