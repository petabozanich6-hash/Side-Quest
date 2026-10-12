"""Existing CartoonEpisode payloads for Written Core. No new UI or media pipeline."""

def room_episode(title, lines):
    payload = []
    for item in lines:
        who, text = item[0], item[1]
        line = {'who': who, 'text': text}
        if len(item) > 2 and item[2]:
            line['pause_after'] = True
        payload.append(line)
    return {
        'episode': {
            'title': title,
            'transcript': '\n'.join(f'{line["who"].title()}: {line["text"]}' for line in payload),
            'scenes': [{'bg': 'room', 'lines': payload}],
        }
    }
