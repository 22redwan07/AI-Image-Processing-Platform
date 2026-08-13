import unittest
import tempfile
import os
from app import create_app

class AdvancedFeaturesTestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app()
        self.client = self.app.test_client()
        self.app.config['TESTING'] = True

    def test_health(self):
        res = self.client.get('/api/health')
        self.assertEqual(res.status_code, 200)
        self.assertIn('healthy', str(res.data))

    # More tests can be added for each endpoint
if __name__ == '__main__':
    unittest.main()
