#!/usr/bin/env python3
"""Quick test to verify authentication works"""

import os
from pathlib import Path
from dotenv import load_dotenv
import google.auth
from google.auth.transport.requests import Request

# Load .env
env_path = Path(__file__).parent / '.env'
load_dotenv(dotenv_path=env_path)

# Get credentials path
_creds_path = os.getenv('GOOGLE_APPLICATION_CREDENTIALS', '').strip()
GOOGLE_APPLICATION_CREDENTIALS = _creds_path if _creds_path else None

print("Testing authentication...")

try:
    if GOOGLE_APPLICATION_CREDENTIALS:
        if not os.path.exists(GOOGLE_APPLICATION_CREDENTIALS):
            raise FileNotFoundError(f"Service account file not found: {GOOGLE_APPLICATION_CREDENTIALS}")
        os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = GOOGLE_APPLICATION_CREDENTIALS
        print(f"Using service account: {GOOGLE_APPLICATION_CREDENTIALS}")
    else:
        # Remove empty string from env if present
        if 'GOOGLE_APPLICATION_CREDENTIALS' in os.environ:
            env_creds = os.environ.get('GOOGLE_APPLICATION_CREDENTIALS', '').strip()
            if not env_creds:
                del os.environ['GOOGLE_APPLICATION_CREDENTIALS']
        print("Using Application Default Credentials (ADC)")
    
    creds, project = google.auth.default()
    
    if not creds.valid:
        print("Refreshing access token...")
        creds.refresh(Request())
    
    print(f"SUCCESS! Access token generated")
    print(f"   Project: {project}")
    print(f"   Token (first 50 chars): {creds.token[:50]}...")
    
except Exception as e:
    print(f"FAILED: {e}")
    exit(1)
