import datetime
from fastapi import FastAPI, HTTPException
import requests
from dotenv import load_dotenv
from requests.auth import HTTPBasicAuth
from os import getenv

app = FastAPI()

class SpotiAPI:
    BASE_URL = "https://api.spotify.com/v1"
    
    def __init__(self, client_id, client_secret):
        self.client_id = client_id
        self.client_secret = client_secret
        self.token, self.expiration = self.refresh_token()
        
    def refresh_token(self) -> (str, datetime.datetime):
        auth = HTTPBasicAuth(self.client_id, self.client_secret)
        response = requests.post(
            "https://accounts.spotify.com/api/token",
            auth=auth,
            data={"grant_type": "client_credentials"}
        )
        if response.status_code != 200:
            raise Exception("Couldn't get token")
        token = response.json()['access_token']
        expiration = datetime.datetime.now() + datetime.timedelta(seconds=response.json()['expires_in'])
        print(f"Got token {token} that expires at {expiration}")
        return (token, expiration)
    
    def _get(self, url: str, query_params: dict = None):
        print(f"Getting {url} with {query_params}")
        if datetime.datetime.now() > self.expiration:
            self.token, self.expiration = self.refresh_token()
        response = requests.get(
            self.BASE_URL + url,
            headers={"Authorization": f"Bearer {self.token}"},
            params=query_params
        )
        if response.status_code != 200:
            raise Exception("Couldn't get data: "+response.text)
        
        return response.json()
    
    def search(self, params: dict):
        return self._get(f"/search", query_params=params)
    
    def get_track(self, track_id: str):
        return self._get(f"/tracks/{track_id}")

load_dotenv()

api_instance = SpotiAPI(getenv("CLIENT_ID"), getenv("CLIENT_SECRET"))

@app.get("/artist")
async def artist(query: str=""):
    return api_instance.search({
        'type': 'artist',
        'q': query
        })

@app.get("/track")
async def track(name: str="", artist: str=""):
    results = api_instance.search({
        'type': 'track',
        'q': f"{name} artist:{artist}"
    })['tracks']
    if results['total'] == 0:
        return HTTPException(status_code=404, detail="Track not found")
    return api_instance.get_track(track_id=results['items'][0]['id'])

