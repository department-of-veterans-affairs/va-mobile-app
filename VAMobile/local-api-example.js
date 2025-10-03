/**
 * Example Local API Server for VA Mobile App Development
 * 
 * This is a minimal example of a local API server that can be used
 * for development and testing of the VA Mobile app.
 * 
 * IMPORTANT: All endpoints must be under the /mobile path to match
 * the staging/production API structure. The app will automatically
 * append /mobile to your API_ROOT configuration.
 * 
 * To use:
 * 1. Install dependencies: npm install express cors
 * 2. Run: node local-api-example.js
 * 3. Configure app: yarn env:local
 * 4. Start app: yarn start:local
 * 
 * The app will call endpoints like:
 * - http://localhost:3000/mobile/v0/user
 * - http://localhost:3000/mobile/v0/appointments
 * - etc.
 */

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/mobile/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// User profile endpoint
app.get('/mobile/v0/user', (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      errors: 'Unauthorized - Missing or invalid authorization header'
    });
  }

  res.json({
    data: {
      id: 'test-user-123',
      type: 'user',
      attributes: {
        profile: {
          email: 'test.user@va.gov',
          firstName: 'Test',
          middleName: 'Q',
          lastName: 'User',
          birthDate: '1980-01-01'
        },
        services: [
          'appeals',
          'appointments',
          'claims',
          'directDepositBenefits',
          'disabilityRating',
          'genderIdentity',
          'preferredName',
          'militaryServiceHistory'
        ]
      }
    }
  });
});

// Example appointments endpoint
app.get('/mobile/v0/appointments', (req, res) => {
  res.json({
    data: [
      {
        id: 'appt-001',
        type: 'appointment',
        attributes: {
          startDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
          status: 'BOOKED',
          appointmentType: 'VA',
          healthcareService: 'Primary Care',
          location: {
            name: 'VA Medical Center',
            address: {
              street: '123 Main St',
              city: 'Washington',
              state: 'DC',
              zipCode: '20001'
            }
          }
        }
      }
    ],
    meta: {
      pagination: {
        currentPage: 1,
        perPage: 10,
        totalPages: 1,
        totalEntries: 1
      }
    }
  });
});

// Example claims endpoint
app.get('/mobile/v0/claims', (req, res) => {
  res.json({
    data: [
      {
        id: 'claim-001',
        type: 'claim',
        attributes: {
          claimType: 'Compensation',
          claimDate: '2024-01-15',
          claimPhaseType: 'EVIDENCE_GATHERING_REVIEW_DECISION',
          developmentLetterSent: false,
          decisionLetterSent: false,
          documentsNeeded: false,
          updatedAt: '2024-02-01'
        }
      }
    ]
  });
});

// Example messages endpoint
app.get('/mobile/v0/messaging/health/folders', (req, res) => {
  res.json({
    data: [
      {
        id: '0',
        type: 'folder',
        attributes: {
          folderId: 0,
          name: 'Inbox',
          count: 3,
          unreadCount: 1,
          systemFolder: true
        }
      },
      {
        id: '-1',
        type: 'folder',
        attributes: {
          folderId: -1,
          name: 'Sent',
          count: 5,
          unreadCount: 0,
          systemFolder: true
        }
      }
    ]
  });
});

// Catch-all for unimplemented endpoints
app.all('*', (req, res) => {
  console.log(`⚠️  Unimplemented endpoint: ${req.method} ${req.path}`);
  res.status(501).json({
    errors: [{
      title: 'Not Implemented',
      detail: `Endpoint ${req.method} ${req.path} is not implemented in this local server`,
      status: '501'
    }]
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log('╔═══════════════════════════════════════════════════════╗');
  console.log('║   VA Mobile Local API Server                          ║');
  console.log('╠═══════════════════════════════════════════════════════╣');
  console.log(`║   Running on: http://localhost:${PORT}                    ║`);
  console.log(`║   Network:    http://0.0.0.0:${PORT}                      ║`);
  console.log('╠═══════════════════════════════════════════════════════╣');
  console.log('║   Configure the app with:                             ║');
  console.log('║   $ yarn env:local                                    ║');
  console.log('║   $ yarn start:local                                  ║');
  console.log('╚═══════════════════════════════════════════════════════╝');
  console.log('\n✓ Server ready and listening for requests...\n');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n🛑 Server shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n🛑 Server shutting down gracefully...');
  process.exit(0);
});
