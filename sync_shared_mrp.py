r"""
sync_shared_mrp.py
==================
Alpha Aerosols (Kot Abdul Malik) – Operational Synchronization Utility
Keeps Local Workspace (D:\Aerosol) and Shared OneDrive QMS Folder in 100% Lockstep.

Shared Folder Location:
  C:\Users\HP\OneDrive\Aerosol Shared Files\QMS Documentation\AER-SORs\Planing SORs

Master Workbook:
  Alpha Aerosols - Planning & MRP.xlsx

Archive Folder:
  Record Keeping of Old Job Cards

Usage:
  python sync_shared_mrp.py             # Auto sync (syncs whichever is newer)
  python sync_shared_mrp.py --status    # Check sync status and file hashes
  python sync_shared_mrp.py --push      # Force push local changes to shared folder
  python sync_shared_mrp.py --pull      # Force pull shared changes to local repo & refresh app
"""

import os
import sys
import shutil
import hashlib
import argparse
import datetime

LOCAL_BASE = r"D:\Aerosol"
SHARED_BASE = r"C:\Users\HP\OneDrive\Aerosol Shared Files\QMS Documentation\AER-SORs\Planing SORs"
MASTER_FILE = "Alpha Aerosols - Planning & MRP.xlsx"
ARCHIVE_FOLDER = "Record Keeping of Old Job Cards"
ALT_ARCHIVE_FOLDER = "Issued Job Cards"

LOCAL_MASTER = os.path.join(LOCAL_BASE, MASTER_FILE)
SHARED_MASTER = os.path.join(SHARED_BASE, MASTER_FILE)

LOCAL_ARCHIVE = os.path.join(LOCAL_BASE, ARCHIVE_FOLDER)
SHARED_ARCHIVE = os.path.join(SHARED_BASE, ARCHIVE_FOLDER)

LOCAL_ISSUED = os.path.join(LOCAL_BASE, ALT_ARCHIVE_FOLDER)
SHARED_ISSUED = os.path.join(SHARED_BASE, ALT_ARCHIVE_FOLDER)

def get_file_hash(filepath):
    if not os.path.exists(filepath):
        return None
    h = hashlib.sha256()
    with open(filepath, "rb") as f:
        while chunk := f.read(65536):
            h.update(chunk)
    return h.hexdigest()

def get_file_info(filepath):
    if not os.path.exists(filepath):
        return None
    st = os.stat(filepath)
    mtime = datetime.datetime.fromtimestamp(st.st_mtime)
    return {
        "path": filepath,
        "size": st.st_size,
        "mtime": mtime,
        "hash": get_file_hash(filepath)
    }

def print_status():
    print("=" * 75)
    print("  ALPHA AEROSOLS - MASTER MRP & ARCHIVE SYNCHRONIZATION STATUS")
    print("=" * 75)
    print(f"Local Master:  {LOCAL_MASTER}")
    print(f"Shared Master: {SHARED_MASTER}")
    print("-" * 75)
    
    loc_info = get_file_info(LOCAL_MASTER)
    sha_info = get_file_info(SHARED_MASTER)
    
    if not loc_info:
        print("[!] ERROR: Local master workbook not found!")
    else:
        print(f"Local Master:  {loc_info['size']:,} bytes | Modified: {loc_info['mtime'].strftime('%Y-%m-%d %H:%M:%S')}")
        
    if not sha_info:
        print("[!] WARNING: Shared master workbook not found on OneDrive!")
    else:
        print(f"Shared Master: {sha_info['size']:,} bytes | Modified: {sha_info['mtime'].strftime('%Y-%m-%d %H:%M:%S')}")

    if loc_info and sha_info:
        if loc_info["hash"] == sha_info["hash"]:
            print("\n[OK] STATUS: IN PERFECT SYNC (Hashes match identically)")
        elif loc_info["mtime"] > sha_info["mtime"]:
            diff = (loc_info["mtime"] - sha_info["mtime"]).total_seconds()
            print(f"\n[>] STATUS: LOCAL IS NEWER by {int(diff)}s -> Push recommended (`--push`)")
        else:
            diff = (sha_info["mtime"] - loc_info["mtime"]).total_seconds()
            print(f"\n[<] STATUS: SHARED IS NEWER by {int(diff)}s -> Pull recommended (`--pull`)")
            
    print("-" * 75)
    print(f"Local Archive:  {LOCAL_ARCHIVE} (Exists: {os.path.exists(LOCAL_ARCHIVE)})")
    print(f"Shared Archive: {SHARED_ARCHIVE} (Exists: {os.path.exists(SHARED_ARCHIVE)})")
    print("=" * 75)

def sync_tree(src_dir, dst_dir):
    if not os.path.exists(src_dir):
        return 0
    os.makedirs(dst_dir, exist_ok=True)
    copied = 0
    for root, dirs, files in os.walk(src_dir):
        rel_path = os.path.relpath(root, src_dir)
        target_root = os.path.join(dst_dir, rel_path) if rel_path != "." else dst_dir
        os.makedirs(target_root, exist_ok=True)
        for f in files:
            src_file = os.path.join(root, f)
            dst_file = os.path.join(target_root, f)
            if not os.path.exists(dst_file) or os.path.getmtime(src_file) > os.path.getmtime(dst_file):
                shutil.copy2(src_file, dst_file)
                copied += 1
    return copied

def push_to_shared():
    print("\n--- PUSHING LOCAL CHANGES TO SHARED ONEDRIVE FOLDER ---")
    if not os.path.exists(SHARED_BASE):
        print(f"[!] Target shared folder does not exist: {SHARED_BASE}")
        return False
        
    # Copy Master Workbook
    shutil.copy2(LOCAL_MASTER, SHARED_MASTER)
    print(f"[OK] Master Workbook synchronized: -> {SHARED_MASTER}")
    
    # Sync Archive Folders
    c1 = sync_tree(LOCAL_ARCHIVE, SHARED_ARCHIVE)
    print(f"[OK] Record Keeping of Old Job Cards synced: {c1} files updated -> {SHARED_ARCHIVE}")
    
    # Mirror to Issued Job Cards
    c2 = sync_tree(LOCAL_ARCHIVE, SHARED_ISSUED)
    print(f"[OK] Issued Job Cards mirrored: {c2} files updated -> {SHARED_ISSUED}")
    
    print("[SUCCESS] All local finalized updates pushed to shared folder successfully!\n")
    return True

def pull_from_shared():
    print("\n--- PULLING SHARED ONEDRIVE CHANGES TO LOCAL WORKSPACE ---")
    if not os.path.exists(SHARED_MASTER):
        print(f"[!] Shared master does not exist: {SHARED_MASTER}")
        return False
        
    # Backup local first
    bak_path = LOCAL_MASTER + f".bak_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}"
    if os.path.exists(LOCAL_MASTER):
        shutil.copy2(LOCAL_MASTER, bak_path)
        print(f"[OK] Local backup created: {bak_path}")
        
    shutil.copy2(SHARED_MASTER, LOCAL_MASTER)
    print(f"[OK] Pulled Master Workbook: {SHARED_MASTER} -> {LOCAL_MASTER}")
    
    # Sync Archive Folders
    c1 = sync_tree(SHARED_ARCHIVE, LOCAL_ARCHIVE)
    print(f"[OK] Pulled Record Keeping files: {c1} files updated")
    c2 = sync_tree(LOCAL_ARCHIVE, LOCAL_ISSUED)
    print(f"[OK] Mirrored to local Issued Job Cards: {c2} files updated")
    
    # Refresh engine data
    try:
        import engine
        engine.export_production_json()
        print("[OK] Production database & frontend json refreshed via engine.py")
    except Exception as e:
        print(f"[!] Note: engine.py refresh skipped ({e})")
        
    print("[SUCCESS] Shared folder pulled to local workspace successfully!\n")
    return True

def auto_sync():
    loc_info = get_file_info(LOCAL_MASTER)
    sha_info = get_file_info(SHARED_MASTER)
    
    if not loc_info and not sha_info:
        print("[!] Neither local nor shared master found.")
        return
    if not sha_info:
        push_to_shared()
        return
    if not loc_info:
        pull_from_shared()
        return
        
    if loc_info["hash"] == sha_info["hash"]:
        print("[OK] Workbooks are already in perfect sync.")
        # Ensure archives are synced
        sync_tree(LOCAL_ARCHIVE, SHARED_ARCHIVE)
        sync_tree(LOCAL_ARCHIVE, SHARED_ISSUED)
        print("[OK] Archive directories verified.")
        return
        
    if loc_info["mtime"] >= sha_info["mtime"]:
        print(f"Local master is newer ({loc_info['mtime']}) -> Pushing to shared...")
        push_to_shared()
    else:
        print(f"Shared master is newer ({sha_info['mtime']}) -> Pulling to local...")
        pull_from_shared()

def main():
    parser = argparse.ArgumentParser(description="Synchronize Alpha Aerosols Planning & MRP workbook and job cards.")
    parser.add_argument("--push", action="store_true", help="Push local version to shared folder")
    parser.add_argument("--pull", action="store_true", help="Pull shared folder version to local repo")
    parser.add_argument("--status", action="store_true", help="Display sync status")
    args = parser.parse_args()
    
    if args.status:
        print_status()
    elif args.push:
        push_to_shared()
    elif args.pull:
        pull_from_shared()
    else:
        auto_sync()

if __name__ == "__main__":
    main()
