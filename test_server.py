"""
Test Suite for REST Server Endpoints
"""

import unittest
import os
import json
from starlette.testclient import TestClient
from server import app
import engine

class TestServerEndpoints(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.orig_db_path = engine.DB_PATH
        cls.orig_json_path = engine.JSON_PATH
        cls.test_db_path = os.path.join(os.path.dirname(__file__), 'data', 'test_server_aerosol.db')
        cls.test_json_path = os.path.join(os.path.dirname(__file__), 'data', 'test_server_production.json')
        engine.DB_PATH = cls.test_db_path
        engine.JSON_PATH = cls.test_json_path
        engine.seed_master_data(cls.test_db_path, force_reseed=True, demo_data=True)
        engine.export_production_json(cls.test_db_path, cls.test_json_path)
        cls.client = TestClient(app)

    @classmethod
    def tearDownClass(cls):
        engine.DB_PATH = cls.orig_db_path
        engine.JSON_PATH = cls.orig_json_path
        for ext in ['', '-wal', '-shm']:
            p = cls.test_db_path + ext
            if os.path.exists(p):
                try:
                    os.remove(p)
                except Exception:
                    pass
        if os.path.exists(cls.test_json_path):
            try:
                os.remove(cls.test_json_path)
            except Exception:
                pass
        jc = os.path.join(os.path.dirname(__file__), 'data', 'Aerosol_Job_Card_POF_1.xlsx')
        if os.path.exists(jc):
            try:
                os.remove(jc)
            except Exception:
                pass

    def test_get_production_data(self):
        res = self.client.get("/api/data")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("meta", data)
        self.assertIn("kpis", data)
        self.assertIn("orders", data)
        self.assertIn("shifts", data)
        self.assertIn("inventory", data)
        self.assertIn("dispatches", data)

    def test_post_simulate_bom(self):
        payload = {
            "product_size": "45x160mm",
            "can_qty": 100000,
            "num_colors": 4
        }
        res = self.client.post("/api/simulate", json=payload)
        self.assertEqual(res.status_code, 200)
        bom = res.json()
        self.assertEqual(bom["product_size"], "45x160mm")
        self.assertEqual(bom["can_qty"], 100000)
        self.assertIn("summary", bom)
        # Slug gross for 100k cans @ 22.222 kg/1000 = 2222.2 kg
        self.assertAlmostEqual(bom["summary"]["slug_gross_kg"], 2222.2, delta=1.0)
        # Lacquer gross for 100k cans @ 1.608 kg/1000 = 160.8 kg
        self.assertAlmostEqual(bom["summary"]["lacquer_gross_kg"], 160.77, delta=1.0)

    def test_export_job_card(self):
        res = self.client.get("/api/export/job-card/1")
        self.assertEqual(res.status_code, 200)
        self.assertIn("application/vnd.openxmlformats-officedocument", res.headers.get("content-type", ""))
        self.assertGreater(len(res.content), 3000)

if __name__ == "__main__":
    unittest.main()
