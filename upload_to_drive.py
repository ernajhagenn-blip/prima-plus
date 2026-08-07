"""
Upload instrumen penelitian PRIMA+ ke Google Drive.
Jalankan: python upload_to_drive.py
Pertama kali akan membuka browser untuk login Google.
"""
import os, json, pickle
from google.auth.transport.requests import Request
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

SCOPES = ['https://www.googleapis.com/auth/drive.file']
FOLDER_ID = '1lj5UfMWz5Cro7ojAdQ27U-9eE2pf_D9z'
ROOT = r'C:\Users\ACER\Documents\Codex\opsi-MAN-2026'
TOKEN_PATH = os.path.join(ROOT, '_aktif', 'drive_token.json')

FILES = [
    'Proposal_Penelitian_PRIMA_OPSI_2026_ISH_Revisi_RAB_Konkret_v2.docx',
    'Laporan_Penelitian_PRIMA_OPSI_2026_Draf_Full_Paper_v2.docx',
    'Instrumen_Penelitian_PRIMA.docx',
    'Tabel_Revisi_Reviewer_PRIMA_OPSI_2026_Revisi_RAB_Konkret.docx',
    'Panduan OPSI SMA Sederajat 2026.pdf',
    'prima_prosedur_ADDIE_HIGH.png',
    'PRIMA_PEER_REVIEW_REPORT.md',
    'PRIMA_RESEARCH_REVIEW.md',
    'AUDIT_SISTEMATIKA_PROPOSAL_PRIMA_OPSI_2026.md',
    'user_profile.json',
]

MIME_TYPES = {
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.pdf': 'application/pdf',
    '.png': 'image/png',
    '.md': 'text/markdown',
    '.json': 'application/json',
}


def get_drive_service():
    creds = None
    if os.path.exists(TOKEN_PATH):
        with open(TOKEN_PATH, 'rb') as f:
            creds = pickle.load(f)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                'credentials.json', SCOPES)  # butuh file credentials.json dari Google Cloud Console
            creds = flow.run_local_server(port=0)
        with open(TOKEN_PATH, 'wb') as f:
            pickle.dump(creds, f)
    return build('drive', 'v3', credentials=creds)


def main():
    service = get_drive_service()
    for fname in FILES:
        fpath = os.path.join(ROOT, fname)
        if not os.path.exists(fpath):
            print(f'SKIP: {fname} not found')
            continue
        ext = os.path.splitext(fname)[1]
        mime = MIME_TYPES.get(ext, 'application/octet-stream')
        media = MediaFileUpload(fpath, mimetype=mime, resumable=True)
        metadata = {'name': fname, 'parents': [FOLDER_ID]}
        file = service.files().create(body=metadata, media_body=media, fields='id').execute()
        print(f'UPLOADED: {fname} -> {file.get("id")}')
    print('\nSelesai! Semua file terupload.')


if __name__ == '__main__':
    main()
