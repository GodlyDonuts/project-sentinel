class MockMessage:
    def __init__(self, channel=None, is_final=False):
        self.channel = channel
        self.is_final = is_final

class MockChannel:
    def __init__(self, alternatives=[]):
        self.alternatives = alternatives

class MockAlt:
    def __init__(self, transcript=""):
        self.transcript = transcript

def test_parsing(message):
    print(f"Testing with: {message}")
    transcript_text = ""
    is_final = False
    
    try:
        # Robust parsing for both Object and Dict types
        msg_channel = getattr(message, "channel", None) or (message.get("channel") if isinstance(message, dict) else None)
        msg_is_final = getattr(message, "is_final", None)

        if msg_is_final is None and isinstance(message, dict):
            msg_is_final = message.get("is_final")
        
        if msg_is_final is not None:
            is_final = msg_is_final

        if msg_channel:
            # handle alternatives
            alts = getattr(msg_channel, "alternatives", None) or (msg_channel.get("alternatives") if isinstance(msg_channel, dict) else None)
            
            if alts and len(alts) > 0:
                # Alts[0] might be object or dict
                first_alt = alts[0]
                transcript_text = getattr(first_alt, "transcript", None) or (first_alt.get("transcript") if isinstance(first_alt, dict) else None)
    except Exception as parse_err:
        print(f"Message parsing error: {parse_err}")
    
    print(f"Result -> Final: {is_final}, Text: '{transcript_text}'")
    print("-" * 20)

# Test Cases
# 1. Dict
dict_msg = {
    "channel": {
        "alternatives": [{"transcript": "Hello Dict"}]
    },
    "is_final": True
}
test_parsing(dict_msg)

# 2. Object
obj_msg = MockMessage(
    channel=MockChannel(alternatives=[MockAlt(transcript="Hello Object")]),
    is_final=True
)
test_parsing(obj_msg)

# 3. Mixed (just in case)
# Not really possible but good to check robustness

# 4. Empty Dict
test_parsing({})

# 5. None
test_parsing(None)
