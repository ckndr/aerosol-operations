"""
Comprehensive End-to-End Verification Suite for Alpha Aerosols v2.0
"""

import os
import json
import sqlite3
import unittest
import uuid
from starlette.testclient import TestClient

import engine
from server import app

class TestAlphaAerosolsFullSuite(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.orig_db_path = engine.DB_PATH
        cls.orig_json_path = engine.JSON_PATH
        cls.test_db_path = os.path.join(os.path.dirname(__file__), 'data', 'test_aerosol.db')
        cls.test_json_path = os.path.join(os.path.dirname(__file__), 'data', 'test_production.json')
        cls.test_xlsx = os.path.join(os.path.dirname(__file__), 'data', 'test_suite_sync.xlsx')
        import shutil
        shutil.copyfile(os.path.join(os.path.dirname(__file__), 'Aerosol_Production_Entry.xlsx'), cls.test_xlsx)
        
        # Override paths during tests so master DB is never polluted
        engine.DB_PATH = cls.test_db_path
        engine.JSON_PATH = cls.test_json_path
        engine.seed_master_data(cls.test_db_path, force_reseed=True, demo_data=True)
        cls.data = engine.export_production_json(cls.test_db_path, cls.test_json_path)
        cls.client = TestClient(app)

    @classmethod
    def tearDownClass(cls):
        engine.DB_PATH = cls.orig_db_path
        engine.JSON_PATH = cls.orig_json_path
        # Clean up test DB files
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
        if os.path.exists(cls.test_xlsx):
            try:
                os.remove(cls.test_xlsx)
            except Exception:
                pass
        # Clean up exported job card xlsx files from test run
        for jc in [
            os.path.join(os.path.dirname(__file__), 'data', 'Aerosol_Job_Card_POF_1.xlsx'),
            os.path.join(os.path.dirname(__file__), 'data', 'Aerosol_Job_Card_POF_3.xlsx')
        ]:
            if os.path.exists(jc):
                try:
                    os.remove(jc)
                except Exception:
                    pass
        # Re-seed master DB cleanly so it remains in pre-production state
        engine.seed_master_data(cls.orig_db_path, force_reseed=True, demo_data=False)
        engine.export_production_json(cls.orig_db_path, cls.orig_json_path)

    def test_01_html_shells_anti_tubex_compliance(self):
        """Verify HTML shells are under 400 lines, have ZERO spliced JSON, and data is fetched via state.js."""
        for filename in ['aerosol.html', 'index.html']:
            filepath = os.path.join(os.path.dirname(__file__), filename)
            self.assertTrue(os.path.exists(filepath), f"{filename} must exist")
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
                lines = content.splitlines()

            # Rule 1: < 400 lines
            self.assertLess(len(lines), 400, f"{filename} has {len(lines)} lines, must be < 400")

            # Rule 2: Zero monolithic spliced JSON strings in HTML comments or script tags
            self.assertNotIn("/* DATA_START */", content)
            self.assertNotIn("/* PRODUCTION_DATA */", content)
            self.assertNotIn("window.__INITIAL_DATA__", content)

        # Rule 3: Decoupled asynchronous fetch in js/state.js
        state_path = os.path.join(os.path.dirname(__file__), 'js', 'state.js')
        self.assertTrue(os.path.exists(state_path))
        with open(state_path, 'r', encoding='utf-8') as f:
            state_js = f.read()
        self.assertIn("./data/production.json", state_js)

    def test_02_sqlite_engine_wal_and_schema(self):
        """Verify SQLite WAL mode, foreign keys, and tables."""
        conn = engine.get_connection(self.test_db_path)
        cur = conn.cursor()

        # Check WAL
        cur.execute("PRAGMA journal_mode;")
        mode = cur.fetchone()[0]
        self.assertEqual(mode.lower(), "wal")

        # Check foreign keys
        cur.execute("PRAGMA foreign_keys;")
        fk = cur.fetchone()[0]
        self.assertEqual(fk, 1)

        # Check required tables
        cur.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = {row[0] for row in cur.fetchall()}
        expected_tables = {'orders', 'shifts', 'inventory', 'dispatches', 'bom_standards'}
        self.assertTrue(expected_tables.issubset(tables), f"Missing tables: {expected_tables - tables}")
        conn.close()

    def test_03_physical_yield_inverse_mass_balance(self):
        """
        Verify physical yield-inverse mass balance formulas:
        Gross = Net / (1 - Scrap)
        Avoids Tubex additive error of Net * (1 + Scrap).
        """
        # Internal Lacquer (35% transfer loss -> / 0.65 = 1.5385x)
        net_lacquer = 1.045
        gross_lacquer = engine.calculate_yield_inverse(net_lacquer, 0.35)
        self.assertAlmostEqual(gross_lacquer, net_lacquer / 0.65, places=4)
        self.assertGreater(gross_lacquer, net_lacquer * 1.35) # Yield-inverse > Additive

        # External Base Coat (10% roller loss -> / 0.90 = 1.1111x)
        net_bc = 0.973
        gross_bc = engine.calculate_yield_inverse(net_bc, 0.10)
        self.assertAlmostEqual(gross_bc, net_bc / 0.90, places=4)

        # Overprint Varnish (10% roller loss -> / 0.90 = 1.1111x)
        net_opv = 0.430
        gross_opv = engine.calculate_yield_inverse(net_opv, 0.10)
        self.assertAlmostEqual(gross_opv, net_opv / 0.90, places=4)

        # Printing Inks (10% dry offset loss -> / 0.90)
        net_ink = 0.280
        gross_ink = engine.calculate_yield_inverse(net_ink, 0.10)
        self.assertAlmostEqual(gross_ink, net_ink / 0.90, places=4)

    def test_04_chemical_shelf_life_and_climate_safeguards(self):
        """Verify 6-month countdown alerts and AC climate safeguards for Schekosol coatings."""
        ref_date = "2026-09-12"

        # Normal (<120d)
        normal = engine.evaluate_shelf_life("2026-07-28", 240, ref_date)
        self.assertEqual(normal["status"], "normal")
        self.assertEqual(normal["badge_color"], "#10b981")

        # Warning (>=120d)
        warning = engine.evaluate_shelf_life("2026-05-10", 180, ref_date)
        self.assertEqual(warning["status"], "warning")
        self.assertEqual(warning["badge_color"], "#f59e0b")

        # Critical (>=150d)
        critical = engine.evaluate_shelf_life("2026-04-12", 180, ref_date)
        self.assertEqual(critical["status"], "critical")
        self.assertEqual(critical["badge_color"], "#ef4444")

        # In inventory payload, check for climate sensitive flags
        ac_items = [i for i in self.data["inventory"] if i["is_climate_sensitive"]]
        self.assertGreater(len(ac_items), 0, "Schekosol coatings must be flagged as AC sensitive")
        for itm in ac_items:
            self.assertIn("Air Conditioned", itm["storage_condition"])

    def test_05_single_stage_shift_logging_and_inventory_deduction(self):
        """Test recording a shift logs single-stage finished cans and auto-deducts stock."""
        conn = engine.get_connection(self.test_db_path)
        cur = conn.cursor()
        cur.execute("SELECT balance_qty FROM inventory WHERE item_code = '501';")
        init_slug_stock = cur.fetchone()[0]
        conn.close()

        # Log 10,000 good cans
        shift_id = engine.add_shift_entry(
            shift_date="2026-09-12",
            shift_type="Night",
            pof_id=1,
            product_size="45x160mm",
            good_cans=10000,
            line_scrap=350,
            downtime_hours=0.5,
            downtime_reason="Scheduled line lubrication",
            supervisor="Tariq Mahmood",
            db_path=self.test_db_path
        )
        self.assertGreater(shift_id, 0)

        # Check single-stage tracking metrics
        conn = engine.get_connection(self.test_db_path)
        cur = conn.cursor()
        cur.execute("SELECT good_cans, line_scrap, downtime_hours FROM shifts WHERE id = ?;", (shift_id,))
        shift_rec = cur.fetchone()
        self.assertEqual(shift_rec["good_cans"], 10000)
        self.assertEqual(shift_rec["line_scrap"], 350)

        # Verify raw material stock deduction (gross required for 10,000 cans)
        cur.execute("SELECT balance_qty FROM inventory WHERE item_code = '501';")
        final_slug_stock = cur.fetchone()[0]
        conn.close()

        # Gross slug per 1,000 cans = 22.222 kg. For 10k cans = 222.22 kg
        expected_deduction = round((20.0 / 0.90) * (10000 / 1000.0), 2)
        actual_deduction = round(init_slug_stock - final_slug_stock, 2)
        self.assertAlmostEqual(actual_deduction, expected_deduction, delta=1.0)

    def test_06_rest_api_endpoints(self):
        """Verify all REST API endpoints through Starlette TestClient."""
        # 1. GET /
        res_home = self.client.get("/")
        self.assertEqual(res_home.status_code, 200)

        # 2. GET /api/data
        res_data = self.client.get("/api/data")
        self.assertEqual(res_data.status_code, 200)
        json_data = res_data.json()
        self.assertIn("meta", json_data)
        self.assertIn("kpis", json_data)
        self.assertIn("orders", json_data)
        self.assertIn("shifts", json_data)

        # 3. POST /api/shifts
        res_shift = self.client.post("/api/shifts", json={
            "shift_date": "2026-09-12",
            "shift_type": "Day",
            "pof_id": 1,
            "product_size": "45x160mm",
            "good_cans": 5000,
            "line_scrap": 180,
            "downtime_hours": 0.0,
            "downtime_reason": "None",
            "supervisor": "Tariq Mahmood"
        })
        self.assertEqual(res_shift.status_code, 200)
        self.assertTrue(res_shift.json()["success"])

        # 4. POST /api/orders (unique POF number)
        unique_pof = f"POF-2026-{uuid.uuid4().hex[:6].upper()}"
        res_order = self.client.post("/api/orders", json={
            "pof_number": unique_pof,
            "customer_name": "Test Cosmetics Ltd",
            "product_name": "Test Spray 150ml",
            "product_size": "45x160mm",
            "order_qty": 50000,
            "tolerance_pct": 0.05,
            "order_date": "2026-09-12",
            "due_date": "2026-09-30",
            "artwork_ref": "TEST-ART-1",
            "notes": "Automated test order"
        })
        self.assertEqual(res_order.status_code, 200, res_order.text)
        self.assertTrue(res_order.json()["success"])

        # 5. POST /api/dispatches (unique challan number)
        unique_dc = f"DC-TEST-{uuid.uuid4().hex[:6].upper()}"
        res_disp = self.client.post("/api/dispatches", json={
            "challan_number": unique_dc,
            "dispatch_date": "2026-09-12",
            "pof_id": 1,
            "dispatched_cans": 20000,
            "carton_count": 100,
            "pallet_count": 8,
            "vehicle_number": "TEST-1234",
            "receiver_party": "Test Cosmetics Ltd",
            "driver_name": "Driver Test"
        })
        self.assertEqual(res_disp.status_code, 200, res_disp.text)
        self.assertTrue(res_disp.json()["success"])

        # 6. POST /api/simulate
        res_sim = self.client.post("/api/simulate", json={
            "product_size": "45x160mm",
            "can_qty": 75000,
            "num_colors": 4
        })
        self.assertEqual(res_sim.status_code, 200)
        sim_data = res_sim.json()
        self.assertEqual(sim_data["can_qty"], 75000)
        self.assertIn("summary", sim_data)

        # 7. GET /api/export/job-card/1
        res_jc = self.client.get("/api/export/job-card/1")
        self.assertEqual(res_jc.status_code, 200)
        self.assertGreater(len(res_jc.content), 2000)

    def test_07_service_worker_and_manifest(self):
        """Verify Service Worker and Web App Manifest files and server endpoints."""
        sw_path = os.path.join(os.path.dirname(__file__), 'sw.js')
        self.assertTrue(os.path.exists(sw_path))
        with open(sw_path, 'r', encoding='utf-8') as f:
            sw_text = f.read()
        self.assertIn("alpha-aerosols-v2.0.0", sw_text)
        self.assertIn("caches.match", sw_text)
        self.assertIn("production.json", sw_text)

        manifest_path = os.path.join(os.path.dirname(__file__), 'manifest.json')
        self.assertTrue(os.path.exists(manifest_path))
        with open(manifest_path, 'r', encoding='utf-8') as f:
            manifest_json = json.load(f)
        self.assertEqual(manifest_json["short_name"], "Alpha Aerosols")

        # Verify endpoints served via Starlette server
        res_sw = self.client.get('/sw.js')
        self.assertEqual(res_sw.status_code, 200)
        self.assertEqual(res_sw.headers.get("content-type"), "application/javascript")

        res_mf = self.client.get('/manifest.json')
        self.assertEqual(res_mf.status_code, 200)
        self.assertEqual(res_mf.headers.get("content-type"), "application/manifest+json")

        res_ic = self.client.get('/material_flow.png')
        self.assertEqual(res_ic.status_code, 200)
        self.assertEqual(res_ic.headers.get("content-type"), "image/png")

    def test_08_inventory_burn_rate_and_days_of_stock(self):
        """Verify all warehouse inventory SKUs have accurate non-zero burn rates and coverage."""
        data = engine.export_production_json(self.test_db_path, self.test_json_path)
        inventory = data["inventory"]
        self.assertEqual(len(inventory), 14, "Expected 14 active inventory SKUs")
        for itm in inventory:
            self.assertGreater(itm["daily_burn_rate"], 0.0, f"Item {itm['item_code']} must have non-zero daily burn")
            self.assertLess(itm["days_of_stock"], 900.0, f"Item {itm['item_code']} stock cover must be realistic")

    def test_09_order_status_update_and_job_card_specs(self):
        """Verify order status transitions and custom finish specifications in job card."""
        res = self.client.post("/api/orders/3/status", json={"status": "Completed"})
        self.assertEqual(res.status_code, 200)
        self.assertTrue(res.json()["success"])

        # Check job card export for order 3 (CareLine with Silkmatt varnish)
        res_jc = self.client.get("/api/export/job-card/3")
        self.assertEqual(res_jc.status_code, 200)
        self.assertIn("application/vnd.openxmlformats-officedocument", res_jc.headers.get("content-type", ""))

        # Check job card export with invalid POF returns 404
        res_err = self.client.get("/api/export/job-card/99999")
        self.assertEqual(res_err.status_code, 404)
        self.assertIn("error", res_err.json())

    def test_10_removal_of_plant_operational_standards(self):
        """Verify 'Plant Operational Standards' has been removed from front page and dashboard."""
        for filename in ['aerosol.html', 'index.html', os.path.join('js', 'components', 'dashboard.js')]:
            filepath = os.path.join(os.path.dirname(__file__), filename)
            self.assertTrue(os.path.exists(filepath))
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            self.assertNotIn("Plant Operational Standards", content, f"'Plant Operational Standards' must be removed from {filename}")
            if 'dashboard.js' in filename:
                self.assertIn("Excel Operations & Synchronization", content)

    def test_11_bidirectional_excel_sync_and_api(self):
        """Verify Option A and Option B bidirectional Excel sync REST endpoints end-to-end."""
        # 1. Option A: POST /api/sync/to-excel with isolated test workbook
        res_to = self.client.post("/api/sync/to-excel", json={"file": self.test_xlsx})
        self.assertEqual(res_to.status_code, 200)
        data_to = res_to.json()
        self.assertTrue(data_to["success"])
        self.assertIn("test_suite_sync.xlsx", data_to["filename"])
        self.assertIn("/api/download/workbook/", data_to["download_url"])

        # 2. Option B: POST /api/sync/from-excel with isolated test workbook
        res_from = self.client.post("/api/sync/from-excel", json={"file": self.test_xlsx})
        self.assertEqual(res_from.status_code, 200)
        data_from = res_from.json()
        self.assertTrue(data_from["success"])
        self.assertIn("shifts_imported", data_from)

        # 3. GET /api/download/workbook/Aerosol_Sep26.xlsx
        res_dl = self.client.get("/api/download/workbook/Aerosol_Sep26.xlsx")
        self.assertEqual(res_dl.status_code, 200)
        self.assertIn("application/vnd.openxmlformats-officedocument", res_dl.headers.get("content-type", ""))

if __name__ == "__main__":
    unittest.main()
