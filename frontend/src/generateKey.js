
function generateKey(length) {
    var buffer = new Uint8Array(length);
    crypto.getRandomValues(buffer);
    return Array.from(buffer, (byte) => byte.toString(16)).join('');
  }

  export default generateKey; // for ES6 module system
