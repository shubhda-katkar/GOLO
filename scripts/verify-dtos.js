const fs = require('fs');
const path = require('path');

const dtoFiles = [
  'src/ads/dto/create-ad.dto.ts',
  'src/ads/dto/contact-info.dto.ts',
  'src/ads/dto/metadata.dto.ts',
  'src/ads/dto/update-ad.dto.ts',
  'src/ads/dto/category-dtos/vehicle.dto.ts',
  'src/ads/dto/category-dtos/property.dto.ts',
  'src/ads/dto/category-dtos/service.dto.ts',
  'src/ads/dto/category-dtos/mobiles.dto.ts',
  'src/ads/dto/category-dtos/electronics.dto.ts',
  'src/ads/dto/category-dtos/furniture.dto.ts',
  'src/ads/dto/category-dtos/education.dto.ts',
  'src/ads/dto/category-dtos/pets.dto.ts',
  'src/ads/dto/category-dtos/matrimonial.dto.ts',
  'src/ads/dto/category-dtos/business.dto.ts',
  'src/ads/dto/category-dtos/travel.dto.ts',
  'src/ads/dto/category-dtos/astrology.dto.ts',
  'src/ads/dto/category-dtos/employment.dto.ts',
  'src/ads/dto/category-dtos/lost-found.dto.ts',
  'src/ads/dto/category-dtos/personal.dto.ts'
];

console.log('🔍 Verifying DTO files...\n');

dtoFiles.forEach(filePath => {
  const fullPath = path.join(process.cwd(), filePath);
  
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf8');
    const lines = content.split('\n');
    
    // Check for common syntax errors
    const hasUnclosedBrace = (content.match(/{/g) || []).length !== (content.match(/}/g) || []).length;
    const has5GProperty = content.includes('5G?:') || content.includes('5G:');
    const hasInvalidDecorator = content.includes('@Type(() => Object') && !content.includes('@Type(() => Object)');
    
    console.log(`📄 ${filePath}`);
    console.log(`   Lines: ${lines.length}`);
    console.log(`   Unclosed braces: ${hasUnclosedBrace ? '❌' : '✅'}`);
    console.log(`   Invalid 5G property: ${has5GProperty ? '❌' : '✅'}`);
    console.log(`   Invalid decorator: ${hasInvalidDecorator ? '❌' : '✅'}`);
    console.log('');
  } else {
    console.log(`❌ Missing: ${filePath}\n`);
  }
});

console.log('✨ Verification complete!');