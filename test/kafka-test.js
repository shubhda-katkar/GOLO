const { Kafka } = require('kafkajs');
const { v4: uuidv4 } = require('uuid');

const kafka = new Kafka({
  clientId: 'test-client',
  brokers: ['localhost:9092']
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'test-group-' + Date.now() });

const correlationId = uuidv4();

async function testCreateAd() {
  await producer.connect();
  await consumer.connect();
  
  // Subscribe to response topics
  await consumer.subscribe({ topic: 'ad.response', fromBeginning: false });
  await consumer.subscribe({ topic: 'ad.error', fromBeginning: false });
  await consumer.subscribe({ topic: 'ad.created', fromBeginning: false });
  
  // Start consuming responses
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const value = JSON.parse(message.value.toString());
      const headers = message.headers;
      
      console.log('\n📨 Received message:');
      console.log('Topic:', topic);
      console.log('Correlation ID:', headers?.correlationId?.toString());
      console.log('Value:', JSON.stringify(value, null, 2));
      
      if (value.success === false) {
        console.log('❌ Error:', value.error);
      }
    }
  });
  
  // Test Ad Creation for different categories
  
  // 1. Test Vehicle Ad
  console.log('\n🚗 Testing Vehicle Ad Creation...');
  await producer.send({
    topic: 'ad.create',
    messages: [
      {
        value: JSON.stringify({
          title: '2023 Honda City for Sale',
          description: 'Excellent condition, single owner, complete service history',
          category: 'Vehicle',
          subCategory: 'Cars',
          userId: 'user123',
          userType: 'Merchant',
          images: ['https://example.com/honda-city-1.jpg', 'https://example.com/honda-city-2.jpg'],
          price: 1500000,
          negotiable: true,
          location: 'Mumbai, Maharashtra',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          latitude: 19.0760,
          longitude: 72.8777,
          contactInfo: {
            name: 'Rajesh Sharma',
            phone: '+919876543210',
            email: 'rajesh@example.com',
            whatsapp: '+919876543210',
            preferredContactMethod: 'phone'
          },
          categorySpecificData: {
            type: 'Sell',
            brand: 'Honda',
            model: 'City',
            year: 2023,
            fuelType: 'Petrol',
            transmission: 'Automatic',
            kilometersDriven: 5000,
            price: 1500000,
            color: 'White',
            insurance: 'Comprehensive',
            registrationNumber: 'MH01AB1234',
            ownerNumber: 1,
            features: ['Sunroof', 'Touchscreen', 'Rear Camera', 'ABS'],
            condition: 'Excellent',
            emiAvailable: true,
            exchangeAvailable: true
          },
          tags: ['honda', 'city', 'car', 'sedan', 'automatic'],
          isPromoted: true,
          promotionPackage: 'Premium'
        }),
        headers: {
          correlationId: correlationId + '-vehicle',
          source: 'test-client'
        }
      }
    ]
  });

  // 2. Test Property Ad
  console.log('\n🏠 Testing Property Ad Creation...');
  await producer.send({
    topic: 'ad.create',
    messages: [
      {
        value: JSON.stringify({
          title: '3 BHK Luxurious Apartment for Rent',
          description: 'Fully furnished apartment with modern amenities',
          category: 'Property',
          subCategory: 'Residential',
          userId: 'user456',
          userType: 'Customer',
          images: ['https://example.com/apartment-1.jpg'],
          price: 45000,
          negotiable: false,
          location: 'Pune, Maharashtra',
          city: 'Pune',
          state: 'Maharashtra',
          pincode: '411001',
          latitude: 18.5204,
          longitude: 73.8567,
          contactInfo: {
            name: 'Priya Patel',
            phone: '+919876543211',
            email: 'priya@example.com',
            preferredContactMethod: 'email'
          },
          categorySpecificData: {
            type: 'Rent',
            propertyType: 'Apartment',
            area: 1500,
            areaUnit: 'sq.ft',
            bedrooms: 3,
            bathrooms: 3,
            balconies: 2,
            furnishing: 'Fully Furnished',
            price: 45000,
            maintenanceCharges: 3000,
            floorNumber: 5,
            totalFloors: 15,
            facing: 'East',
            parking: 'Covered',
            amenities: ['Swimming Pool', 'Gym', 'Club House', 'Security'],
            possessionDate: new Date('2024-01-01'),
            ageOfProperty: 2,
            gatedCommunity: true,
            powerBackup: true
          },
          tags: ['apartment', 'rent', '3bhk', 'furnished']
        }),
        headers: {
          correlationId: correlationId + '-property',
          source: 'test-client'
        }
      }
    ]
  });

  // 3. Test Service Ad (Plumber)
  console.log('\n🔧 Testing Service Ad Creation (Plumber)...');
  await producer.send({
    topic: 'ad.create',
    messages: [
      {
        value: JSON.stringify({
          title: 'Experienced Plumber - 24/7 Service',
          description: '10+ years experience, all types of plumbing work',
          category: 'Service',
          subCategory: 'Home Services',
          userId: 'user789',
          userType: 'Customer',
          images: ['https://example.com/plumber-1.jpg'],
          price: 500,
          negotiable: true,
          location: 'Delhi NCR',
          city: 'Delhi',
          state: 'Delhi',
          pincode: '110001',
          latitude: 28.6139,
          longitude: 77.2090,
          contactInfo: {
            name: 'Ramesh Kumar',
            phone: '+919876543212',
            preferredContactMethod: 'phone'
          },
          categorySpecificData: {
            serviceType: 'Plumber',
            experience: 10,
            qualification: 'ITI Certified',
            specialization: 'Pipe Fitting, Bathroom Installation',
            hourlyRate: 500,
            dailyRate: 3000,
            availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            availableTimeFrom: '08:00',
            availableTimeTo: '20:00',
            emergencyService: true,
            emergencyCharge: 1000,
            serviceArea: ['Delhi', 'Noida', 'Gurgaon'],
            serviceRadius: 20,
            licenseNumber: 'PLUMB12345',
            insured: true,
            professionalTools: true,
            teamSize: 3,
            languages: ['Hindi', 'English']
          },
          tags: ['plumber', 'emergency', 'repair', 'installation']
        }),
        headers: {
          correlationId: correlationId + '-service',
          source: 'test-client'
        }
      }
    ]
  });

  // 4. Test Mobile Ad
  console.log('\n📱 Testing Mobile Ad Creation...');
  await producer.send({
    topic: 'ad.create',
    messages: [
      {
        value: JSON.stringify({
          title: 'iPhone 14 Pro Max - Like New',
          description: 'Bought in Dec 2023, under warranty, with bill and box',
          category: 'Mobiles',
          subCategory: 'Smartphones',
          userId: 'user101',
          userType: 'Customer',
          images: ['https://example.com/iphone-1.jpg', 'https://example.com/iphone-2.jpg'],
          price: 120000,
          negotiable: true,
          location: 'Bangalore, Karnataka',
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560001',
          latitude: 12.9716,
          longitude: 77.5946,
          contactInfo: {
            name: 'Suresh Reddy',
            phone: '+919876543213',
            email: 'suresh@example.com',
            preferredContactMethod: 'whatsapp'
          },
          categorySpecificData: {
            brand: 'Apple',
            model: 'iPhone 14 Pro Max',
            storage: '256GB',
            ram: '6GB',
            color: 'Deep Purple',
            condition: 'Like New',
            batteryHealth: '98%',
            screenSize: '6.7 inch',
            processor: 'A16 Bionic',
            rearCamera: '48MP + 12MP + 12MP',
            frontCamera: '12MP',
            warranty: 'Apple Care+',
            warrantyExpiry: new Date('2024-12-31'),
            boxIncluded: true,
            accessories: ['Charger', 'Cable', 'EarPods'],
            price: 120000,
            originalPrice: 139900,
            imeiNumber: '123456789012345',
            dualSim: true,
            5G: true,
            waterResistant: true,
            fastCharging: true
          },
          tags: ['iphone', 'apple', 'smartphone', 'premium']
        }),
        headers: {
          correlationId: correlationId + '-mobile',
          source: 'test-client'
        }
      }
    ]
  });

  // 5. Test Electronics Ad (TV)
  console.log('\n📺 Testing Electronics Ad Creation (TV)...');
  await producer.send({
    topic: 'ad.create',
    messages: [
      {
        value: JSON.stringify({
          title: 'Sony 55" 4K OLED TV - Bravia',
          description: 'Bought in 2023, in perfect condition, remote included',
          category: 'Electronics & Home appliances',
          subCategory: 'TV',
          userId: 'user102',
          userType: 'Merchant',
          images: ['https://example.com/sony-tv-1.jpg'],
          price: 85000,
          negotiable: true,
          location: 'Chennai, Tamil Nadu',
          city: 'Chennai',
          state: 'Tamil Nadu',
          pincode: '600001',
          latitude: 13.0827,
          longitude: 80.2707,
          contactInfo: {
            name: 'Arun Kumar',
            phone: '+919876543214',
            preferredContactMethod: 'phone'
          },
          categorySpecificData: {
            productType: 'TV',
            brand: 'Sony',
            model: 'Bravia XR-55A80L',
            yearOfPurchase: 2023,
            condition: 'Excellent',
            specifications: {
              'Screen Size': '55 inch',
              'Resolution': '4K OLED',
              'Refresh Rate': '120Hz',
              'HDMI Ports': '4',
              'Smart TV': 'Yes'
            },
            warranty: '2 Years',
            warrantyExpiry: new Date('2025-12-31'),
            accessories: ['Remote', 'Stand', 'Power Cable'],
            price: 85000,
            originalPrice: 120000,
            negotiable: true,
            billAvailable: true,
            boxAvailable: true,
            powerSupply: '220V'
          },
          tags: ['sony', 'tv', 'oled', '4k', 'bravia']
        }),
        headers: {
          correlationId: correlationId + '-electronics',
          source: 'test-client'
        }
      }
    ]
  });

  // 6. Test Furniture Ad
  console.log('\n🪑 Testing Furniture Ad Creation...');
  await producer.send({
    topic: 'ad.create',
    messages: [
      {
        value: JSON.stringify({
          title: 'Premium Wooden Sofa Set - 3+2+1',
          description: 'Teak wood sofa set with premium fabric upholstery',
          category: 'Furniture',
          subCategory: 'Sofa',
          userId: 'user103',
          userType: 'Merchant',
          images: ['https://example.com/sofa-1.jpg'],
          price: 45000,
          negotiable: true,
          location: 'Hyderabad, Telangana',
          city: 'Hyderabad',
          state: 'Telangana',
          pincode: '500001',
          latitude: 17.3850,
          longitude: 78.4867,
          contactInfo: {
            name: 'Venkat Reddy',
            phone: '+919876543215',
            email: 'venkat@example.com',
            preferredContactMethod: 'phone'
          },
          categorySpecificData: {
            furnitureType: 'Sofa',
            material: 'Teak Wood',
            color: 'Brown',
            dimensions: '3 Seater: 210x85x90 cm, 2 Seater: 180x85x90 cm, 1 Seater: 90x85x90 cm',
            weight: 150,
            condition: 'New',
            assemblyRequired: false,
            style: 'Contemporary',
            brand: 'Woodsworth',
            yearOfPurchase: 2024,
            price: 45000,
            originalPrice: 65000,
            negotiable: true,
            deliveryAvailable: true,
            deliveryCharges: 1000
          },
          tags: ['sofa', 'furniture', 'wooden', 'living room']
        }),
        headers: {
          correlationId: correlationId + '-furniture',
          source: 'test-client'
        }
      }
    ]
  });

  console.log('\n✅ All test messages sent!');
  console.log('📝 Check the responses in the consumer logs above.');
  console.log('⏱️  Waiting for responses... (will exit in 10 seconds)');
  
  // Wait for responses
  setTimeout(async () => {
    await producer.disconnect();
    await consumer.disconnect();
    console.log('👋 Test completed, disconnected from Kafka');
    process.exit(0);
  }, 10000);
}

// Run the test
testCreateAd().catch(console.error);