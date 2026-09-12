"""
Alpha Aerosols (Kot Abdul Malik) — Production & Operations REST Server
Built with Starlette & Uvicorn. Decoupled, asynchronous, robust.
Zero Windows COM automation.
"""

import os
import json
from contextlib import asynccontextmanager
from datetime import datetime
from starlette.applications import Starlette
from starlette.responses import JSONResponse, FileResponse, RedirectResponse
from starlette.routing import Route, Mount
from starlette.staticfiles import StaticFiles
from starlette.middleware import Middleware
from starlette.middleware.cors import CORSMiddleware
import engine

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

@asynccontextmanager
async def lifespan(app):
    engine.seed_master_data()
    engine.export_production_json()
    yield

async def home_redirect(request):
    return FileResponse(os.path.join(BASE_DIR, 'aerosol.html'))

async def service_worker(request):
    return FileResponse(
        os.path.join(BASE_DIR, 'sw.js'),
        media_type='application/javascript',
        headers={"Cache-Control": "no-cache, no-store, must-revalidate"}
    )

async def web_manifest(request):
    return FileResponse(
        os.path.join(BASE_DIR, 'manifest.json'),
        media_type='application/manifest+json',
        headers={"Cache-Control": "no-cache"}
    )

async def app_icon(request):
    icon_path = os.path.join(BASE_DIR, 'material_flow.png')
    if os.path.exists(icon_path):
        return FileResponse(icon_path, media_type='image/png')
    return JSONResponse({"error": "Icon not found"}, status_code=404)

async def get_production_data(request):
    try:
        data = engine.export_production_json()
        return JSONResponse(data)
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)

async def post_shift_entry(request):
    try:
        body = await request.json()
        shift_id = engine.add_shift_entry(
            shift_date=body.get("shift_date"),
            shift_type=body.get("shift_type"),
            pof_id=int(body.get("pof_id")),
            product_size=body.get("product_size", "45x160mm"),
            good_cans=int(body.get("good_cans", 0)),
            line_scrap=int(body.get("line_scrap", 0)),
            downtime_hours=float(body.get("downtime_hours", 0.0)),
            downtime_reason=body.get("downtime_reason", ""),
            supervisor=body.get("supervisor", "Line Supervisor")
        )
        return JSONResponse({"success": True, "shift_id": shift_id, "message": "Shift logged successfully."})
    except Exception as e:
        return JSONResponse({"success": False, "error": str(e)}, status_code=400)

async def post_order(request):
    try:
        body = await request.json()
        order_id = engine.create_order(
            pof_number=body.get("pof_number"),
            customer_name=body.get("customer_name"),
            product_name=body.get("product_name"),
            product_size=body.get("product_size", "45x160mm"),
            order_qty=int(body.get("order_qty", 100000)),
            tolerance_pct=float(body.get("tolerance_pct", 0.05)),
            order_date=body.get("order_date") or datetime.now().strftime("%Y-%m-%d"),
            due_date=body.get("due_date"),
            artwork_ref=body.get("artwork_ref", ""),
            notes=body.get("notes", "")
        )
        return JSONResponse({"success": True, "order_id": order_id, "message": "Order created successfully."})
    except Exception as e:
        return JSONResponse({"success": False, "error": str(e)}, status_code=400)

async def patch_order_status(request):
    try:
        pof_id = int(request.path_params["pof_id"])
        body = await request.json()
        new_status = body.get("status")
        if not new_status:
            return JSONResponse({"success": False, "error": "status is required"}, status_code=400)
        engine.update_order_status(pof_id, new_status)
        return JSONResponse({"success": True, "message": f"Order {pof_id} status updated to {new_status}."})
    except ValueError as ve:
        return JSONResponse({"success": False, "error": str(ve)}, status_code=404)
    except Exception as e:
        return JSONResponse({"success": False, "error": str(e)}, status_code=400)

async def post_dispatch(request):
    try:
        body = await request.json()
        dispatch_id = engine.create_dispatch(
            challan_number=body.get("challan_number"),
            dispatch_date=body.get("dispatch_date"),
            pof_id=int(body.get("pof_id")),
            dispatched_cans=int(body.get("dispatched_cans", 0)),
            carton_count=int(body.get("carton_count", 0)),
            pallet_count=int(body.get("pallet_count", 0)),
            vehicle_number=body.get("vehicle_number", ""),
            receiver_party=body.get("receiver_party", ""),
            driver_name=body.get("driver_name", "")
        )
        return JSONResponse({"success": True, "dispatch_id": dispatch_id, "message": "Dispatch created successfully."})
    except Exception as e:
        return JSONResponse({"success": False, "error": str(e)}, status_code=400)

async def post_simulate_bom(request):
    try:
        body = await request.json()
        product_size = body.get("product_size", "45x160mm")
        can_qty = int(body.get("can_qty", 50000))
        num_colors = int(body.get("num_colors", 4))
        options = {
            "num_colors": num_colors,
            "lacquer_type": body.get("lacquer_type", "gold"),
            "base_coat_type": body.get("base_coat_type", "white"),
            "varnish_type": body.get("varnish_type", "glossy")
        }
        bom = engine.calculate_bom(product_size, can_qty, options)
        return JSONResponse(bom)
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=400)

async def export_job_card(request):
    try:
        pof_id = int(request.path_params["pof_id"])
        out_fn = f"Aerosol_Job_Card_POF_{pof_id}.xlsx"
        out_path = os.path.join(BASE_DIR, "data", out_fn)
        engine.export_job_card_excel(pof_id, out_path)
        return FileResponse(out_path, filename=out_fn, media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    except ValueError as ve:
        return JSONResponse({"error": str(ve)}, status_code=404)
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)

routes = [
    Route("/", endpoint=home_redirect),
    Route("/aerosol.html", endpoint=home_redirect),
    Route("/index.html", endpoint=home_redirect),
    Route("/sw.js", endpoint=service_worker, methods=["GET"]),
    Route("/manifest.json", endpoint=web_manifest, methods=["GET"]),
    Route("/material_flow.png", endpoint=app_icon, methods=["GET"]),
    Route("/favicon.ico", endpoint=app_icon, methods=["GET"]),
    Route("/api/data", endpoint=get_production_data, methods=["GET"]),
    Route("/api/shifts", endpoint=post_shift_entry, methods=["POST"]),
    Route("/api/orders", endpoint=post_order, methods=["POST"]),
    Route("/api/orders/{pof_id:int}/status", endpoint=patch_order_status, methods=["POST", "PATCH"]),
    Route("/api/dispatches", endpoint=post_dispatch, methods=["POST"]),
    Route("/api/simulate", endpoint=post_simulate_bom, methods=["POST"]),
    Route("/api/export/job-card/{pof_id:int}", endpoint=export_job_card, methods=["GET"]),
    Mount("/css", app=StaticFiles(directory=os.path.join(BASE_DIR, "css")), name="css"),
    Mount("/js", app=StaticFiles(directory=os.path.join(BASE_DIR, "js")), name="js"),
    Mount("/data", app=StaticFiles(directory=os.path.join(BASE_DIR, "data")), name="data"),
]

middleware = [
    Middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])
]

app = Starlette(debug=True, routes=routes, middleware=middleware, lifespan=lifespan)

if __name__ == "__main__":
    import uvicorn
    # Seed data on startup if not already seeded
    engine.seed_master_data()
    engine.export_production_json()
    print("Starting Alpha Aerosols Production & Operations Server on http://127.0.0.1:8000")
    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="info")
