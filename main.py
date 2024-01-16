import json
import os
import re
import datetime

def get_song_interval(song: dict) -> (datetime.datetime, datetime.datetime):
    return convert_to_start(song['endTime'], song['msPlayed'])
    
def convert_to_start(endTime: str, msPlayed: int) -> (datetime.datetime, datetime.datetime):
    # Convert "endTime" : "2023-08-16 20:02", to a timestamp
    end = datetime.datetime.fromisoformat(endTime)
    # Computes the startTime from the msPlayed
    start = end - datetime.timedelta(milliseconds=msPlayed)
    return (start, end)

# Creates an index.json file matching every StreamingHistoryN.json file with the interval it covers 
def create_index():
    index = {}
    pattern = re.compile(r"^StreamingHistory([0-9]+).json$")
    # List all files
    for file in os.listdir("."):
        print(f"checking {file}")
        # Check if file matches pattern
        if re.match(pattern, file):
            # Load file JSON
            history = json.load(open(file))
            # Find the interval of time between the first and last songs of the history
            start = get_song_interval(history[0])[0].isoformat()
            end = get_song_interval(history[-1])[1].isoformat()
            index[file] = {
                'startTime': start,
                'endTime': end
            }
    # Save index
    with open("index.json", "w") as f:
        json.dump(index, f, indent=4)

def history_file_for_moment(moment: datetime.datetime):
    # Load index
    index = json.load(open("index.json"))
    # Find the file that contains the moment
    for file in index:
        start = datetime.datetime.fromisoformat(index[file]['startTime'])
        end = datetime.datetime.fromisoformat(index[file]['endTime'])
        if start <= moment <= end:
            return file
    # If no file contains the moment, return None
    return None

def find_closest_song(moment: datetime.datetime) -> (dict, (datetime.datetime, datetime.datetime), bool):
    '''Returns the closest song to the moment, and whether the moment is in the interval of the song'''
    # Find the file that contains the moment
    file = history_file_for_moment(moment)
    # If no file contains the moment, return None
    if file is None:
        print("No file contains the moment")
        return None
    # Load the file
    history = json.load(open(file))
    i = 0
    # Find the closest song
    closest_entry = history[i]
    closest_interval = get_song_interval(closest_entry)
    # While the beginning of this entry is before the searched moment
    while closest_interval[0] < moment:
        if closest_interval[0] < moment < closest_interval[1]:
            # If the moment is in the interval of this song, return it
            return closest_entry, closest_interval, True
        # Update the closest entry
        i += 1
        closest_entry = history[i]
        closest_interval = get_song_interval(closest_entry)
    return closest_entry, closest_interval, False


if __name__ == '__main__':
    create_index()
    last_year_this_time = datetime.datetime.fromisoformat('2023-01-08 08:58')
    result = find_closest_song(last_year_this_time)
    if result is None:
        print("No song found")
        exit()
    entry, interval, playing = result
    if playing:
        print(f"You were listening to a song at this exact time last year!")
    else:
        print(f"You were not listening to a song at this exact time last year. But the closest one is")
    print(f"{entry['trackName']} by {entry['artistName']}")
    print(f"It was playing from {interval[0].strftime('%-H:%M')} to {interval[1].strftime('%-H:%M')} on {interval[0].strftime('%A, %-d. %B %Y')}")
