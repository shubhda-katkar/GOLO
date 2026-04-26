const fs = require('fs');
const path = require('path');

console.log('🔧 Starting fixes...\n');

// Fix 1: Property DTO
const propertyDtoPath = path.join(process.cwd(), 'src/ads/dto/category-dtos/property.dto.ts');
if (fs.existsSync(propertyDtoPath)) {
  let content = fs.readFileSync(propertyDtoPath, 'utf8');
  
  // Count braces
  const openBraces = (content.match(/{/g) || []).length;
  const closeBraces = (content.match(/}/g) || []).length;
  
  console.log(`Property DTO - Open braces: ${openBraces}, Close braces: ${closeBraces}`);
  
  if (openBraces > closeBraces) {
    const missing = openBraces - closeBraces;
    for (let i = 0; i < missing; i++) {
      content += '\n}';
    }
    fs.writeFileSync(propertyDtoPath, content, 'utf8');
    console.log(`✅ Added ${missing} missing closing brace(s) to property.dto.ts`);
  } else {
    console.log('✅ Property DTO braces are balanced');
  }
}

// Fix 2: Check for any other files with 5G property
const filesToCheck = [
  'src/ads/dto/category-dtos/mobiles.dto.ts',
  'src/ads/schemas/category-schemas/mobiles.schema.ts'
];

filesToCheck.forEach(filePath => {
  const fullPath = path.join(process.cwd(), filePath);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    if (content.includes('5G')) {
      content = content.replace(/5G/g, 'has5G');
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`✅ Fixed 5G property in ${filePath}`);
    }
  }
});

console.log('\n✨ All fixes applied!');
console.log('Now run: pnpm run build');