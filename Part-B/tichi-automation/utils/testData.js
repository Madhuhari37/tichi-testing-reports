/**
 * Test Data Configuration for Tichi Job Portal Automation
 * Contains all test data used across test suites
 *
 * IMPORTANT: For tests to pass, you need to set up test credentials:
 * Option 1: Set environment variables TICHI_TEST_EMAIL and TICHI_TEST_PASSWORD
 * Option 2: Create a verified test account in the staging environment and update credentials below
 */

module.exports = {
  // Valid user credentials for authenticated tests
  validUser: {
    email: process.env.TICHI_TEST_EMAIL || 'hmadhu625@gmail.com',
    password: process.env.TICHI_TEST_PASSWORD || 'Madhu@9047799007',
    phone: '9876543210',
    name: 'Test User QA',
    firstName: 'Test',
    lastName: 'User'
  },

  // Invalid user credentials for negative tests
  invalidUser: {
    email: 'invalid@nonexistent.com',
    password: 'wrongpassword123'
  },

  // Job search test data
  jobSearch: {
    validKeyword: 'driver',
    validKeyword2: 'delivery',
    invalidKeyword: 'xyznonexistent12345',
    specialCharsKeyword: 'driver/helper',
    location: 'Mumbai',
    location2: 'Delhi',
    salaryMin: 15000,
    salaryMax: 30000,
    // Known job ID from staging environment
    knownJobId: '69f6e5f01760952b08381b2c'
  },

  // Application URLs
  urls: {
    home: '/home',
    jobs: '/jobs',
    jobDetail: '/job?jobId=',
    profile: '/profile',
    preferences: '/profile?tabid=preferences',
    history: '/profile?tabid=history',
    skills: '/profile?tabid=key-skills',
    documents: '/profile?tabid=documents',
    subscription: '/profile?tabid=subscription-plans',
    chat: '/chat',
    createPost: '/create-post',
    login: '/auth/login',
    signup: '/auth/signup'
  },

  // Timeouts (in milliseconds)
  timeouts: {
    short: 3000,
    medium: 5000,
    long: 10000,
    pageLoad: 15000,
    networkRequest: 30000
  },

  // Test payment data (Razorpay test mode)
  payment: {
    testCard: {
      number: '4111111111111111',
      expiry: '12/28',
      cvv: '123',
      name: 'Test User'
    },
    testUPI: 'success@razorpay',
    failedCard: '4000000000000002'
  },

  // Profile data for creating complete profile
  profileData: {
    skills: ['Driving', 'Delivery', 'Customer Service', 'Navigation'],
    experience: {
      company: 'XYZ Logistics',
      role: 'Delivery Driver',
      duration: '2 years',
      startDate: '2022-01-01',
      endDate: '2024-01-01'
    },
    education: {
      qualification: '12th Pass',
      institution: 'Government School',
      year: '2020'
    },
    preferences: {
      jobType: 'Full-time',
      location: 'Mumbai',
      salaryExpectation: '25000'
    }
  },

  // Job posting data (for provider tests)
  jobPostData: {
    title: 'Delivery Driver Needed',
    description: 'We are looking for experienced delivery drivers for our e-commerce logistics team.',
    location: 'Mumbai, Maharashtra',
    salaryMin: 18000,
    salaryMax: 25000,
    jobType: 'Full-time',
    requirements: [
      'Valid driving license',
      '2+ years experience',
      'Knowledge of Mumbai routes'
    ]
  },

  // Messages for chat tests
  chatMessages: {
    initial: 'Hello, I am interested in the driver position.',
    followUp: 'When can I come for an interview?'
  }
};
