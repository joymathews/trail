// Utility to parse a CSV line
function parseCSVLine(line) {
  const regex = /(?:"([^"]*)")|([^,]+)/g;
  const result = [];
  let match;
  while ((match = regex.exec(line))) {
    result.push(match[1] || match[2]);
  }
  return result;
}

module.exports = { parseCSVLine };
